import { seed } from "~/server/db/seed";

async function main() {
    try {
        await seed();
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

main(); 