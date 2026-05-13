import { motion } from "framer-motion";
import { useListSpecials } from "@workspace/api-client-react";
import { ensureArray } from "@/lib/utils";
import { Utensils, Soup, Salad, IceCream } from "lucide-react";

const SECTIONS = [
  {
    key: "daily",
    label: "Daily Specials",
    subtitle: "What's hot off the kitchen today",
    icon: Utensils,
    emptyMsg: "No daily specials today — check back soon!",
  },
  {
    key: "soup",
    label: "Soups",
    subtitle: "Made fresh every day",
    icon: Soup,
    emptyMsg: "No soup today — check back soon!",
  },
  {
    key: "salad",
    label: "Salads",
    subtitle: "Fresh and crisp",
    icon: Salad,
    emptyMsg: "No salads today — check back soon!",
  },
  {
    key: "dessert",
    label: "Desserts",
    subtitle: "Something sweet to finish",
    icon: IceCream,
    emptyMsg: "No desserts today — check back soon!",
  },
];

export default function Specials() {
  const { data: specialsRaw, isLoading } = useListSpecials();
  const activeSpecials = ensureArray(specialsRaw).filter(s => s.isActive);

  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">

        {/* Header */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            <span className="text-primary">Today's</span> <span className="text-accent">Specials</span>
          </h1>
          <div className="h-1 w-24 bg-primary mx-auto mb-4 rounded-full"></div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Updated daily — come back every day to see what Tim & Rene are cooking up!
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            {SECTIONS.map((section, sIdx) => {
              const items = activeSpecials.filter(s => s.category === section.key);
              const Icon = section.icon;

              return (
                <motion.section
                  key={section.key}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: sIdx * 0.05 }}
                >
                  {/* Section header */}
                  <div className="flex items-center gap-4 mb-8 border-b-2 border-primary/30 pb-4">
                    <div className="p-3 bg-primary/15 text-primary rounded-xl">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h2 className="font-serif text-3xl font-bold text-foreground leading-none">{section.label}</h2>
                      <p className="text-muted-foreground text-sm mt-1 italic">{section.subtitle}</p>
                    </div>
                  </div>

                  {items.length === 0 ? (
                    <div className="flex items-center justify-center h-28 rounded-2xl border-2 border-dashed border-border">
                      <p className="text-muted-foreground italic">{section.emptyMsg}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {items.map((item, i) => (
                        <motion.div
                          key={item.id}
                          initial={false}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.08 }}
                          className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-colors shadow-md shadow-black/30 group"
                        >
                          {item.imageUrl && (
                            <div className="h-52 overflow-hidden">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                          )}
                          <div className="p-6">
                            <div className="flex justify-between items-start gap-4 mb-2">
                              <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                {item.title}
                              </h3>
                              {item.price && (
                                <span className="font-serif text-lg font-bold text-accent shrink-0">${item.price}</span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
