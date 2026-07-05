"use client";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { Search, Home, ShieldCheck, Key } from "lucide-react";

const services = [
  {
    title: "Property Acquisition",
    description: "Expert guidance in finding and securing your dream home or investment property with exclusive market access.",
    icon: <Search className="w-8 h-8 text-gold" />
  },
  {
    title: "Luxury Sales",
    description: "Premium marketing and targeted exposure to ensure your high-end property reaches the right discerning buyers.",
    icon: <Home className="w-8 h-8 text-gold" />
  },
  {
    title: "Property Management",
    description: "Comprehensive management services providing peace of mind for your valuable real estate investments.",
    icon: <ShieldCheck className="w-8 h-8 text-gold" />
  },
  {
    title: "Exclusive Rentals",
    description: "Curated selection of premium rental properties for those seeking flexible luxury living arrangements.",
    icon: <Key className="w-8 h-8 text-gold" />
  }
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-foreground/70">
            Delivering unparalleled real estate excellence through our comprehensive suite of bespoke services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {services.map((service, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-10 hover:border-gold transition-colors group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="font-display text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-foreground/70 leading-relaxed text-lg">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
