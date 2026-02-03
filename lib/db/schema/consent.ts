import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";

export const userConsent = pgTable("user_consent", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    version: text("version").notNull().default("v1"),
    acceptedAt: timestamp("acceptedAt").notNull(),
});

export const userConsentRelations = relations(userConsent, ({ one }) => ({
    user: one(user, {
        fields: [userConsent.userId],
        references: [user.id],
    }),
}));