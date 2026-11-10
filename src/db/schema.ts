import { index, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Every enquiry is stored here first, so no lead is lost even if the
// Google Sheets webhook is unavailable.
export const inquiries = pgTable(
  "inquiries",
  {
    id: serial("id").primaryKey(),
    submissionId: varchar("submission_id", { length: 64 }).notNull().unique(),
    kind: varchar("kind", { length: 32 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    phone: varchar("phone", { length: 24 }),
    services: text("services").notNull(),
    budget: varchar("budget", { length: 64 }),
    packageChoice: varchar("package_choice", { length: 32 }),
    message: text("message").notNull(),
    sheetsStatus: varchar("sheets_status", { length: 24 }).notNull().default("pending"),
    status: varchar("status", { length: 24 }).notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("inquiries_created_at_idx").on(table.createdAt)],
);


export const adminEvents = pgTable(
  "admin_events",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 140 }).notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("admin_events_starts_at_idx").on(table.startsAt)],
);
