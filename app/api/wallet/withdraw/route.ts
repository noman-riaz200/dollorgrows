import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/wallet/withdraw — create withdrawal request
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { amount, walletAddress } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!walletAddress || walletAddress.trim().length < 10) {
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet || wallet.balanceWallet < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Deduct balance immediately (escrow-like)
    await prisma.wallet.update({
      where: { userId },
      data: {
        balanceWallet: { decrement: amount },
      },
    });

    // Create withdrawal request
    const withdrawal = await prisma.withdrawalRequest.create({
      data: {
        userId,
        amount,
        walletAddress: walletAddress.trim(),
        status: "pending",
      },
    });

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: "withdrawal",
        amount: -amount,
        status: "pending",
        description: `Withdrawal to ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      },
    });

    return NextResponse.json({ success: true, withdrawal, transaction });
  } catch (error) {
    console.error("Withdrawal API error:", error);
    return NextResponse.json(
      { error: "Failed to process withdrawal" },
      { status: 500 }
    );
  }
}

