"use client";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [location, setLocation] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const router = useRouter();

  const handleNearMe = (silent = false) => {
    if (!navigator.geolocation) {
      if (!silent) toast.error("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
          const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            // Extract city/state
            const addressComponents = data.results[0].address_components;
            const city = addressComponents.find((c: any) => c.types.includes("locality"))?.long_name;
            const state = addressComponents.find((c: any) => c.types.includes("administrative_area_level_1"))?.long_name;
            
            const detectedLocation = city && state ? `${city}, ${state}` : data.results[0].formatted_address;
            setLocation(detectedLocation);
            if (!silent) toast.success(`Found location: ${detectedLocation}`);
          } else {
            if (!silent) toast.error("Could not determine your location");
          }
        } catch (error) {
          if (!silent) toast.error("Error fetching location");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        if (!silent) toast.error("Unable to retrieve your location");
        setIsLocating(false);
      }
    );
  };

  useEffect(() => {
    // Attempt auto-geolocation silently on load
    handleNearMe(true);
  }, []);

  const handleSearch = () => {
    if (location) {
      router.push(`/properties?location=${encodeURIComponent(location)}`);
    } else {
      router.push(`/properties`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass-card flex flex-col md:flex-row items-center justify-between p-4 max-w-5xl mx-auto -mt-16 relative z-20 gap-4"
    >
      <div className="flex-1 w-full relative">
        <label className="text-sm font-semibold text-foreground/70 mb-1 block">Location</label>
        <div className="flex items-center">
          <input 
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, Neighborhood, Zip"
            className="w-full bg-transparent border-none outline-none text-foreground font-sans placeholder:text-foreground/40"
          />
          <button 
            onClick={() => handleNearMe(false)}
            disabled={isLocating}
            className="p-2 text-gold hover:bg-gold/10 rounded-full transition-colors"
            title="Find homes near me"
          >
            <MapPin className={`w-5 h-5 ${isLocating ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>

      <div className="hidden md:block w-px h-10 bg-foreground/10"></div>

      <div className="flex-1 w-full">
        <label className="text-sm font-semibold text-foreground/70 mb-1 block">Property Type</label>
        <select className="w-full bg-transparent border-none outline-none text-foreground font-sans cursor-pointer focus:ring-0">
          <option value="">All Types</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="apartment">Apartment</option>
        </select>
      </div>

      <div className="hidden md:block w-px h-10 bg-foreground/10"></div>

      <div className="flex-1 w-full">
        <label className="text-sm font-semibold text-foreground/70 mb-1 block">Price Range</label>
        <select className="w-full bg-transparent border-none outline-none text-foreground font-sans cursor-pointer focus:ring-0">
          <option value="">Any Price</option>
          <option value="0-500k">$0 - $500k</option>
          <option value="500k-1m">$500k - $1M</option>
          <option value="1m+">$1M+</option>
        </select>
      </div>

      <button onClick={handleSearch} className="w-full md:w-auto bg-gold hover:bg-gold/90 text-navy font-bold py-3 px-8 rounded-full transition-all flex items-center justify-center gap-2 group">
        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
        Search
      </button>
    </motion.div>
  );
}
