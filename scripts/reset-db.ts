
import { PrismaClient } from '@prisma/client';

const databaseUrl = process.argv[2];

if (!databaseUrl) {
    console.error("Please provide a database URL.");
    process.exit(1);
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: databaseUrl,
        },
    },
});

async function main() {
    try {
        console.log("Connecting...");
        await prisma.$connect();

        console.log("Resetting public schema...");
        // This is destructive! Only use if you are sure.
        await prisma.$executeRawUnsafe(`DROP SCHEMA public CASCADE;`);
        await prisma.$executeRawUnsafe(`CREATE SCHEMA public;`);
        await prisma.$executeRawUnsafe(`GRANT ALL ON SCHEMA public TO public;`);
        await prisma.$executeRawUnsafe(`COMMENT ON SCHEMA public IS 'standard public schema';`);

        console.log("Schema reset successful!");
    } catch (e) {
        console.error("Reset failed:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
