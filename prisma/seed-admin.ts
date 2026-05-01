import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@dollorgrows.com';
  const adminPassword = 'AdminPassword123!';
  const securityPin = '1234';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Check if admin already exists
  let admin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!admin) {
    admin = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        securityPin: securityPin,
        role: 'admin',
        status: 'active',
      },
    });
    console.log(`Admin created successfully!`);
  } else {
    // If admin exists, just update the password and role to ensure access
    admin = await prisma.user.update({
      where: { email: adminEmail },
      data: {
        password: hashedPassword,
        securityPin: securityPin,
        role: 'admin',
        status: 'active',
      },
    });
    console.log(`Admin updated successfully!`);
  }

  // Ensure admin has a wallet
  const wallet = await prisma.wallet.findUnique({
    where: { userId: admin.id }
  });

  if (!wallet) {
    await prisma.wallet.create({
      data: {
        userId: admin.id,
        balanceWallet: 0,
        poolWallet: 0,
        poolCommission: 0,
      }
    });
    console.log(`Admin wallet created.`);
  }

  console.log(`=================================`);
  console.log(`Admin Login Details:`);
  console.log(`Email:    ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log(`PIN:      ${securityPin}`);
  console.log(`=================================`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
