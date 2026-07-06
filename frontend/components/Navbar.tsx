"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Properties", href: "/properties" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-4 glass-card mx-4 mt-4 !rounded-full text-foreground" : `py-6 px-4 ${isHome ? "text-white" : "text-foreground"}`
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 z-50">
          <span className="font-display text-2xl font-bold tracking-wider">
            NestLux
          </span>
          <span className="h-2 w-2 rounded-full bg-gold mt-2"></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/properties" className="text-sm font-medium hover:text-gold transition-colors">Properties</Link>
          
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium hover:text-gold transition-colors">
              Projects Search <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-background text-foreground border border-foreground/10 rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl">
              <Link href="/properties?type=residential" className="block px-4 py-2 text-sm hover:bg-gold/10 hover:text-gold transition-colors">Residential Projects</Link>
              <Link href="/properties?type=commercial" className="block px-4 py-2 text-sm hover:bg-gold/10 hover:text-gold transition-colors">Commercial Projects</Link>
              <Link href="/properties?type=luxury" className="block px-4 py-2 text-sm hover:bg-gold/10 hover:text-gold transition-colors">Luxury Projects</Link>
            </div>
          </div>

          <Link href="/about" className="text-sm font-medium hover:text-gold transition-colors">About</Link>
          <Link href="/services" className="text-sm font-medium hover:text-gold transition-colors">Services</Link>
          <Link href="/contact" className="text-sm font-medium hover:text-gold transition-colors">Contact</Link>
          <Link href="/calculators" className="ml-4 bg-gold hover:bg-gold/90 text-navy px-5 py-2 rounded-full text-sm font-bold shadow-lg transition-all hover:scale-105 flex items-center gap-2">
            Calculate EMI
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4 z-50">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-gold" />
              ) : (
                <Moon className={`w-5 h-5 ${(!isScrolled && isHome) ? "text-white" : "text-navy"}`} />
              )}
            </button>
          )}
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-medium hover:text-gold transition-colors">
                Dashboard
              </Link>
              <button onClick={logout} className="text-sm font-medium text-red-400 hover:text-red-500 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-full border border-gold text-gold hover:bg-gold hover:text-white dark:hover:text-black transition-all font-medium text-sm"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4 z-50">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-gold" />
              ) : (
                <Moon className={`w-5 h-5 ${(!isScrolled && isHome) ? "text-white" : "text-navy"}`} />
              )}
            </button>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -mr-2"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Slide-in */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-md z-40 flex flex-col justify-center items-center gap-8"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-display text-3xl hover:text-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <div className="flex flex-col items-center gap-4 mt-4">
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="px-8 py-3 rounded-full bg-gold text-white font-medium">
                  Dashboard
                </Link>
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-red-400 font-medium">
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 px-8 py-3 rounded-full bg-gold text-white font-medium"
              >
                Sign In
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
