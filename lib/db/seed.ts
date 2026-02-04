import "dotenv/config";
import { db } from "./index";
import { ticketType, festivalDay, conference, ticket, order } from "./schema/index";
import { v4 as uuidv4 } from "uuid";

async function main() {
    console.log("🌱 Seeding database...");
    console.log("Cleaning up old data...");
    try {
        console.log("Deleting tickets...");
        await db.delete(ticket);
        console.log("Deleting orders...");
        await db.delete(order);

        console.log("Deleting ticket types...");
        await db.delete(ticketType);

        console.log("Deleting conferences...");
        await db.delete(conference);

        console.log("Deleting festival days...");
        await db.delete(festivalDay);
    } catch (e) {
        console.warn("Cleanup failed (maybe tables empty or constraints):", e);
    }

    console.log("Creating festival days...");
    await db.insert(festivalDay).values([
        {
            id: uuidv4(),
            name: "Vendredi 17 Juillet",
            date: new Date("2026-07-17T00:00:00"),
            maxCapacity: 2000,
        },
        {
            id: uuidv4(),
            name: "Samedi 18 Juillet",
            date: new Date("2026-07-18T00:00:00"),
            maxCapacity: 2000,
        },
        {
            id: uuidv4(),
            name: "Dimanche 19 Juillet",
            date: new Date("2026-07-19T00:00:00"),
            maxCapacity: 2000,
        },
    ]);

    console.log("Creating conferences...");
    await db.insert(conference).values([
        {
            id: uuidv4(),
            title: "L'Architecture de Demain",
            description: "Comment construire durablement en 2030 ? Une exploration des matériaux bio-sourcés.",
            theme: "Écologie & Habitat",
            startAt: new Date("2026-07-17T10:00:00"),
            endAt: new Date("2026-07-17T11:30:00"),
            speakerName: "Jean Nouvel (Invité)",
            location: "Grande Scène",
            maxCapacity: 100,
        },
        {
            id: uuidv4(),
            title: "L'Océan, notre avenir",
            description: "Plongée au cœur des enjeux maritimes et de la biodiversité.",
            theme: "Biodiversité",
            startAt: new Date("2026-07-17T14:00:00"),
            endAt: new Date("2026-07-17T15:30:00"),
            speakerName: "Claire Nouvian",
            location: "Chapiteau Océan",
            maxCapacity: 50,
        },
        {
            id: uuidv4(),
            title: "Tech & Sobriété",
            description: "Le numérique peut-il être compatible avec les limites planétaires ?",
            theme: "Numérique Responsable",
            startAt: new Date("2026-07-18T11:00:00"),
            endAt: new Date("2026-07-18T12:30:00"),
            speakerName: "Aurélien Barrau",
            location: "Salle des Possibles",
            maxCapacity: 5,
        },
        {
            id: uuidv4(),
            title: "Clôture : L'Espoir en action",
            description: "Table ronde finale sur l'engagement citoyen.",
            theme: "Engagement",
            startAt: new Date("2026-07-19T16:00:00"),
            endAt: new Date("2026-07-19T18:00:00"),
            speakerName: "Collectif",
            location: "Grande Scène",
            maxCapacity: 500,
        }
    ]);

    console.log("Creating ticket types...");
    await db.insert(ticketType).values([
        {
            id: uuidv4(),
            name: "Pass Jour 1 (Vendredi)",
            description: "Accès complet aux conférences et concerts du Vendredi 17 Juillet.",
            priceCents: 3500, // 35.00€
            capacity: 5000,
            validFrom: new Date("2026-07-17T00:00:00"),
            validUntil: new Date("2026-07-17T23:59:59"),
            salesStartAt: new Date(),
        },
        {
            id: uuidv4(),
            name: "Pass Jour 2 (Samedi)",
            description: "Accès complet aux conférences et concerts du Samedi 18 Juillet.",
            priceCents: 4500, // 45.00€
            capacity: 5000,
            validFrom: new Date("2026-07-18T00:00:00"),
            validUntil: new Date("2026-07-18T23:59:59"),
            salesStartAt: new Date(),
        },
        {
            id: uuidv4(),
            name: "Pass Jour 3 (Dimanche)",
            description: "Accès complet aux conférences et concerts du Dimanche 19 Juillet.",
            priceCents: 4500, // 45.00€
            capacity: 5000,
            validFrom: new Date("2026-07-19T00:00:00"),
            validUntil: new Date("2026-07-19T23:59:59"),
            salesStartAt: new Date(),
        },
        {
            id: uuidv4(),
            name: "Pass Week-end",
            description: "Profitez du coeur du festival. Accès Samedi et Dimanche.",
            priceCents: 7000, // 70.00€
            capacity: 5000,
            validFrom: new Date("2026-07-18T00:00:00"),
            validUntil: new Date("2026-07-19T23:59:59"),
            salesStartAt: new Date(),
        },
        {
            id: uuidv4(),
            name: "Pass 3 Jours",
            description: "L'expérience totale. Accès aux 3 jours du festival.",
            priceCents: 9000, // 90.00€
            capacity: 5000,
            validFrom: new Date("2026-07-17T00:00:00"),
            validUntil: new Date("2026-07-19T23:59:59"),
            salesStartAt: new Date(),
        },
    ]);

    console.log("✅ Seeding completed with dynamic festival days!");
    process.exit(0);
}

main().catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});
