import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logoImg from "@assets/LOGOfront_1776656215137.jpg";
import { useSettings } from "@/hooks/use-settings";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: settings } = useSettings();
  const hoursWeekday = settings?.hours_weekday ?? "Mon-Thu 11am–9pm";
  const hoursWeekend = settings?.hours_weekend ?? "Fri-Sat 11am–10pm";
  const hoursSunday = settings?.hours_sunday ?? "Sun 10am–8pm";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/specials", label: "Specials" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col selection:bg-primary selection:text-primary-foreground">
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500 border-b border-transparent",
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-border py-2 shadow-lg shadow-black/40"
            : "bg-black/60 backdrop-blur-sm py-3"
        )}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 z-50">
            <img
              src={logoImg}
              alt="This Little Piggy Serves Food logo"
              className="h-14 w-14 rounded-full object-cover border-2 border-primary shadow-md shadow-primary/30 transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col leading-tight hidden sm:flex">
              <span className="font-serif text-lg font-bold text-primary leading-none">This Little Piggy Serves Food LLC</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm uppercase tracking-widest font-bold transition-colors hover:text-primary relative group font-sans",
                  location === link.href ? "text-primary" : "text-foreground/80"
                )}
              >
                {link.label}
                {location === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden z-50 text-foreground p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <img src={logoImg} alt="Logo" className="w-24 h-24 rounded-full object-cover border-4 border-primary mb-4 shadow-lg shadow-primary/30" />
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-serif text-3xl font-bold transition-colors hover:text-primary",
                  location === link.href ? "text-primary" : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full pt-[80px] md:pt-[88px]">
        {children}
      </main>

      <footer className="bg-card mt-auto" style={{ borderTop: "4px solid var(--piggy-pink)" }}>
        <div className="py-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col items-center mb-12">
            <img src={logoImg} alt="This Little Piggy Serves Food" className="w-20 h-20 rounded-full object-cover border-4 border-primary shadow-lg shadow-primary/30 mb-4" />
            <span className="font-serif text-2xl font-bold text-primary">This Little Piggy Serves Food LLC</span>
            <p className="text-muted-foreground text-sm mt-2 max-w-xs text-center">
              Family-owned by Tim and Rene Vogler. Serving Canyon, TX and surrounding areas with big flavors and even bigger butts!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left border-t border-border pt-12">
            <div className="flex flex-col items-center md:items-start gap-2">
              <h4 className="font-serif text-lg font-bold text-primary">Find Us</h4>
              <p className="text-muted-foreground text-sm flex flex-col gap-1">
                <span>19501 Chaparral Road</span>
                <span>Canyon, TX 79015</span>
                <span className="text-foreground/60 italic">Located inside the Country Club</span>
                <a href="tel:+18063403895" className="text-accent hover:text-accent/80 transition-colors mt-1">(806) 340-3895</a>
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-2">
              <h4 className="font-serif text-lg font-bold text-primary">Hours</h4>
              <p className="text-muted-foreground text-sm flex flex-col gap-1">
                <span>{hoursWeekday}</span>
                <span>{hoursWeekend}</span>
                <span>{hoursSunday}</span>
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-2">
              <h4 className="font-serif text-lg font-bold text-primary">Quick Links</h4>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <Link href="/menu" className="hover:text-primary transition-colors">Our Menu</Link>
                <Link href="/specials" className="hover:text-primary transition-colors">Daily Specials</Link>
                <Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link>
                <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-border text-center text-xs text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} This Little Piggy Serves Food LLC. All rights reserved.</p>
          <Link href="/admin" className="hover:text-primary transition-colors">Admin Portal</Link>
        </div>
        </div>
      </footer>
    </div>
  );
}
