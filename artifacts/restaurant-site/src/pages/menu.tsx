import { motion } from "framer-motion";
import starterImg from "@/assets/images/starter.png";
import main1Img from "@/assets/images/main1.png";
import main2Img from "@/assets/images/main2.png";
import dessertImg from "@/assets/images/dessert.png";
import drinkImg from "@/assets/images/drink.png";

const MENU_CATEGORIES = [
  {
    name: "Starters",
    description: "To share or enjoy alone",
    items: [
      { name: "Heirloom Tomato Burrata", description: "Fresh local burrata, basil, aged balsamic, toasted sourdough", price: "16" },
      { name: "Crispy Calamari", description: "Lightly breaded squid, lemon garlic aioli, marinara", price: "18" },
      { name: "Wood-Fired Artichokes", description: "Charred lemon, olive oil, parmesan snow", price: "14" },
      { name: "Farmhouse Salad", description: "Mixed greens, shaved fennel, radish, champagne vinaigrette", price: "12" }
    ],
    image: starterImg
  },
  {
    name: "Mains",
    description: "The heart of the harvest",
    items: [
      { name: "Herb-Roasted Half Chicken", description: "Root vegetables, pan jus, crispy rosemary", price: "28" },
      { name: "Handmade Pappardelle", description: "Wild mushroom ragu, fresh thyme, shaved pecorino", price: "24" },
      { name: "Pan-Seared Sea Bass", description: "Wilted spinach, lemon butter sauce, capers", price: "34" },
      { name: "Braised Short Rib", description: "Creamy polenta, gremolata, red wine reduction", price: "38" }
    ],
    images: [main1Img, main2Img]
  },
  {
    name: "Sides",
    description: "Perfect additions",
    items: [
      { name: "Truffle Fries", description: "Parmesan, parsley, garlic aioli", price: "9" },
      { name: "Charred Broccolini", description: "Chili flakes, lemon, garlic", price: "10" },
      { name: "Roasted Fingerling Potatoes", description: "Herb butter, sea salt", price: "8" }
    ]
  },
  {
    name: "Desserts",
    description: "A sweet conclusion",
    items: [
      { name: "Rustic Fruit Galette", description: "Seasonal fruit, flaky pastry, vanilla bean ice cream", price: "12" },
      { name: "Dark Chocolate Torte", description: "Sea salt, raspberry coulis", price: "14" },
      { name: "Lemon Olive Oil Cake", description: "Mascarpone whip, candied lemon", price: "11" }
    ],
    image: dessertImg
  },
  {
    name: "Drinks",
    description: "Libations & Refreshments",
    items: [
      { name: "Botanical Spritz", description: "Gin, elderflower, cucumber, prosecco", price: "15" },
      { name: "Orchard Old Fashioned", description: "Bourbon, apple bitters, maple syrup", price: "16" },
      { name: "Local Draft Beer", description: "Rotating selection of regional ales and lagers", price: "8" },
      { name: "House Lemonade", description: "Fresh squeezed, mint, sparkling water", price: "6" }
    ],
    image: drinkImg
  }
];

export default function Menu() {
  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">Our Menu</h1>
          <div className="h-px w-24 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto italic">
            Rooted in the seasons, inspired by the region. Our menu changes frequently to reflect the best of what's growing right now.
          </p>
        </motion.div>

        <div className="flex flex-col gap-24">
          {MENU_CATEGORIES.map((category, index) => (
            <motion.section 
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="flex flex-col items-center mb-12">
                <h2 className="font-serif text-4xl text-foreground mb-2">{category.name}</h2>
                <span className="text-primary text-sm uppercase tracking-widest">{category.description}</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className={`lg:col-span-${category.image || category.images ? '7' : '12'} flex flex-col gap-8`}>
                  {category.items.map((item) => (
                    <div key={item.name} className="group">
                      <div className="flex justify-between items-baseline gap-4 mb-2">
                        <h3 className="font-serif text-xl md:text-2xl text-foreground">{item.name}</h3>
                        <div className="flex-1 border-b border-dotted border-border relative -top-2"></div>
                        <span className="font-serif text-lg text-primary">${item.price}</span>
                      </div>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>

                {category.image && (
                  <div className="lg:col-span-5 h-[400px] rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {category.images && (
                  <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="h-[250px] rounded-2xl overflow-hidden shadow-lg">
                      <img src={category.images[0]} alt="Main dish" className="w-full h-full object-cover" />
                    </div>
                    <div className="h-[250px] rounded-2xl overflow-hidden shadow-lg ml-12">
                      <img src={category.images[1]} alt="Main dish" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
}
