"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import { getProperties } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filterType, setFilterType] = useState(searchParams.get("type") || "all");
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paramsObj = {
      location: searchParams.get("location") || "",
      type: searchParams.get("type") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      beds: searchParams.get("beds") || ""
    };

    setLoading(true);
    getProperties(paramsObj).then(data => {
      if (data && Array.isArray(data)) {
        setAllProperties(data);
      }
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching properties:", err);
      setLoading(false);
    });
  }, [searchParams]);

  const filteredProperties = filterType === "all" 
    ? allProperties 
    : allProperties.filter(p => p.type.toLowerCase() === filterType.toLowerCase());

  const handleFilterClick = (type: string) => {
    setFilterType(type);
    if (type === 'all') {
      router.push('/properties');
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set('type', type);
      router.push(`/properties?${params.toString()}`);
    }
  };

  return (
    <main className="min-h-screen pt-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Explore Properties</h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Find your perfect home from our curated selection of premium properties.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {['all', 'house', 'villa', 'apartment', 'studio', 'penthouse'].map((type) => (
            <button
              key={type}
              onClick={() => handleFilterClick(type)}
              className={`px-6 py-2 rounded-full capitalize font-medium transition-all ${
                filterType === type 
                  ? 'bg-gold text-white shadow-lg' 
                  : 'bg-foreground/5 hover:bg-foreground/10 text-foreground'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Property Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          <AnimatePresence>
            {filteredProperties.map((prop, i) => (
              <motion.div
                key={prop._id || prop.id || i}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <PropertyCard 
                  id={prop._id || prop.id}
                  title={prop.title}
                  price={prop.price}
                  location={prop.location}
                  bedrooms={prop.bedrooms}
                  bathrooms={prop.bathrooms}
                  sqft={prop.sqft}
                  image={prop.images ? prop.images[0] : prop.image}
                  status={prop.status}
                  delay={0} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {loading ? (
          <div className="text-center py-20 text-foreground/60 animate-pulse font-bold text-xl">
            Searching for your dream home...
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20 text-foreground/60">
            No properties found matching your criteria. Try adjusting your search!
          </div>
        ) : null}
      </div>
      <Footer />
    </main>
  );
}
