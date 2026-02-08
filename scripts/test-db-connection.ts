
import { PrismaClient } from '@prisma/client';

const databaseUrl = process.argv[2];

if (!databaseUrl) {
    console.error("Please provide a database URL as a command line argument.");
    process.exit(1);
}

console.log(`Testing connection to: ${databaseUrl.replace(/:([^:@]+)@/, ':****@')}...`);

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: databaseUrl,
        },
    },
});

async function main() {
    try {
        await prisma.$connect();
        console.log("Successfully connected to the database!");

        // Try a simple query
        const result = await prisma.$queryRaw`SELECT 1 as result`;
        console.log("Query 'SELECT 1' executed successfully.");

        // Check for specific tables
        const expectedTables = ['Member', 'Event', 'Registration', 'Donation'];

        const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;

        const existingTables = new Set(tables.map(t => t.table_name));
        console.log("\nFound tables:", Array.from(existingTables).sort().join(', '));

        const missingTables = expectedTables.filter(t => !existingTables.has(t));

        if (missingTables.length === 0) {
            console.log("\n[SUCCESS] All critical tables exist!");
        } else {
            console.warn("\n[WARNING] Missing critical tables:", missingTables.join(', '));
            console.warn("You likely need to run database migrations: bunx prisma db push");
        }

    } catch (error) {
        console.error("\n[ERROR] Connection failed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
