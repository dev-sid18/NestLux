"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Sparkles, Building, DollarSign } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [mode, setMode] = useState<"smart" | "classic">("classic");
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // Classic Search State
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  const router = useRouter();

  const handleSmartSearch = async () => {
    if (!query) return;
    setIsSearching(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/smart-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const filters = await res.json();
      
      const params = new URLSearchParams();
      if (filters.location) params.append("location", filters.location);
      if (filters.propertyType) params.append("type", filters.propertyType);
      if (filters.budget) params.append("maxPrice", filters.budget.toString());
      if (filters.bedrooms) params.append("beds", filters.bedrooms.toString());
      
      router.push(`/properties?${params.toString()}`);
    } catch (error) {
      toast.error("AI Search failed. Try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleClassicSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (type) params.append("type", type);
    if (maxPrice) params.append("maxPrice", maxPrice);
    
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto -mt-16 relative z-20 px-4">
      {/* Search Mode Tabs */}
      <div className="flex gap-2 mb-2 ml-4">
        <button 
          onClick={() => setMode("classic")}
          className={`px-6 py-2 rounded-t-xl font-bold text-sm transition-all ${mode === "classic" ? "bg-navy text-gold" : "bg-background/80 text-foreground/60 hover:bg-background"}`}
        >
          Classic Search
        </button>
        <button 
          onClick={() => setMode("smart")}
          className={`px-6 py-2 rounded-t-xl font-bold text-sm transition-all flex items-center gap-2 ${mode === "smart" ? "bg-gold text-navy" : "bg-background/80 text-foreground/60 hover:bg-background"}`}
        >
          <Sparkles className="w-4 h-4" /> AI Smart Search
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 md:p-6"
      >
        <AnimatePresence mode="wait">
          {mode === "smart" ? (
            <motion.div 
              key="smart"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col md:flex-row items-center gap-4"
            >
              <div className="flex-1 relative w-full">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Sparkles className="w-6 h-6 text-gold animate-pulse" />
                </div>
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. 'A luxury villa in Malibu under $5M with a pool'"
                  className="w-full bg-background/50 border border-foreground/10 rounded-xl pl-14 pr-4 py-4 focus:border-gold outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleSmartSearch()}
                />
              </div>

              <button 
                onClick={handleSmartSearch} 
                disabled={isSearching}
                className="w-full md:w-auto bg-gold hover:bg-gold/90 text-navy font-bold py-4 px-10 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSearching ? <span className="animate-pulse">Thinking...</span> : "Search"}
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="classic"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col md:flex-row items-center gap-4"
            >
              {/* Location */}
              <div className="flex-1 relative w-full">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input 
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-background/50 border border-foreground/10 rounded-xl pl-12 pr-4 py-4 focus:border-gold outline-none"
                />
              </div>

              {/* Type */}
              <div className="flex-1 relative w-full">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-background/50 border border-foreground/10 rounded-xl pl-12 pr-4 py-4 focus:border-gold outline-none appearance-none"
                >
                  <option value="">Property Type</option>
                  <option value="villa">Villa</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="mansion">Mansion</option>
                </select>
              </div>

              {/* Price */}
              <div className="flex-1 relative w-full">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <select 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-background/50 border border-foreground/10 rounded-xl pl-12 pr-4 py-4 focus:border-gold outline-none appearance-none"
                >
                  <option value="">Max Price</option>
                  <option value="1000000">Up to $1M</option>
                  <option value="5000000">Up to $5M</option>
                  <option value="10000000">Up to $10M</option>
                  <option value="50000000">Any Price</option>
                </select>
              </div>

              <button 
                onClick={handleClassicSearch}
                className="w-full md:w-auto bg-navy hover:bg-navy/90 text-white font-bold py-4 px-10 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Search <Search className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
