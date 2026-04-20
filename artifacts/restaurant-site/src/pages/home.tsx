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
            alt="Food spread"
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
              This Little<br/>
              <span className="italic text-primary-foreground/90">Piggy Serves Food.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-lg mx-auto md:mx-0 font-light drop-shadow">
              Family-owned by Tim and Rene Vogler. Started as a food truck, grown into a Canyon, TX favorite.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/menu">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 w-full sm:w-auto">
                  View Our Menu
                </Button>
              </Link>
              <Link href="/specials">
                <Button size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/10 px-8 w-full sm:w-auto backdrop-blur-sm">
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
                <h2 className="font-serif text-4xl text-foreground">Our Story</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Tim and Rene Vogler started This Little Piggy Serves Food as a food truck, bringing bold flavors and generous portions to the Texas Panhandle. 
                  Today, from their home at 19501 Chaparral Road in Canyon, they continue that same tradition — real food, real people, no fuss.
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
                      Mon-Thu 11am–9pm<br/>
                      Fri-Sat 11am–10pm<br/>
                      Sun 10am–8pm
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-primary/10 text-primary rounded-full shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-2">Find Us</h3>
                    <p className="text-muted-foreground text-sm leading-loose">
                      19501 Chaparral Road<br/>
                      Canyon, TX 79015
                    </p>
                    <a href="tel:+18063403895" className="text-primary hover:underline flex items-center gap-1 mt-2 text-sm">
                      <Phone size={14} /> (806) 340-3895
                    </a>
                    <a href="tel:+18064993307" className="text-primary hover:underline flex items-center gap-1 mt-1 text-sm">
                      <Phone size={14} /> (806) 499-3307
                    </a>
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
                Fresh from the kitchen, prepared just for today.
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
              <p className="text-muted-foreground italic font-serif text-lg">Check back soon for today's specials.</p>
            </div>
          )}
        </div>
      </section>

      {/* Map Section — Canyon, TX */}
      <section className="h-[60vh] w-full relative bg-muted">
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
