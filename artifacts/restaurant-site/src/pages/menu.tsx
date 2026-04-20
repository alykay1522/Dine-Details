import { motion } from "framer-motion";
import { Phone } from "lucide-react";


type MenuItem = {
  name: string;
  description?: string;
  price?: string;
  note?: string;
};

type MenuCategory = {
  name: string;
  subtitle?: string;
  items: MenuItem[];
};

const MENU: MenuCategory[] = [
  {
    name: "Appetizers",
    items: [
      { name: "Cheese Curds", price: "$6" },
      { name: "Fried Okra", price: "$6" },
      { name: "Zucchini Sticks", price: "$6" },
      { name: "Jalapeno Bottle Caps", price: "$6" },
      { name: "Munchers", price: "$6" },
      { name: "Fried Pickles", price: "$6" },
    ],
  },
  {
    name: "Anytime Omelette",
    subtitle: "3 Egg Omelette served with Toast",
    items: [
      { name: "Cheese Only", price: "$10" },
      { name: "Up to Three Items", price: "$12" },
      { name: "Up to Five Items", price: "$14" },
    ],
  },
  {
    name: "Nachos",
    items: [
      { name: "Chips and Salsa", price: "$6" },
      { name: "Queso", price: "$8" },
    ],
  },
  {
    name: "Quesadilla",
    subtitle: "Chicken, Beef or Cheese",
    items: [
      { name: "½ Quesadilla", price: "$10" },
      { name: "1 Quesadilla", price: "$15" },
    ],
  },
  {
    name: "Sides",
    items: [
      { name: "Handcut Fries", price: "$5" },
      { name: "Piggy Fries", price: "$5" },
      { name: "Wedges", price: "$5", note: "+add chili or cheese for $2 each" },
    ],
  },
  {
    name: "Wings",
    items: [
      { name: "6 Wings", price: "$8" },
      { name: "12 Wings", price: "$15", note: "+add a side $3 | +add an appetizer $5" },
    ],
  },
  {
    name: "Big Baked Potato",
    items: [
      { name: "Butter and Sour Cream", price: "$10" },
      { name: "Bacon, Sour Cream, and Cheese", price: "$12" },
      { name: "Chili and Cheese", price: "$12" },
    ],
  },
  {
    name: "Patty Melt",
    subtitle: "⅓ lb Burger on Rye with Grilled Onion and Swiss Cheese",
    items: [
      { name: "Patty Melt", price: "$12", note: "+add a side $3 | +add an appetizer $5" },
    ],
  },
  {
    name: "Sandwiches",
    items: [
      { name: "Club", price: "$12" },
      { name: "Grilled Cheese", price: "$8" },
      { name: "Ham and Cheese", price: "$10" },
      { name: "Turkey and Cheese", price: "$10" },
      { name: "BLT", price: "$12" },
    ],
  },
  {
    name: "Burgers",
    subtitle: "½ lb hand-pressed patty",
    items: [
      { name: "½ lb Burger", price: "$10" },
      { name: "½ lb Burger with Cheese", price: "$11" },
      { name: "½ lb Burger with Cheese and Bacon", price: "$12" },
      { name: "Make it a Double", price: "+$5", note: "+add a side $3 | +add an appetizer $5" },
    ],
  },
  {
    name: '"BaWK BaWK" Sandwiches',
    subtitle: "Grilled or fried",
    items: [
      { name: "Chicken on a Bun", price: "$10" },
      { name: "Chicken Bacon Ranch with Cheese", price: "$12" },
      { name: "Hot Honey, Jalapeno, Bacon Chicken", price: "$12" },
    ],
  },
  {
    name: "Big'O Hotdogs",
    items: [
      { name: "¼ lb All Beef Frank", price: "$6" },
      { name: "¼ lb Beef Frank with Sauerkraut", price: "$6" },
      { name: "¼ lb Chili Cheese Dog", price: "$9" },
    ],
  },
  {
    name: "Baskets",
    subtitle: "Served with fries",
    items: [
      { name: "3 Chicken Strips and Fries", price: "$14" },
      { name: "Popcorn Shrimp and Fries", price: "$14" },
      { name: "2 Catfish and Fries", price: "$14" },
      { name: "8 PC Chicken Nugget Basket and Fries", price: "$12" },
    ],
  },
  {
    name: "Kids Meal",
    items: [
      { name: "1 Catfish", price: "$6" },
      { name: "Small Burger", price: "$5", note: "+add cheese $1" },
      { name: "Chicken Nuggets (5)", price: "$5" },
      { name: "Corn Dog Nuggets (7)", price: "$5", note: "+add a side $2" },
    ],
  },
];

