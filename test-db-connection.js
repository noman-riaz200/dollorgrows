const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('Testing MySQL database connection via Prisma...');
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    // Test connection by querying the database version
    console.log('Attempting to connect to database...');
    
    // Try to get some basic info
    const result = await prisma.$queryRaw`SELECT 1 as connection_test`;
    console.log('✅ Database connection successful!');
    console.log('Connection test result:', result);

    // Check if users table exists and count records
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ Users table exists with ${userCount} records`);
    } catch (err) {
      console.log('⚠️ Users table may not exist or may be empty:', err.message);
    }

    // Check if wallets table exists
    try {
      const walletCount = await prisma.wallet.count();
      console.log(`✅ Wallets table exists with ${walletCount} records`);
    } catch (err) {
      console.log('⚠️ Wallets table may not exist or may be empty:', err.message);
    }

    // List all tables in the database
    try {
      const tables = await prisma.$queryRaw`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = DATABASE()
      `;
      console.log('📊 Database tables:', tables);
    } catch (err) {
      console.log('Could not list tables:', err.message);
    }

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Prisma client disconnected.');
  }
}

// Run the test
testConnection().catch(console.error);