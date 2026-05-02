import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/admin/users/[id]/block - Toggle block/unblock user
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;
    const body = await request.json();
    const { status } = body; // "active" | "blocked"

    if (!status || !["active", "blocked"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "admin") {
      return NextResponse.json({ error: "Cannot block admin" }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status },
    });

    await prisma.notification.create({
      data: {
        userId,
        title: status === "blocked" ? "Account Blocked" : "Account Restored",
        message: status === "blocked"
          ? "Your account has been blocked by admin. Contact support for more information."
          : "Your account has been restored. You can now access all features.",
        type: status === "blocked" ? "error" : "success",
      },
    });

    return NextResponse.json({
      success: true,
      user: { id: updatedUser.id, status: updatedUser.status },
    });
  } catch (error) {
    console.error("Block user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

