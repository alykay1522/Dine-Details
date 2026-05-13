import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import logoImg from "@assets/LOGOfront_1776656215137.jpg";
import { useMenu } from "@/hooks/use-menu";

export default function Menu() {
  const { data: menu, isLoading } = useMenu();

  return (
    <div className="min-h-screen bg-background pt-12 pb-24 relative overflow-hidden">
      {/* Logo watermark background */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-0">
        <img
          src={logoImg}
          alt=""
          className="w-[700px] max-w-[90vw] opacity-[0.04] select-none"
          style={{ filter: "saturate(0) brightness(2)" }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            <span style={{ color: "var(--piggy-pink)" }}>Our</span>{" "}
            <span style={{ color: "var(--piggy-yellow)" }}>Menu</span>
          </h1>
          <div className="h-1 w-24 mx-auto mb-6 rounded-full" style={{ background: "var(--piggy-pink)" }} />
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            19501 Chaparral Rd, Canyon, TX 79015
          </p>
          <p className="text-muted-foreground mt-1 font-semibold">
            (806) 340-3895
          </p>
        </motion.div>

        {/* Call to Order Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 rounded-lg px-6 py-5 border"
          style={{ background: "rgba(255,79,163,0.08)", borderColor: "rgba(255,79,163,0.35)" }}
        >
          <p className="font-serif text-lg font-bold text-foreground text-center sm:text-left">
            Ready to order? Give us a call!
          </p>
          <a href="tel:+18063403895">
            <button
              className="flex items-center gap-2 font-bold px-6 py-3 rounded-lg shadow-lg transition-all text-sm text-white"
              style={{ background: "var(--piggy-pink)" }}
            >
              <Phone size={16} /> (806) 340-3895
            </button>
          </a>
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "var(--piggy-pink)", borderTopColor: "transparent" }} />
          </div>
        )}

        {/* Menu Grid */}
        {menu && menu.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            {menu.map((category, catIdx) => {
              const color = category.color ?? "#FF4FA3";
              return (
                <motion.section
                  key={category.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (catIdx % 2) * 0.1 }}
                >
                  {/* Colored section header */}
                  <div
                    className="mb-4 pb-3 flex items-center gap-2"
                    style={{ borderBottom: `2px solid ${color}` }}
                  >
                    {category.icon && (
                      <span className="text-xl">{category.icon}</span>
                    )}
                    <div>
                      <h2
                        className="font-serif text-2xl md:text-3xl font-bold"
                        style={{ color }}
                      >
                        {category.name}
                      </h2>
                      {category.subtitle && (
                        <p className="text-muted-foreground text-sm italic mt-0.5">{category.subtitle}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {category.items.map((item) => (
                      <div key={item.id}>
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-medium text-foreground">{item.name}</span>
                          <span className="flex-1 border-b border-dotted border-border relative -top-1.5 mx-2 shrink" />
                          {item.price && (
                            <span className="font-serif font-semibold shrink-0" style={{ color }}>
                              {item.price}
                            </span>
                          )}
                        </div>
                        {item.note && (
                          <p className="text-xs text-muted-foreground mt-0.5 italic">{item.note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.section>
              );
            })}
          </div>
        )}

        {/* Disclaimer */}
        {!isLoading && (
          <p className="text-xs text-muted-foreground text-center mt-12 italic">
            *Consuming raw or undercooked meats, poultry, seafood, or eggs may increase your risk of foodborne illness.
          </p>
        )}
      </div>
    </div>
  );
}
