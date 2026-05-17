import type { MenuCategoryData } from "../hooks/use-menu";

let nextId = 1;
function id() { return nextId++; }

export const CATEGORIES: MenuCategoryData[] = [
  { id: id(), name: "Appetizers", color: "#FF4FA3", icon: "🐷", sortOrder: 1 },
  { id: id(), name: "Anytime Omelette", subtitle: "3 Egg Omelette served with Toast", color: "#A45CFF", icon: "🍳", sortOrder: 2 },
  { id: id(), name: "Nachos", color: "#FF8A3D", icon: "🌶️", sortOrder: 3 },
  { id: id(), name: "Quesadilla", subtitle: "Chicken, Beef or Cheese", color: "#FF8A3D", icon: "🫓", sortOrder: 4 },
  { id: id(), name: "Sides", color: "#FFE55C", icon: "🍟", sortOrder: 5 },
  { id: id(), name: "Wings", color: "#FF8A3D", icon: "🔥", sortOrder: 6 },
  { id: id(), name: "Big Baked Potato", color: "#FFE55C", icon: "🥔", sortOrder: 7 },
  { id: id(), name: "Patty Melt", subtitle: "⅓ lb Burger on Rye with Grilled Onion and Swiss Cheese", color: "#3ED6C4", icon: "🥩", sortOrder: 8 },
  { id: id(), name: "Sandwiches", color: "#3ED6C4", icon: "🥪", sortOrder: 9 },
  { id: id(), name: "Burgers", subtitle: "½ lb hand-pressed patty", color: "#3ED6C4", icon: "🍔", sortOrder: 10 },
];