export default function Menu() {
  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            <span className="text-primary">Our</span> <span className="text-accent">Menu</span>
          </h1>
          <div className="h-1 w-24 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            19501 Chaparral Rd, Canyon, TX 79015
          </p>
          <p className="text-muted-foreground mt-1 font-semibold">
            (806) 340-3895 &nbsp;|&nbsp; (806) 499-3307
          </p>
        </motion.div>

        {/* Call to Order Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 bg-primary/10 border border-primary/30 rounded-2xl px-6 py-5"
        >
          <p className="font-serif text-lg font-bold text-foreground text-center sm:text-left">
            Ready to order? Give us a call!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="tel:+18063403895">
              <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-primary/30 transition-colors text-sm">
                <Phone size={16} /> (806) 340-3895
              </button>
            </a>
            <a href="tel:+18064993307">
              <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-primary/30 transition-colors text-sm">
                <Phone size={16} /> (806) 499-3307
              </button>
            </a>
          </div>
        </motion.div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
          {MENU.map((category, catIdx) => (
            <motion.section
              key={category.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (catIdx % 2) * 0.1 }}
            >
              <div className="mb-4 border-b-2 border-primary/30 pb-3">
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">{category.name}</h2>
                {category.subtitle && (
                  <p className="text-muted-foreground text-sm italic mt-1">{category.subtitle}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {category.items.map((item) => (
                  <div key={item.name}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-medium text-foreground">{item.name}</span>
                      <span className="flex-1 border-b border-dotted border-border relative -top-1.5 mx-2 shrink"></span>
                      {item.price && (
                        <span className="font-serif text-primary font-semibold shrink-0">{item.price}</span>
                      )}
                    </div>
                    {item.note && (
                      <p className="text-xs text-muted-foreground mt-0.5 italic">{item.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Pizza Section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14"
        >
          <div className="mb-6 border-b-2 border-primary/30 pb-3">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground">Pizza</h2>
          </div>
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="font-serif text-xl text-foreground mb-4 underline underline-offset-4 decoration-primary/40">Small – 12"</h3>
              <div className="flex flex-col gap-2">
                {[
                  { name: "Cheese", price: "$12" },
                  { name: "1 Topping", price: "$14" },
                  { name: "3 Toppings", price: "$16" },
                  { name: "6 Toppings", price: "$18" },
                ].map(item => (
                  <div key={item.name} className="flex items-baseline justify-between gap-3">
                    <span className="font-medium text-foreground">{item.name}</span>
                    <span className="flex-1 border-b border-dotted border-border relative -top-1.5 mx-2"></span>
                    <span className="font-serif text-primary font-semibold shrink-0">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-serif text-xl text-foreground mb-4 underline underline-offset-4 decoration-primary/40">Large – 16"</h3>
              <div className="flex flex-col gap-2">
                {[
                  { name: "Cheese", price: "$14" },
                  { name: "1 Topping", price: "$16" },
                  { name: "3 Toppings", price: "$18" },
                  { name: "6 Toppings", price: "$20" },
                ].map(item => (
                  <div key={item.name} className="flex items-baseline justify-between gap-3">
                    <span className="font-medium text-foreground">{item.name}</span>
                    <span className="flex-1 border-b border-dotted border-border relative -top-1.5 mx-2"></span>
                    <span className="font-serif text-primary font-semibold shrink-0">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-muted/40 rounded-xl p-6 border border-border">
            <h4 className="font-medium text-foreground mb-3">Toppings</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Pepperoni · Sausage · Hamburger · Ham · Bacon · Olives · Bell Peppers · Onions · Jalapenos · Banana Peppers · Mushrooms · Pickles
            </p>
            <p className="text-muted-foreground text-sm mt-2 italic">If you don't see it, ask!</p>
          </div>
        </motion.section>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center mt-12 italic">
          *Consuming raw or undercooked meats, poultry, seafood, or eggs may increase your risk of foodborne illness.
        </p>
      </div>
    </div>
  );
}
