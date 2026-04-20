import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetCurrentSpecials } from "@workspace/api-client-react";
import { ArrowRight, MapPin, Clock, Phone } from "lucide-react";
import heroImg from "@/assets/images/hero.png";
import msPiggyImg from "@assets/msPiggy_1776656228023.jpg";
import logoImg from "@assets/LOGOfront_1776656215137.jpg";

export default function Home() {
  const { data: specials, isLoading } = useGetCurrentSpecials();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Food spread"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />
        </div>

        {/* Floating flower accents */}
        <div className="absolute top-1/4 right-8 md:right-24 z-10 opacity-80 hidden md:block">
          <motion.img
            src={logoImg}
            alt=""
            className="w-40 h-40 rounded-full object-cover border-4 border-primary shadow-2xl shadow-primary/40"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        
        <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-center md:items-start text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-6"
            >
              <span className="bg-primary/20 border border-primary/50 text-primary text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                Canyon, TX Favorite
              </span>
            </motion.div>

            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight font-bold">
              <span className="text-primary">This Little Piggy</span><br/>
              <span className="text-accent italic">Serves Food!</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 mb-10 max-w-lg mx-auto md:mx-0 font-light">
              Family-owned by Tim and Rene Vogler. Started as a food truck, now serving Canyon, TX with big flavors and even bigger hearts.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/menu">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 w-full sm:w-auto rounded-full shadow-lg shadow-primary/30 text-base glow-primary">
                  View Our Menu
                </Button>
              </Link>
              <Link href="/specials">
                <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 w-full sm:w-auto rounded-full font-bold text-base">
                  Today's Specials
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
              className="relative"
            >
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />
                <img
                  src={msPiggyImg}
                  alt="Ms. Piggy mascot"
                  className="relative z-10 w-full h-full object-cover rounded-3xl border-4 border-primary shadow-2xl shadow-primary/30"
                />
                {/* Decorative badge */}
                <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground font-serif font-bold text-sm px-4 py-2 rounded-full shadow-lg z-20 border-2 border-background">
                  Est. Canyon, TX
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-10"
            >
              <div className="flex flex-col gap-4">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                  Our <span className="text-primary">Story</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Tim and Rene Vogler started This Little Piggy as a food truck with a simple dream — bring bold, satisfying food to the Texas Panhandle. 
                  From wings and burgers to pizza and baked potatoes, every dish is made with love at their home on Chaparral Road in Canyon, TX.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex gap-4 items-start bg-card rounded-2xl p-5 border border-border">
                  <div className="p-3 bg-primary/20 text-primary rounded-xl shrink-0">
                    <Clock size={22} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold mb-2 text-foreground">Hours</h3>
                    <p className="text-muted-foreground text-sm leading-loose">
                      Mon-Thu 11am–9pm<br/>
                      Fri-Sat 11am–10pm<br/>
                      Sun 10am–8pm
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start bg-card rounded-2xl p-5 border border-border">
                  <div className="p-3 bg-primary/20 text-primary rounded-xl shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold mb-2 text-foreground">Find Us</h3>
                    <p className="text-muted-foreground text-sm leading-loose">
                      19501 Chaparral Road<br/>
                      Canyon, TX 79015
                    </p>
                    <a href="tel:+18063403895" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 mt-2 text-sm font-semibold">
                      <Phone size={13} /> (806) 340-3895
                    </a>
                    <a href="tel:+18064993307" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 mt-1 text-sm font-semibold">
                      <Phone size={13} /> (806) 499-3307
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specials Preview */}
      <section className="py-24 bg-card/50 border-t border-border">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">
                Today's <span className="text-primary">Specials</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Fresh from the kitchen, prepared just for today.
              </p>
            </div>
            <Link href="/specials" className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all shrink-0">
              View all specials <ArrowRight size={18} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-muted rounded-2xl h-48" />
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
                  className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-colors"
                >
                  {special.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={special.imageUrl} 
                        alt={special.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">{special.title}</h3>
                      {special.price && <span className="font-serif text-lg text-accent font-bold shrink-0">${special.price}</span>}
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">{special.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <img src={logoImg} alt="" className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-primary opacity-60" />
              <p className="text-muted-foreground italic font-serif text-lg">Check back soon for today's specials.</p>
            </div>
          )}
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[60vh] w-full relative bg-muted border-t border-border">
        <iframe
          title="This Little Piggy Serves Food Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3276.48!2d-101.9295!3d34.9821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x870a0c8b4d7a4e2f%3A0x0!2s19501+Chaparral+Rd%2C+Canyon%2C+TX+79015!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </div>
  );
}
