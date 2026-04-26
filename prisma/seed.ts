import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database for dollorgrows...");

  const pools = [
    {
      name: "Genesis Pool",
      description: "The founders pool with 100% matrix bonus. Highest priority and exclusive early-access benefits.",
      minimumInvestment: 100,
      maximumInvestment: 1000,
      dailyReturn: 2.0,
      durationDays: 30,
      level1Commission: 10,
      level2Commission: 5,
      level3Commission: 3,
      bonusPercent: 100,
    },
    {
      name: "Starter Pool",
      description: "Perfect for beginners. Low investment, steady daily returns.",
      minimumInvestment: 50,
      maximumInvestment: 500,
      dailyReturn: 1.5,
      durationDays: 30,
      level1Commission: 10,
      level2Commission: 5,
      level3Commission: 3,
      bonusPercent: 30,
    },
    {
      name: "Bronze Pool",
      description: "Moderate investment with enhanced returns.",
      minimumInvestment: 500,
      maximumInvestment: 2000,
      dailyReturn: 2.0,
      durationDays: 45,
      level1Commission: 10,
      level2Commission: 5,
      level3Commission: 3,
      bonusPercent: 30,
    },
    {
      name: "Silver Pool",
      description: "Solid mid-tier investment with good profit potential.",
      minimumInvestment: 2000,
      maximumInvestment: 5000,
      dailyReturn: 2.5,
      durationDays: 60,
      level1Commission: 10,
      level2Commission: 5,
      level3Commission: 3,
      bonusPercent: 30,
    },
    {
      name: "Gold Pool",
      description: "Premium investment with attractive daily returns.",
      minimumInvestment: 5000,
      maximumInvestment: 10000,
      dailyReturn: 3.0,
      durationDays: 75,
      level1Commission: 10,
      level2Commission: 5,
      level3Commission: 3,
      bonusPercent: 30,
    },
    {
      name: "Platinum Pool",
      description: "High-value pool for serious investors.",
      minimumInvestment: 10000,
      maximumInvestment: 25000,
      dailyReturn: 3.5,
      durationDays: 90,
      level1Commission: 10,
      level2Commission: 5,
      level3Commission: 3,
      bonusPercent: 30,
    },
    {
      name: "Diamond Pool",
      description: "Elite pool with substantial returns.",
      minimumInvestment: 25000,
      maximumInvestment: 50000,
      dailyReturn: 4.0,
      durationDays: 120,
      level1Commission: 10,
      level2Commission: 5,
      level3Commission: 3,
      bonusPercent: 30,
    },
    {
      name: "VIP Pool 1",
      description: "VIP exclusive pool with enhanced commission structure.",
      minimumInvestment: 50000,
      maximumInvestment: 100000,
      dailyReturn: 4.5,
      durationDays: 150,
      level1Commission: 12,
      level2Commission: 6,
      level3Commission: 4,
      bonusPercent: 30,
    },
    {
      name: "VIP Pool 2",
      description: "Premium VIP pool with accelerated growth.",
      minimumInvestment: 100000,
      maximumInvestment: 250000,
      dailyReturn: 5.0,
      durationDays: 180,
      level1Commission: 12,
      level2Commission: 6,
      level3Commission: 4,
      bonusPercent: 30,
    },
    {
      name: "Ultimate Pool",
      description: "The ultimate investment opportunity with maximum returns.",
      minimumInvestment: 250000,
      maximumInvestment: 500000,
      dailyReturn: 5.5,
      durationDays: 210,
      level1Commission: 12,
      level2Commission: 6,
      level3Commission: 4,
      bonusPercent: 30,
    },
    {
      name: "Matrix Booster",
      description: "Special pool designed to accelerate matrix earnings.",
      minimumInvestment: 200,
      maximumInvestment: 2000,
      dailyReturn: 1.0,
      durationDays: 15,
      level1Commission: 15,
      level2Commission: 8,
      level3Commission: 5,
      bonusPercent: 30,
    },
    {
      name: "Quick Return",
      description: "Short-term high-yield pool for quick profits.",
      minimumInvestment: 300,
      maximumInvestment: 3000,
      dailyReturn: 2.2,
      durationDays: 14,
      level1Commission: 10,
      level2Commission: 5,
      level3Commission: 3,
      bonusPercent: 30,
    },
    {
      name: "Long Term Growth",
      description: "Extended duration for compound growth.",
      minimumInvestment: 5000,
      maximumInvestment: 50000,
      dailyReturn: 3.2,
      durationDays: 365,
      level1Commission: 10,
      level2Commission: 5,
      level3Commission: 3,
      bonusPercent: 30,
    },
    {
      name: "Whale Pool",
      description: "For high net worth individuals seeking maximum returns.",
      minimumInvestment: 500000,
      maximumInvestment: 1000000,
      dailyReturn: 6.0,
      durationDays: 270,
      level1Commission: 15,
      level2Commission: 8,
      level3Commission: 5,
      bonusPercent: 30,
    },
    {
      name: "Team Builder",
      description: "Specially designed to help build your downline with bonuses.",
      minimumInvestment: 1000,
      maximumInvestment: 10000,
      dailyReturn: 2.0,
      durationDays: 90,
      level1Commission: 12,
      level2Commission: 7,
      level3Commission: 4,
      bonusPercent: 30,
    },
  ];

  for (const poolData of pools) {
    try {
      const pool = await prisma.pool.create({
        data: poolData,
      });
      console.log(`✓ Created pool: ${pool.name}`);
    } catch (error: any) {
      if (error.code === "P2002") {
        console.log(`✓ Pool already exists: ${poolData.name}`);
      } else {
        throw error;
      }
    }
  }

  const adminPassword = await bcrypt.hash("admin123", 12);
  const adminPin = await bcrypt.hash("123456", 12);

  let demoUser = await prisma.user.findFirst({
    where: { email: "admin@dollorgrows.com" },
  });

  if (!demoUser) {
    demoUser = await prisma.user.create({
      data: {
        name: "DollorGrows Administrator",
        email: "admin@dollorgrows.com",
        password: adminPassword,
        securityPin: adminPin,
        referralCode: "DOLLOR2024",
        role: "admin",
      },
    });

    await prisma.wallet.create({
      data: {
        userId: demoUser.id,
        balanceWallet: 1000,
        poolWallet: 5000,
        poolCommission: 2500,
      },
    });

    console.log(`✓ Created demo admin: ${demoUser.name}`);

    const slotPromises = Array.from({ length: 15 }, (_, i) =>
      prisma.matrixSlot.create({
        data: {
          ownerId: demoUser!.id,
          position: i + 1,
          isFilled: false,
          bonusAmount: 0,
        },
      })
    );
    await Promise.all(slotPromises);
    console.log("✓ Created 15 matrix slots for demo user");
  }

  console.log("✅ Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

