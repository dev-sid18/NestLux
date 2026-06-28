"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero() {


  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')",
        }}
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#070B14]/85 to-[#070B14]/40" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-20"
      >
        <motion.h1
          variants={itemVariants}
          className="font-display text-5xl md:text-7xl text-white font-bold leading-tight tracking-tight mb-6"
        >
          Find Your Dream Home
        </motion.h1>
        
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto"
        >
          Premium properties curated for discerning buyers. Experience luxury real estate at its finest.
        </motion.p>
        
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/properties"
            className="w-full sm:w-auto px-8 py-4 bg-gold text-white font-medium rounded-full hover:bg-gold/90 transition-colors"
          >
            Explore Properties
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-colors"
          >
            Book Consultation
          </Link>
        </motion.div>
      </motion.div>


    </section>
  );
}
