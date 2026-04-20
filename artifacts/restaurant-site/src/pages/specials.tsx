import { motion } from "framer-motion";
import { useListSpecials } from "@workspace/api-client-react";
import { format, parseISO } from "date-fns";

export default function Specials() {
  const { data: specials, isLoading } = useListSpecials();

  const activeSpecials = specials?.filter(s => s.isActive) || [];
  const dailySpecials = activeSpecials.filter(s => s.category === "daily");
  const weeklySpecials = activeSpecials.filter(s => s.category === "weekly");

  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">Specials</h1>
          <div className="h-px w-24 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto italic">
            Unique creations based on what's fresh at the market today.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col gap-12">
            {[1, 2].map(section => (
              <div key={section} className="flex flex-col gap-6">
                <div className="h-10 w-48 bg-muted animate-pulse rounded-md mx-auto mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2].map(card => (
                    <div key={card} className="h-80 bg-muted animate-pulse rounded-2xl"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-24">
            {activeSpecials.length === 0 ? (
              <div className="text-center py-20 bg-muted/30 rounded-2xl">
                <p className="font-serif text-xl text-muted-foreground italic">No specials available at the moment. Please check back later.</p>
              </div>
            ) : (
              <>
                {dailySpecials.length > 0 && (
                  <section>
                    <div className="flex flex-col items-center mb-12">
                      <h2 className="font-serif text-4xl text-foreground mb-2">Today's Harvest</h2>
                      <span className="text-primary text-sm uppercase tracking-widest">Daily Specials</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {dailySpecials.map(special => (
                        <SpecialCard key={special.id} special={special} />
                      ))}
                    </div>
                  </section>
                )}

                {weeklySpecials.length > 0 && (
                  <section>
                    <div className="flex flex-col items-center mb-12">
                      <h2 className="font-serif text-4xl text-foreground mb-2">Chef's Weekly Features</h2>
                      <span className="text-primary text-sm uppercase tracking-widest">Available all week</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {weeklySpecials.map(special => (
                        <SpecialCard key={special.id} special={special} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SpecialCard({ special }: { special: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border flex flex-col h-full group"
    >
      {special.imageUrl && (
        <div className="h-64 w-full overflow-hidden relative">
          <img 
            src={special.imageUrl} 
            alt={special.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider text-foreground">
            {format(parseISO(special.featuredDate), 'MMM d')}
          </div>
        </div>
      )}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="font-serif text-2xl text-foreground">{special.title}</h3>
          {special.price && <span className="font-serif text-xl text-primary shrink-0">${special.price}</span>}
        </div>
        <p className="text-muted-foreground leading-relaxed flex-1">{special.description}</p>
      </div>
    </motion.div>
  );
}
