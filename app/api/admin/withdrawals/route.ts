import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/withdrawals - List all withdrawal requests
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const withdrawals = await prisma.withdrawalRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ withdrawals });
  } catch (error) {
    console.error("Admin withdrawals error:", error);
    return NextResponse.json({ error: "Failed to fetch withdrawals" }, { status: 500 });
  }
}

// POST /api/admin/withdrawals - Approve or reject a withdrawal
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { withdrawalId, action, txHash, notes } = body; // action: "approve" | "reject"

    if (!withdrawalId || !action) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const withdrawal = await prisma.withdrawalRequest.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      return NextResponse.json({ error: "Withdrawal not found" }, { status: 404 });
    }

    if (withdrawal.status !== "pending") {
      return NextResponse.json({ error: "Withdrawal already processed" }, { status: 400 });
    }

    if (action === "approve") {
      await prisma.$transaction(async (tx) => {
        await tx.withdrawalRequest.update({
          where: { id: withdrawalId },
          data: {
            status: "approved",
            txHash: txHash || null,
            notes: notes || null,
            processedAt: new Date(),
          },
        });

        await tx.transaction.updateMany({
          where: {
            userId: withdrawal.userId,
            type: "withdrawal",
            amount: -withdrawal.amount,
            status: "pending",
          },
          data: { status: "confirmed", description: notes || "Withdrawal approved by admin" },
        });

        await tx.notification.create({
          data: {
            userId: withdrawal.userId,
            title: "Withdrawal Approved",
            message: `Your withdrawal of $${withdrawal.amount} has been approved.`,
            type: "success",
          },
        });
      });

      return NextResponse.json({ success: true, message: "Withdrawal approved" });
    } else if (action === "reject") {
      await prisma.$transaction(async (tx) => {
        // Return balance to user
        await tx.wallet.update({
          where: { userId: withdrawal.userId },
          data: { balanceWallet: { increment: withdrawal.amount } },
        });

        await tx.withdrawalRequest.update({
          where: { id: withdrawalId },
          data: {
            status: "rejected",
            notes: notes || "Withdrawal rejected by admin",
            processedAt: new Date(),
          },
        });

        await tx.transaction.updateMany({
          where: {
            userId: withdrawal.userId,
            type: "withdrawal",
            amount: -withdrawal.amount,
            status: "pending",
          },
          data: { status: "rejected", description: notes || "Withdrawal rejected by admin" },
        });

        await tx.notification.create({
          data: {
            userId: withdrawal.userId,
            title: "Withdrawal Rejected",
            message: `Your withdrawal of $${withdrawal.amount} has been rejected. Funds returned to your balance.`,
            type: "error",
          },
        });
      });

      return NextResponse.json({ success: true, message: "Withdrawal rejected" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin withdrawal action error:", error);
    return NextResponse.json({ error: "Failed to process withdrawal" }, { status: 500 });
  }
}

