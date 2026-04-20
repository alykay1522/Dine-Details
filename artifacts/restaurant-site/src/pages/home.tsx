import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetCurrentSpecials } from "@workspace/api-client-react";
import { ArrowRight, MapPin, Clock, Phone } from "lucide-react";
import heroImg from "@/assets/images/hero.png";
import interiorImg from "@/assets/images/interior1.png";

export default function Home() {
  const { data: specials, isLoading } = useGetCurrentSpecials();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Farm to table spread"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-6 md:px-12 text-center md:text-left flex flex-col items-center md:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight drop-shadow-md">
              Gather around <br/>
              <span className="italic text-primary-foreground/90">the table.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-lg mx-auto md:mx-0 font-light drop-shadow">
              Honest, locally-sourced food served in a warm neighborhood setting. 
              Come as you are, stay as long as you'd like.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/menu">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 w-full sm:w-auto">
                  View Our Menu
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src={interiorImg}
                alt="Restaurant interior"
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-10"
            >
              <div className="flex flex-col gap-4">
                <h2 className="font-serif text-4xl text-foreground">Welcome Home</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  The Harvest Table was born from a simple idea: that the best food is grown nearby, cooked with care, and shared with friends. We work with local farmers to bring the season's best to your plate.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-primary/10 text-primary rounded-full shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-2">Hours</h3>
                    <p className="text-muted-foreground text-sm leading-loose">
                      Mon-Thu 11am-9pm<br/>
                      Fri-Sat 11am-10pm<br/>
                      Sun 10am-8pm
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-primary/10 text-primary rounded-full shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-2">Location</h3>
                    <p className="text-muted-foreground text-sm leading-loose">
                      42 Orchard Lane<br/>
                      <a href="tel:5550198" className="text-primary hover:underline flex items-center gap-1 mt-2">
                        <Phone size={14} /> (555) 0198
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specials Preview */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Today's Specials</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Fresh from the market, prepared just for today. Our kitchen's latest creations.
              </p>
            </div>
            <Link href="/specials" className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all shrink-0">
              View all specials <ArrowRight size={18} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-muted rounded-xl aspect-square" />
              ))}
            </div>
          ) : specials && specials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {specials.slice(0, 3).map((special, i) => (
                <motion.div
                  key={special.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6 bg-muted">
                    {special.imageUrl && (
                      <img 
                        src={special.imageUrl} 
                        alt={special.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="font-serif text-2xl text-foreground group-hover:text-primary transition-colors">{special.title}</h3>
                    {special.price && <span className="font-serif text-xl text-primary shrink-0">${special.price}</span>}
                  </div>
                  <p className="text-muted-foreground line-clamp-2">{special.description}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-border">
              <p className="text-muted-foreground italic font-serif text-lg">No specials available today.</p>
            </div>
          )}
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[60vh] w-full relative bg-muted">
        <iframe
          title="Restaurant Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11361.34407842603!2d-73.985130!3d40.758896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ1JzMyLjAiTiA3M8KwNTknMDYuNSJX!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </div>
  );
}
