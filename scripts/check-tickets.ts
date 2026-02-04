
import "dotenv/config";
import { db } from "../lib/db";
import { ticket, user } from "../lib/db/schema";

async function main() {
    console.log("--- Users ---");
    const users = await db.select().from(user);
    users.forEach(u => console.log(`${u.id}: ${u.email} (${u.name})`));

    console.log("\n--- Tickets ---");
    const tickets = await db.query.ticket.findMany({
        with: {
            user: true,
            type: true
        }
    });

    if (tickets.length === 0) {
        console.log("No tickets found.");
    } else {
        tickets.forEach(t => {
            console.log(`Ticket ID: ${t.id}`);
            console.log(`  User: ${t.user.email} (${t.userId})`);
            console.log(`  Type: ${t.type.name}`);
            console.log(`  Status: ${t.status}`);
            console.log(`  Order: ${t.orderId}`);
        });
    }
    process.exit(0);
}

main().catch(console.error);
