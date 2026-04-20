import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            ? "bg-background/90 backdrop-blur-md border-border py-4 shadow-sm"
            : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2 z-50">
            <span className="font-serif text-xl md:text-2xl tracking-tight text-primary transition-colors group-hover:text-primary/80">
              This Little Piggy Serves Food
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm uppercase tracking-widest font-medium transition-colors hover:text-primary relative group",
                  location === link.href ? "text-primary" : "text-foreground/80"
                )}
              >
                {link.label}
                {location === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary"
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-serif text-3xl transition-colors hover:text-primary",
                  location === link.href ? "text-primary" : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full pt-[88px] md:pt-[104px]">
        {children}
      </main>

      <footer className="bg-foreground text-background py-16 mt-auto">
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="font-serif text-xl text-primary-foreground">This Little Piggy Serves Food</span>
            <p className="text-muted-foreground max-w-xs text-sm">
              Family-owned by Tim and Rene Vogler. Started as a food truck, serving Canyon, TX with big flavors and even bigger portions.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-4">
            <h4 className="font-serif text-lg text-primary-foreground">Visit Us</h4>
            <p className="text-muted-foreground text-sm flex flex-col gap-1">
              <span>19501 Chaparral Road</span>
              <span>Canyon, TX 79015</span>
              <span className="mt-1">(806) 340-3895</span>
              <span>(806) 499-3307</span>
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-4">
            <h4 className="font-serif text-lg text-primary-foreground">Hours</h4>
            <p className="text-muted-foreground text-sm flex flex-col gap-1">
              <span>Mon-Thu: 11am - 9pm</span>
              <span>Fri-Sat: 11am - 10pm</span>
              <span>Sun: 10am - 8pm</span>
            </p>
          </div>
        </div>
        <div className="container mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-muted/20 text-center text-xs text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} This Little Piggy Serves Food LLC. All rights reserved.</p>
          <Link href="/admin" className="hover:text-primary transition-colors">Admin Portal</Link>
        </div>
      </footer>
    </div>
  );
}
