import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const waRequestsTable = pgTable("wa_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  targetNumber: text("target_number").notNull(),
  method: text("method", { enum: ["aroxen", "travaz", "lochturn", "overhold"] }).notNull(),
  status: text("status", { enum: ["queued", "connecting", "sending", "processing", "done", "failed"] }).notNull().default("queued"),
  progressPct: integer("progress_pct").notNull().default(0),
  currentStep: text("current_step"),
  estimatedDoneAt: timestamp("estimated_done_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  doneAt: timestamp("done_at", { withTimezone: true }),
});

export const insertWaRequestSchema = createInsertSchema(waRequestsTable).omit({ id: true, createdAt: true });
export type InsertWaRequest = z.infer<typeof insertWaRequestSchema>;
export type WaRequest = typeof waRequestsTable.$inferSelect;
