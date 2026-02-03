import { pgTable, text, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";

export const conference = pgTable("conference", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    theme: text("theme"),
    startAt: timestamp("startAt").notNull(),
    endAt: timestamp("endAt").notNull(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
});

export const userProgramItem = pgTable(
    "user_program_item",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: text("userId")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        conferenceId: uuid("conferenceId")
            .notNull()
            .references(() => conference.id, { onDelete: "cascade" }),
        createdAt: timestamp("createdAt").notNull(),
    },
    (table) => ({
        uniqueUserConference: unique().on(table.userId, table.conferenceId),
    })
);

export const conferenceRelations = relations(conference, ({ many }) => ({
    programItems: many(userProgramItem),
}));

export const userProgramItemRelations = relations(
    userProgramItem,
    ({ one }) => ({
        user: one(user, {
            fields: [userProgramItem.userId],
            references: [user.id],
        }),
        conference: one(conference, {
            fields: [userProgramItem.conferenceId],
            references: [conference.id],
        }),
    })
);