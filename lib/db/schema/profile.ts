import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";

export const profile = pgTable("profile", {
    userId: text("userId")
        .primaryKey()
        .references(() => user.id, { onDelete: "cascade" }),
    firstName: text("firstName"),
    lastName: text("lastName"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
});

export const profileRelations = relations(profile, ({ one }) => ({
    user: one(user, {
        fields: [profile.userId],
        references: [user.id],
    }),
}));