import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetCurrentSpecials } from "@workspace/api-client-react";
import { ArrowRight, MapPin, Clock, Phone } from "lucide-react";
import heroImg from "@/assets/images/hero.png";
import msPiggyImg from "@assets/msPiggy_1776656228023.jpg";
import logoImg from "@assets/LOGOfront_1776656215137.jpg";
import truckFrontImg from "@assets/foodtruckfront_1776656329344.jpg";
import truckBackImg from "@assets/Foodtruck_1776656329342.jpg";
import jerkeyImg from "@assets/1000017238_1776656424749.jpg";
import { useSettings } from "@/hooks/use-settings";

export default function Home() {
  const { data: specials, isLoading } = useGetCurrentSpecials();
  const { data: settings } = useSettings();

  const announcementActive = settings?.announcement_active !== "false";
  const announcementTitle = settings?.announcement_title ?? "Now Making Homemade Jerky!";
  const announcementBody = settings?.announcement_body ?? "Little Piggy's own handcrafted beef jerky — bold flavor, made right here in Canyon, TX. Call us for details, flavors & ordering!";
  const storyText = settings?.story_text ?? "Tim and Rene Vogler started This Little Piggy as a food truck with a simple dream — bring bold, satisfying food to the Texas Panhandle. From wings and burgers to pizza and baked potatoes, every dish is made with love at their restaurant on Chaparral Road in Canyon, TX.";
  const hoursWeekday = settings?.hours_weekday ?? "Mon-Thu 11am–9pm";
  const hoursWeekend = settings?.hours_weekend ?? "Fri-Sat 11am–10pm";
  const hoursSunday = settings?.hours_sunday ?? "Sun 10am–8pm";

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

            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-4 leading-tight font-bold">
              <span className="text-primary">This Little Piggy</span><br/>
              <span className="text-accent italic">Serves Food!</span>
            </h1>
            <p className="font-serif text-2xl md:text-3xl font-bold mb-6" style={{ color: "var(--piggy-pink)" }}>
              Home of the Big Butt Sandwich
            </p>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-lg mx-auto md:mx-0 font-light">
              Family-owned by Tim and Rene Vogler. Started as a food truck, now serving Canyon, TX with the best food in the Panhandle.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/menu">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 w-full sm:w-auto rounded-full shadow-lg shadow-primary/30 text-base glow-primary">
                  View Our Menu
                </Button>
              </Link>
              <a href="tel:+18063403895">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8 w-full sm:w-auto rounded-full shadow-lg shadow-accent/30 text-base flex items-center gap-2">
                  <Phone size={18} /> Call to Place Order
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Announcement Banner */}
      {announcementActive && <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-accent py-10 px-6"
      >
        {/* Subtle pattern bg */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)", backgroundSize: "12px 12px" }} />
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Jerky image */}
            <div className="shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-background/40 shadow-2xl shadow-black/40 rotate-2">
                <img
                  src={jerkeyImg}
                  alt="This Little Piggy Homemade Beef Jerky"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block bg-background/20 text-background font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                🔥 New Offering
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-background leading-tight mb-2">
                {announcementTitle}
              </h2>
              <p className="text-background/80 text-base md:text-lg mb-5">
                {announcementBody}
              </p>
              <a href="tel:+18063403895">
                <Button size="lg" className="bg-background text-accent hover:bg-background/90 font-bold rounded-full px-8 shadow-lg text-base flex items-center gap-2 mx-auto md:mx-0 w-fit">
                  <Phone size={18} /> Call for Details — (806) 340-3895
                </Button>
              </a>
            </div>
          </div>
        </div>
      </motion.section>}

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
              {/* Food truck photos stacked with offset */}
              <div className="relative max-w-lg mx-auto">
                {/* Back photo — slightly offset behind */}
                <div className="absolute top-4 left-4 right-0 rounded-2xl overflow-hidden border-4 border-primary/40 shadow-xl shadow-black/60 z-0">
                  <img
                    src={truckBackImg}
                    alt="This Little Piggy food truck — back view"
                    className="w-full h-56 object-cover"
                  />
                </div>
                {/* Front photo — on top */}
                <div className="relative z-10 mt-0 rounded-2xl overflow-hidden border-4 border-primary shadow-2xl shadow-primary/30 ml-0 mr-4 mb-4">
                  <img
                    src={truckFrontImg}
                    alt="This Little Piggy food truck"
                    className="w-full object-cover"
                    style={{ aspectRatio: "16/10" }}
                  />
                  {/* Overlay badge */}
                  <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border border-primary/50 rounded-xl px-4 py-2 flex items-center gap-2">
                    <img src={msPiggyImg} alt="" className="w-8 h-8 rounded-full object-cover border border-primary" />
                    <span className="font-serif font-bold text-primary text-sm">Where it all started!</span>
                  </div>
                </div>
                {/* Decorative badge */}
                <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground font-serif font-bold text-sm px-4 py-2 rounded-full shadow-lg z-20 border-2 border-background">
                  Est. Vega, TX
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
                  {storyText}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex gap-4 items-start bg-card rounded-lg p-5 border border-border">
                  <div className="p-3 rounded-lg shrink-0" style={{ background: "rgba(255,229,92,0.15)", color: "var(--piggy-yellow)" }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold mb-2 text-foreground">Hours</h3>
                    <p className="text-muted-foreground text-sm leading-loose">
                      {hoursWeekday}<br/>
                      {hoursWeekend}<br/>
                      {hoursSunday}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start bg-card rounded-lg p-5 border border-border">
                  <div className="p-3 rounded-lg shrink-0" style={{ background: "rgba(255,229,92,0.15)", color: "var(--piggy-yellow)" }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold mb-2 text-foreground">Find Us</h3>
                    <p className="text-muted-foreground text-sm leading-loose">
                      19501 Chaparral Road<br/>
                      Canyon, TX 79015<br/>
                      <span className="text-foreground/70 italic">Located inside the Country Club</span>
                    </p>
                    <a href="tel:+18063403895" className="flex items-center gap-1 mt-2 text-sm font-semibold transition-opacity hover:opacity-80" style={{ color: "var(--piggy-yellow)" }}>
                      <Phone size={13} /> (806) 340-3895
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specials Preview */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-3" style={{ color: "var(--piggy-yellow)" }}>
                Today's Specials
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Fresh from the kitchen, prepared just for today.
              </p>
            </div>
            <Link href="/specials">
              <button
                className="flex items-center gap-2 font-bold px-5 py-2.5 rounded-lg text-sm transition-all hover:opacity-90 shrink-0"
                style={{ background: "var(--piggy-purple)", color: "#fff" }}
              >
                See All Specials <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-muted rounded-lg h-48" />
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
                  className="group bg-card overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    borderRadius: "8px",
                    border: "1.5px solid var(--piggy-teal)",
                    boxShadow: "0 0 0 0 transparent",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 16px rgba(62,214,196,0.25)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 0 0 transparent")}
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
                      <h3 className="font-serif text-xl font-bold text-foreground">{special.title}</h3>
                      {special.price && (
                        <span className="font-serif text-lg font-bold shrink-0" style={{ color: "var(--piggy-yellow)" }}>
                          ${special.price}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">{special.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-lg" style={{ border: "1.5px solid var(--piggy-teal)" }}>
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
