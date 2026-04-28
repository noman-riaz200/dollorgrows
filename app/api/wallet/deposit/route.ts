import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/wallet/deposit - Get user's transactions + deposit addresses
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const [transactions, total, settings] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.transaction.count({
        where: { userId: session.user.id },
      }),
      prisma.settings.findMany({
        where: {
          key: { in: ["usdt_trc20_address", "usdt_erc20_address"] },
        },
      }),
    ]);

    const addresses: Record<string, string> = {};
    for (const s of settings) {
      addresses[s.key] = s.value;
    }

    return NextResponse.json({
      transactions,
      total,
      limit,
      offset,
      addresses: {
        trc20: addresses.usdt_trc20_address || "",
        erc20: addresses.usdt_erc20_address || "",
      },
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST /api/wallet/deposit - Create a USDT deposit request
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, txHash, network } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!txHash || txHash.trim().length < 10) {
      return NextResponse.json(
        { error: "Transaction ID (TxHash) is required" },
        { status: 400 }
      );
    }

    if (!network || !["trc20", "erc20"].includes(network)) {
      return NextResponse.json(
        { error: "Network must be trc20 or erc20" },
        { status: 400 }
      );
    }

    // Get deposit address for the selected network
    const settingKey =
      network === "trc20" ? "usdt_trc20_address" : "usdt_erc20_address";
    const setting = await prisma.settings.findUnique({
      where: { key: settingKey },
    });

    if (!setting || !setting.value) {
      return NextResponse.json(
        { error: "Deposit address not configured. Contact admin." },
        { status: 400 }
      );
    }

    // Check if txHash already exists
    const existing = await prisma.transaction.findUnique({
      where: { txHash: txHash.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This transaction ID has already been submitted" },
        { status: 409 }
      );
    }

    // Create pending transaction for admin approval
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: "deposit",
        amount,
        txHash: txHash.trim(),
        status: "pending",
        network,
        depositAddress: setting.value,
        description: `USDT (${network.toUpperCase()}) deposit - awaiting admin approval`,
      },
    });

    // Notify admin (optional - could use a real notification system)
    // For now, admin will see it in the deposits panel

    return NextResponse.json({
      success: true,
      transaction,
      message: "Deposit submitted for admin approval. Your balance will be updated once approved.",
    });
  } catch (error) {
    console.error("Deposit error:", error);
    return NextResponse.json(
      { error: "Failed to process deposit" },
      { status: 500 }
    );
  }
}

