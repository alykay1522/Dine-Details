import { pgTable, text, serial, timestamp, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const specialsTable = pgTable("specials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: text("price"),
  imageUrl: text("image_url"),
  category: text("category").notNull().default("daily"),
  isActive: boolean("is_active").notNull().default(true),
  featuredDate: date("featured_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSpecialSchema = createInsertSchema(specialsTable).omit({ id: true, createdAt: true });
export type InsertSpecial = z.infer<typeof insertSpecialSchema>;
export type Special = typeof specialsTable.$inferSelect;
