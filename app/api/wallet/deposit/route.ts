import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// POST /api/wallet/deposit - Create a deposit request
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, txHash } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // In production, verify blockchain transaction here

    // Create wallet transaction
    const transaction = await prisma.walletTransaction.create({
      data: {
        userId: session.user.id,
        type: "deposit",
        amount,
        txHash: txHash || null,
        status: "pending",
        description: "BEP20 Token Deposit",
      },
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error("Deposit error:", error);
    return NextResponse.json(
      { error: "Failed to process deposit" },
      { status: 500 }
    );
  }
}

// GET /api/wallet/transactions - Get user's transactions
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const transactions = await prisma.walletTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    const total = await prisma.walletTransaction.count({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ transactions, total, limit, offset });
  } catch (error) {
    console.error("Get transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
