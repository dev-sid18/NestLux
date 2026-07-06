"use client";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import StatsCounter from "@/components/StatsCounter";
import TestimonialTicker from "@/components/TestimonialTicker";
import PropertyCard from "@/components/PropertyCard";
import PropertyCarousel from "@/components/PropertyCarousel";
import Commitment from "@/components/Commitment";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { Shield, Award, Home as HomeIcon, Users } from "lucide-react";
import { motion } from "framer-motion";
import { getFeaturedProperties } from "@/lib/api";
import { useChatStore } from "@/store/useChatStore";

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const setChatContext = useChatStore((state) => state.setContext);

  useEffect(() => {
    getFeaturedProperties().then(data => {
      if (data && Array.isArray(data)) {
        setFeaturedProperties(data);
      }
    }).catch(err => console.error("Error fetching properties:", err));
  }, []);

  const features = [
    { icon: Shield, title: "Premium Locations", desc: "Curated properties in the most desirable neighborhoods." },
    { icon: Award, title: "Verified Listings", desc: "Every property goes through a rigorous inspection process." },
    { icon: Users, title: "Expert Agents", desc: "Dedicated professionals guiding you every step." },
    { icon: HomeIcon, title: "Legal Support", desc: "Full assistance with documentation and closing." },
  ];

  return (
    <main className="min-h-screen">
      <Hero />
      <SearchBar />

      {/* 3D Property Carousel */}
      {featuredProperties.length > 0 && (
        <PropertyCarousel properties={featuredProperties} />
      )}

      {/* Featured Properties Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-bold mb-4"
          >
            Featured Properties
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground/70 max-w-2xl mx-auto"
          >
            Discover our hand-picked selection of premium properties, each offering exceptional quality, location, and value.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((prop, i) => (
            <PropertyCard 
              key={prop._id || prop.id} 
              id={prop._id || prop.id}
              title={prop.title}
              price={prop.price}
              location={prop.location}
              bedrooms={prop.bedrooms}
              bathrooms={prop.bathrooms}
              sqft={prop.sqft}
              image={prop.images ? prop.images[0] : prop.image}
              status={prop.status}
              delay={i * 0.1} 
            />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-foreground/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl font-bold mb-4"
            >
              Why Choose NestLux
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6 text-gold">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-foreground/70">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <StatsCounter />
      <Commitment />
      <TestimonialTicker />
      <Footer />
    </main>
  );
}
