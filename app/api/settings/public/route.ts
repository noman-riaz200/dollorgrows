import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/settings/public - Public settings (deposit addresses, etc.)
export async function GET() {
  try {
    const keys = [
      "usdt_trc20_address",
      "usdt_erc20_address",
      "min_withdrawal",
      "maintenance_mode",
    ];

    const settings = await prisma.settings.findMany({
      where: { key: { in: keys } },
    });

    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }

    return NextResponse.json({
      addresses: {
        trc20: result.usdt_trc20_address || "",
        erc20: result.usdt_erc20_address || "",
      },
      minWithdrawal: parseFloat(result.min_withdrawal || "10"),
      maintenanceMode: result.maintenance_mode === "true",
    });
  } catch (error) {
    console.error("Public settings error:", error);
    return NextResponse.json(
      { addresses: { trc20: "", erc20: "" }, minWithdrawal: 10, maintenanceMode: false },
      { status: 200 }
    );
  }
}
