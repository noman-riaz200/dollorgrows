import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/deposits - List all pending/completed deposits
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deposits = await prisma.transaction.findMany({
      where: { type: "deposit" },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ deposits });
  } catch (error) {
    console.error("Admin deposits error:", error);
    return NextResponse.json({ error: "Failed to fetch deposits" }, { status: 500 });
  }
}

// POST /api/admin/deposits - Approve or reject a deposit
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { transactionId, action, notes } = body; // action: "approve" | "reject"

    if (!transactionId || !action) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction || transaction.type !== "deposit") {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    if (transaction.status !== "pending") {
      return NextResponse.json({ error: "Transaction already processed" }, { status: 400 });
    }

    if (action === "approve") {
      await prisma.$transaction(async (tx) => {
        await tx.wallet.update({
          where: { userId: transaction.userId },
          data: { balanceWallet: { increment: transaction.amount } },
        });

        await tx.transaction.update({
          where: { id: transactionId },
          data: { status: "confirmed", description: notes || "Deposit approved by admin" },
        });

        await tx.notification.create({
          data: {
            userId: transaction.userId,
            title: "Deposit Approved",
            message: `Your deposit of $${transaction.amount} has been approved.`,
            type: "success",
          },
        });
      });

      return NextResponse.json({ success: true, message: "Deposit approved" });
    } else if (action === "reject") {
      await prisma.$transaction(async (tx) => {
        await tx.transaction.update({
          where: { id: transactionId },
          data: { status: "rejected", description: notes || "Deposit rejected by admin" },
        });

        await tx.notification.create({
          data: {
            userId: transaction.userId,
            title: "Deposit Rejected",
            message: `Your deposit of $${transaction.amount} has been rejected.`,
            type: "error",
          },
        });
      });

      return NextResponse.json({ success: true, message: "Deposit rejected" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin deposit action error:", error);
    return NextResponse.json({ error: "Failed to process deposit" }, { status: 500 });
  }
}

