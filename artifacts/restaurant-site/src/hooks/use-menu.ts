import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type MenuItemData = {
  id: number;
  categoryId: number;
  name: string;
  description?: string | null;
  price?: string | null;
  note?: string | null;
  sortOrder: number;
};

export type MenuCategoryData = {
  id: number;
  name: string;
  subtitle?: string | null;
  icon?: string | null;
  color: string;
  sortOrder: number;
  items: MenuItemData[];
};

const MENU_KEY = ["menu"] as const;

/* ── Static seed data (extracted from api-server/src/routes/menu.ts) ── */

let _nextId = 1;
function nid() { return _nextId++; }

const STATIC_MENU: MenuCategoryData[] = (() => {
  const cats: Omit<MenuCategoryData, "id" | "items">[] = [
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
    { name: "Baskets", subtitle: "Served with fries", color: "#FF8A3D", icon: "🍢", sortOrder: 13 },
    { name: "Kids Meal", color: "#FFE55C", icon: "⭐", sortOrder: 14 },
  ];

  const items: Record<string, { name: string; price?: string; note?: string }[]> = {
    "Appetizers": [
      { name: "Cheese Curds", price: "$6" },
      { name: "Fried Okra", price: "$6" },
      { name: "Zucchini Sticks", price: "$6" },
      { name: "Jalapeno Bottle Caps", price: "$6" },
      { name: "Munchers", price: "$6" },
      { name: "Fried Pickles", price: "$6" },
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

  return cats.map((cat) => {
    const catId = nid();
    const catItems = (items[cat.name] ?? []).map((item, idx) => ({
      id: nid(),
      categoryId: catId,
      name: item.name,
      price: item.price ?? null,
      note: item.note ?? null,
      description: null,
      sortOrder: idx,
    }));
    return { ...cat, id: catId, items: catItems };
  });
})();

/* ── Hook: returns static data instantly ── */

export function useMenu() {
  return useQuery<MenuCategoryData[]>({
    queryKey: [...MENU_KEY],
    queryFn: () => Promise.resolve(STATIC_MENU),
    staleTime: Infinity,
    initialData: STATIC_MENU,
  });
}

/* ── Mutation stubs (admin panel — no-op without backend) ── */

function noopMutation<TData, TVars>(label: string) {
  return useMutation<TData, Error, TVars>({
    mutationFn: () => {
      console.warn(`[static-mode] ${label} is disabled without a backend.`);
      return Promise.reject(new Error("Editing is disabled in static mode."));
    },
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (_data: Omit<MenuCategoryData, "id" | "items">) =>
      Promise.reject(new Error("Disabled in static mode")),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (_data: Partial<MenuCategoryData> & { id: number }) =>
      Promise.reject(new Error("Disabled in static mode")),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (_id: number) =>
      Promise.reject(new Error("Disabled in static mode")),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useCreateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (_data: Omit<MenuItemData, "id">) =>
      Promise.reject(new Error("Disabled in static mode")),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useUpdateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (_data: Partial<MenuItemData> & { id: number }) =>
      Promise.reject(new Error("Disabled in static mode")),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useDeleteMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (_id: number) =>
      Promise.reject(new Error("Disabled in static mode")),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}
