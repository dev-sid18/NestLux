"use client";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PropertyProps {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
  status: string;
  delay?: number;
}

export default function PropertyCard({ id, title, price, location, bedrooms, bathrooms, sqft, image, status, delay = 0 }: PropertyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-card group overflow-hidden hover:-translate-y-2 hover:border-gold"
    >
      <Link href={`/properties/${id}`}>
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={true}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 bg-navy/90 text-gold text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
            {status}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-1 text-sm text-foreground/70 mb-2">
            <MapPin className="w-4 h-4" />
            {location}
          </div>
          <h3 className="font-display text-2xl font-bold mb-2 group-hover:text-gold transition-colors">{title}</h3>
          <div className="text-gold font-bold text-xl mb-4">
            ${price.toLocaleString()}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-foreground/10 text-sm text-foreground/80">
            <div className="flex items-center gap-1"><Bed className="w-4 h-4" /> {bedrooms} Beds</div>
            <div className="flex items-center gap-1"><Bath className="w-4 h-4" /> {bathrooms} Baths</div>
            <div className="flex items-center gap-1"><Square className="w-4 h-4" /> {sqft} Sqft</div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
