"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";

export default function Commitment() {
  return (
    <section className="py-24 bg-foreground/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0 w-full z-10 rounded-lg overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop" 
                alt="Founder" 
                fill 
                className="object-cover"
              />
            </div>
            {/* Decorative outline matching screenshot */}
            <div className="absolute -inset-4 border border-foreground/20 z-0 max-w-md mx-auto lg:mx-0 hidden md:block" style={{ top: '-20px', left: '-20px', right: '20px', bottom: '20px' }}></div>
          </motion.div>

          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full lg:w-1/2"
          >
            <Quote className="w-16 h-16 text-gold mb-6 opacity-80" />
            
            <h4 className="text-lg md:text-xl text-foreground/70 mb-2">We earned trust through</h4>
            <h2 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-8">Commitment</h2>
            
            <div className="space-y-6 text-foreground/70 text-lg leading-relaxed">
              <p>
                From the start, my ambition wasn't just to sell properties, but to create something lasting, something that truly matters. For over two decades, that commitment has been the driving force behind NestLux.
              </p>
              <p>
                With countless completed projects, millions of square feet delivered, and over 5,000 happy homes, the milestones are many. But what matters most are the lives we have touched and the communities we have shaped.
              </p>
              <p>
                As I look ahead, my commitment remains clear: to build with integrity, stay true to my values, and make NestLux a name that stands for more than real estate.
              </p>
            </div>
            
            <div className="mt-12">
              {/* Signature Font (using standard font for reliability, but styling it like cursive) */}
              <div className="font-serif italic text-4xl mb-2 text-foreground/90">Siddharth</div>
              <p className="text-sm font-bold uppercase tracking-widest text-foreground/50">Founder & Managing Director</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
