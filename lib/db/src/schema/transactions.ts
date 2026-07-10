import { pgTable, serial, text, numeric, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  isIncome: boolean("is_income").notNull().default(false),
  category: text("category").notNull(),
  note: text("note").notNull().default(""),
  date: date("date", { mode: "string" }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactionsTable).omit({ id: true, createdAt: true });
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactionsTable.$inferSelect;
