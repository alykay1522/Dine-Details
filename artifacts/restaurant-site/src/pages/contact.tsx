import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Clock, Instagram, Facebook, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import msPiggyImg from "@assets/msPiggy_1776657247419.jpg";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent",
        description: "Thank you for reaching out. We'll get back to you soon!",
      });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Ms. Piggy mascot */}
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="relative inline-block">
              <img
                src={msPiggyImg}
                alt="This Little Piggy mascot"
                className="w-40 h-40 rounded-full object-cover border-4 border-primary shadow-2xl shadow-primary/40"
              />
              {/* Sparkle ring */}
              <div className="absolute inset-0 rounded-full border-4 border-accent/40 scale-110 animate-pulse" />
            </div>
            {/* Speech bubble */}
            <div className="relative bg-card border-2 border-primary/40 rounded-2xl px-6 py-3 shadow-lg max-w-xs">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-l-2 border-t-2 border-primary/40 rotate-45" />
              <p className="font-serif text-primary font-bold text-base">"We'd love to hear from ya!"</p>
            </div>
          </div>

          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            <span className="text-primary">Get In</span> <span className="text-accent">Touch</span>
          </h1>
          <div className="h-1 w-24 bg-primary mx-auto mb-4 rounded-full"></div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stop in, call, or send us a message. We're happy to help!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-12"
          >
            <div className="bg-muted/30 p-10 rounded-2xl border border-border">
              <h2 className="font-serif text-3xl mb-8">Details</h2>
              
              <div className="flex flex-col gap-8">
                <div className="flex gap-5 items-start">
                  <div className="p-3 bg-primary/10 text-primary rounded-full shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-2">Location</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      19501 Chaparral Road<br/>
                      Canyon, TX 79015
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <div className="p-3 bg-primary/10 text-primary rounded-full shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-2">Phone</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      <a href="tel:+18063403895" className="hover:text-primary transition-colors">(806) 340-3895</a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <div className="p-3 bg-primary/10 text-primary rounded-full shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-2">Hours</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Mon-Thu: 11am – 9pm<br/>
                      Fri-Sat: 11am – 10pm<br/>
                      Sun: 10am – 8pm
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="font-serif text-xl mb-2">Owned by Tim &amp; Rene Vogler</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Started as a food truck and grown into a beloved local spot. Come as you are.
                </p>
                <h3 className="font-serif text-xl mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" aria-label="Instagram" className="p-3 bg-card hover:bg-primary hover:text-white border border-border text-foreground rounded-full transition-colors">
                    <Instagram size={20} />
                  </a>
                  <a href="#" aria-label="Facebook" className="p-3 bg-card hover:bg-primary hover:text-white border border-border text-foreground rounded-full transition-colors">
                    <Facebook size={20} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-card p-10 rounded-2xl border border-border shadow-sm">
              <h2 className="font-serif text-3xl mb-8">Send a Message</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input id="name" required placeholder="Jane Doe" className="bg-background" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" required placeholder="jane@example.com" className="bg-background" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input id="subject" required placeholder="How can we help?" className="bg-background" />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea 
                    id="message" 
                    required 
                    placeholder="Your message here..." 
                    className="min-h-[150px] bg-background resize-none" 
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-white mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : (
                    <>
                      Send Message <Send className="ml-2" size={18} />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
