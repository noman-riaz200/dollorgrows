import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      phone,
      phoneCode,
      country,
      password,
      referralCode,
    } = result.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    // Validate referral code if provided
    let sponsorId: string | undefined;
    if (referralCode) {
      const sponsor = await prisma.user.findUnique({
        where: { referralCode },
      });
      if (!sponsor) {
        return NextResponse.json(
          { success: false, message: "Invalid referral code" },
          { status: 400 }
        );
      }
      sponsorId = sponsor.id;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with wallet
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        securityPin: "0000", // Default PIN, user should change later
        phone,
        phoneCode,
        country,
        sponsorId,
        wallet: {
          create: {},
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create account" },
      { status: 500 }
    );
  }
}

