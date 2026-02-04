import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";

export const conference = pgTable("conference", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    theme: text("theme").notNull(),
    startAt: timestamp("start_at").notNull(),
    endAt: timestamp("end_at").notNull(),
    speakerName: text("speaker_name"),
    location: text("location"),
    maxCapacity: integer("max_capacity").default(100),
    attendees: integer("attendees").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userProgramItem = pgTable("user_program_item", {
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    conferenceId: uuid("conference_id").notNull().references(() => conference.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
    pk: [t.userId, t.conferenceId]
}));

export const conferenceRelations = relations(conference, ({ many }) => ({
    programItems: many(userProgramItem),
}));

export const userProgramItemRelations = relations(userProgramItem, ({ one }) => ({
    user: one(user, {
        fields: [userProgramItem.userId],
        references: [user.id],
    }),
    conference: one(conference, {
        fields: [userProgramItem.conferenceId],
        references: [conference.id],
    }),
}));