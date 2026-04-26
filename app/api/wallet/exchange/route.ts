import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/wallet/exchange — exchange between balance and pool wallets
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { fromType, toType, amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!fromType || !toType || fromType === toType) {
      return NextResponse.json(
        { error: "Invalid exchange direction" },
        { status: 400 }
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    const sourceField =
      fromType === "balance" ? "balanceWallet" : "poolWallet";
    const targetField =
      toType === "balance" ? "balanceWallet" : "poolWallet";

    if (wallet[sourceField] < amount) {
      return NextResponse.json(
        { error: "Insufficient balance in source wallet" },
        { status: 400 }
      );
    }

    // Atomic update
    await prisma.wallet.update({
      where: { userId },
      data: {
        [sourceField]: { decrement: amount },
        [targetField]: { increment: amount },
      },
    });

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: "exchange",
        amount,
        status: "completed",
        description: `Exchanged ${amount} USD from ${fromType} wallet to ${toType} wallet`,
      },
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error("Exchange API error:", error);
    return NextResponse.json(
      { error: "Failed to process exchange" },
      { status: 500 }
    );
  }
}

