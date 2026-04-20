import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";

export const menuCategoriesTable = pgTable("menu_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subtitle: text("subtitle"),
  icon: text("icon"),
  color: text("color").notNull().default("#FF4FA3"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const menuItemsTable = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price"),
  note: text("note"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type MenuCategory = typeof menuCategoriesTable.$inferSelect;
export type MenuCategoryInsert = typeof menuCategoriesTable.$inferInsert;
export type MenuItem = typeof menuItemsTable.$inferSelect;
export type MenuItemInsert = typeof menuItemsTable.$inferInsert;
