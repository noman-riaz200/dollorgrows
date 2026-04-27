import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pinSchema } from "@/lib/validations/settings";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = pinSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { pin } = result.data;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { securityPin: pin },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PIN update error:", error);
    return NextResponse.json(
      { error: "Failed to update security PIN" },
      { status: 500 }
    );
  }
}

