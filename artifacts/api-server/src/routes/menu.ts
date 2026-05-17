import { Router, type IRouter } from "express";
import { db, menuCategoriesTable, menuItemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const SEED_CATEGORIES = [
  { name: "Appetizers", color: "#FF4FA3", icon: "🐷", sortOrder: 1 },
  { name: "Anytime Omelette", subtitle: "3 Egg Omelette served with Toast", color: "#A45CFF", icon: "🍳", sortOrder: 2 },
  { name: "Nachos", color: "#FF8A3D", icon: "🌶️", sortOrder: 3 },
  { name: "Quesadilla", subtitle: "Chicken, Beef or Cheese", color: "#FF8A3D", icon: "🫓", sortOrder: 4 },
  { name: "Sides", color: "#FFE55C", icon: "🍟", sortOrder: 5 },
  { name: "Wings", color: "#FF8A3D", icon: "🔥", sortOrder: 6 },
  { name: "Big Baked Potato", color: "#FFE55C", icon: "🥔", sortOrder: 7 },
  { name: "Patty Melt", subtitle: "⅓ lb Burger on Rye with Grilled Onion and Swiss Cheese", color: "#3ED6C4", icon: "🥩", sortOrder: 8 },
  { name: "Sandwiches", color: "#3ED6C4", icon: "🥪", sortOrder: 9 },
  { name: "Burgers", subtitle: "½ lb hand-pressed patty", color: "#FF8A3D", icon: "🍔", sortOrder: 10 },
  { name: '"BaWK BaWK" Sandwiches', subtitle: "Grilled or fried", color: "#3ED6C4", icon: "🐔", sortOrder: 11 },
  { name: "Big'O Hotdogs", color: "#FF4FA3", icon: "🌭", sortOrder: 12 },
  { name: "Baskets", subtitle: "Served with fries", color: "#FF8A3D", icon: "🍤", sortOrder: 13 },
  { name: "Kids Meal", color: "#FFE55C", icon: "⭐", sortOrder: 14 },
];

const SEED_ITEMS: Record<string, { name: string; price?: string; note?: string }[]> = {
  "Appetizers": [
    { name: "Cheese Curds", price: "$8" },
    { name: "Fried Okra", price: "$8" },
    { name: "Zucchini Sticks", price: "$8" },
    { name: "Jalapeno Bottle Caps", price: "$8" },
    { name: "Munchers", price: "$8" },
    { name: "Fried Pickles", price: "$8" },
  ],
  "Anytime Omelette": [
    { name: "Cheese Only", price: "$10" },
    { name: "Up to Three Items", price: "$12" },
    { name: "Up to Five Items", price: "$14" },
  ],
  "Nachos": [
    { name: "Chips and Salsa", price: "$6" },
    { name: "Queso", price: "$8" },
  ],
  "Quesadilla": [
    { name: "½ Quesadilla", price: "$10" },
    { name: "1 Quesadilla", price: "$15" },
  ],
  "Sides": [
    { name: "Handcut Fries", price: "$5" },
    { name: "Piggy Fries", price: "$5" },
    { name: "Wedges", price: "$5", note: "+add chili or cheese for $2 each" },
  ],
  "Wings": [
    { name: "6 Wings", price: "$8" },
    { name: "12 Wings", price: "$15", note: "+add a side $3 | +add an appetizer $5" },
  ],
  "Big Baked Potato": [
    { name: "Butter and Sour Cream", price: "$10" },
    { name: "Bacon, Sour Cream, and Cheese", price: "$12" },
    { name: "Chili and Cheese", price: "$12" },
  ],
  "Patty Melt": [
    { name: "Patty Melt", price: "$12", note: "+add a side $3 | +add an appetizer $5" },
  ],
  "Sandwiches": [
    { name: "Club", price: "$12" },
    { name: "Grilled Cheese", price: "$8" },
    { name: "Ham and Cheese", price: "$10" },
    { name: "Turkey and Cheese", price: "$10" },
    { name: "BLT", price: "$12" },
  ],
  "Burgers": [
    { name: "½ lb Burger", price: "$10" },
    { name: "½ lb Burger with Cheese", price: "$11" },
    { name: "½ lb Burger with Cheese and Bacon", price: "$12" },
    { name: "Make it a Double", price: "+$5", note: "+add a side $3 | +add an appetizer $5" },
  ],
  '"BaWK BaWK" Sandwiches': [
    { name: "Chicken on a Bun", price: "$10" },
    { name: "Chicken Bacon Ranch with Cheese", price: "$12" },
    { name: "Hot Honey, Jalapeno, Bacon Chicken", price: "$12" },
  ],
  "Big'O Hotdogs": [
    { name: "¼ lb All Beef Frank", price: "$6" },
    { name: "¼ lb Beef Frank with Sauerkraut", price: "$6" },
    { name: "¼ lb Chili Cheese Dog", price: "$9" },
  ],
  "Baskets": [
    { name: "3 Chicken Strips and Fries", price: "$14" },
    { name: "Popcorn Shrimp and Fries", price: "$14" },
    { name: "2 Catfish and Fries", price: "$14" },
    { name: "8 PC Chicken Nugget Basket and Fries", price: "$12" },
  ],
  "Kids Meal": [
    { name: "1 Catfish", price: "$6" },
    { name: "Small Burger", price: "$5", note: "+add cheese $1" },
    { name: "Chicken Nuggets (5)", price: "$5" },
    { name: "Corn Dog Nuggets (7)", price: "$5", note: "+add a side $2" },
  ],
};

async function seedIfEmpty() {
  const existing = await db.select().from(menuCategoriesTable).limit(1);
  if (existing.length > 0) return;
  for (const cat of SEED_CATEGORIES) {
    const [inserted] = await db.insert(menuCategoriesTable).values(cat).returning();
    const items = SEED_ITEMS[cat.name] ?? [];
    if (items.length > 0) {
      await db.insert(menuItemsTable).values(
        items.map((item, idx) => ({ ...item, categoryId: inserted.id, sortOrder: idx }))
      );
    }
  }
}

async function getFullMenu() {
  const cats = await db.select().from(menuCategoriesTable).orderBy(menuCategoriesTable.sortOrder);
  const items = await db.select().from(menuItemsTable).orderBy(menuItemsTable.sortOrder);
  return cats.map(cat => ({
    ...cat,
    items: items.filter(i => i.categoryId === cat.id),
  }));
}

/** One-time correction if DB was seeded with outdated appetizer prices. */
async function ensureAppetizerPrices() {
  const [appetizers] = await db
    .select()
    .from(menuCategoriesTable)
    .where(eq(menuCategoriesTable.name, "Appetizers"))
    .limit(1);
  if (!appetizers) return;

  const items = await db
    .select()
    .from(menuItemsTable)
    .where(eq(menuItemsTable.categoryId, appetizers.id));

  for (const item of items) {
    if (item.price === "$6") {
      await db
        .update(menuItemsTable)
        .set({ price: "$8" })
        .where(eq(menuItemsTable.id, item.id));
    }
  }
}

router.get("/menu", async (_req, res): Promise<void> => {
  await seedIfEmpty();
  await ensureAppetizerPrices();
  res.json(await getFullMenu());
});

router.post("/menu/categories", async (req, res): Promise<void> => {
  const { name, subtitle, icon, color, sortOrder } = req.body;
  const [cat] = await db.insert(menuCategoriesTable).values({ name, subtitle, icon, color: color ?? "#FF4FA3", sortOrder: sortOrder ?? 0 }).returning();
  res.json(cat);
});

router.put("/menu/categories/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { name, subtitle, icon, color, sortOrder } = req.body;
  const [cat] = await db.update(menuCategoriesTable).set({ name, subtitle, icon, color, sortOrder }).where(eq(menuCategoriesTable.id, id)).returning();
  res.json(cat);
});

router.delete("/menu/categories/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  await db.delete(menuItemsTable).where(eq(menuItemsTable.categoryId, id));
  await db.delete(menuCategoriesTable).where(eq(menuCategoriesTable.id, id));
  res.json({ ok: true });
});

router.post("/menu/items", async (req, res): Promise<void> => {
  const { categoryId, name, description, price, note, sortOrder } = req.body;
  const [item] = await db.insert(menuItemsTable).values({ categoryId, name, description, price, note, sortOrder: sortOrder ?? 0 }).returning();
  res.json(item);
});

router.put("/menu/items/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { name, description, price, note, sortOrder } = req.body;
  const [item] = await db.update(menuItemsTable).set({ name, description, price, note, sortOrder }).where(eq(menuItemsTable.id, id)).returning();
  res.json(item);
});

router.delete("/menu/items/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  await db.delete(menuItemsTable).where(eq(menuItemsTable.id, id));
  res.json({ ok: true });
});

export default router;
