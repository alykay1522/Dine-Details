import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Clock, Instagram, Facebook, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent",
        description: "Thank you for reaching out. We'll get back to you soon.",
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
          className="text-center mb-20"
        >
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">Contact Us</h1>
          <div className="h-px w-24 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto italic">
            We'd love to hear from you. Drop us a line or come visit us.
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
                      42 Orchard Lane<br/>
                      Anytown, USA 12345
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
                      (555) 0198
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
                      Mon-Thu: 11am - 9pm<br/>
                      Fri-Sat: 11am - 10pm<br/>
                      Sun: 10am - 8pm
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="font-serif text-xl mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="p-3 bg-card hover:bg-primary hover:text-white border border-border text-foreground rounded-full transition-colors">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="p-3 bg-card hover:bg-primary hover:text-white border border-border text-foreground rounded-full transition-colors">
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
