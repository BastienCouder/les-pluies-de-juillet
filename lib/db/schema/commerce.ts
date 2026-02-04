import { pgTable, text, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";

export const ticketType = pgTable("ticket_type", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(), // Pass 2 Jours
    description: text("description"),
    priceCents: integer("price_cents").notNull(), // 5000 = 50.00€
    currency: text("currency").default("eur").notNull(),
    capacity: integer("capacity").notNull(), // Stock total
    soldCount: integer("sold_count").default(0).notNull(), // Ventes actuelles
    isActive: boolean("is_active").default(true).notNull(),
    salesStartAt: timestamp("sales_start_at"),
    salesEndAt: timestamp("sales_end_at"),
    validFrom: timestamp("valid_from"), // Pour restreindre l'ajout au programme
    validUntil: timestamp("valid_until"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const festivalDay = pgTable("festival_day", {
    id: uuid("id").defaultRandom().primaryKey(),
    date: timestamp("date").notNull().unique(), // 2026-07-17 00:00:00
    name: text("name").notNull(), // "Vendredi"
    maxCapacity: integer("max_capacity").notNull().default(2000),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const order = pgTable("order", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => user.id),
    status: text("status").notNull().default("PENDING_PAYMENT"), // DRAFT, PENDING, PAID, CANCELED
    totalCents: integer("total_cents").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ticket = pgTable("ticket", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => user.id),
    ticketTypeId: uuid("ticket_type_id").notNull().references(() => ticketType.id),
    orderId: uuid("order_id").notNull().references(() => order.id),
    status: text("status").notNull().default("VALID"), // VALID, USED, CANCELED
    qrCode: text("qr_code").unique(), // Token unique pour scan
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ticketTypeRelations = relations(ticketType, ({ many }) => ({
    tickets: many(ticket),
}));

export const orderRelations = relations(order, ({ one, many }) => ({
    user: one(user, {
        fields: [order.userId],
        references: [user.id],
    }),
    tickets: many(ticket),
}));

export const ticketRelations = relations(ticket, ({ one }) => ({
    user: one(user, {
        fields: [ticket.userId],
        references: [user.id],
    }),
    type: one(ticketType, {
        fields: [ticket.ticketTypeId],
        references: [ticketType.id],
    }),
    order: one(order, {
        fields: [ticket.orderId],
        references: [order.id],
    }),
}));