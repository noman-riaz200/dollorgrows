import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
  usdt_trc20_address: "",
  usdt_erc20_address: "",
  platform_fee_percent: "2",
  min_withdrawal: "10",
  maintenance_mode: "false",
};

// GET /api/admin/settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.settings.findMany();
    const settingsMap: Record<string, string> = {};

    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    // Fill defaults for missing keys
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      if (!settingsMap[key]) {
        settingsMap[key] = value;
      }
    }

    return NextResponse.json({ settings: settingsMap });
  } catch (error) {
    console.error("Admin settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PUT /api/admin/settings
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: "Missing key or value" }, { status: 400 });
    }

    await prisma.settings.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin settings update error:", error);
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
}

