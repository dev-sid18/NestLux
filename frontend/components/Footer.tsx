"use client";
import { Globe, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold">NestLux</span>
            <div className="w-2 h-2 rounded-full bg-gold"></div>
          </Link>
          <p className="text-white/70 max-w-xs">
            Premium real estate agency curating the finest properties for discerning buyers worldwide.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"><Globe className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"><Mail className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"><Phone className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"><MapPin className="w-5 h-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Quick Links</h4>
          <ul className="space-y-4 text-white/70">
            <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-gold transition-colors">About Us</Link></li>
            <li><Link href="/properties" className="hover:text-gold transition-colors">Properties</Link></li>
            <li><Link href="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Properties</h4>
          <ul className="space-y-4 text-white/70">
            <li><Link href="/properties?type=house" className="hover:text-gold transition-colors">Houses</Link></li>
            <li><Link href="/properties?type=villa" className="hover:text-gold transition-colors">Villas</Link></li>
            <li><Link href="/properties?type=apartment" className="hover:text-gold transition-colors">Apartments</Link></li>
            <li><Link href="/properties?type=penthouse" className="hover:text-gold transition-colors">Penthouses</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Contact</h4>
          <ul className="space-y-4 text-white/70">
            <li>123 Luxury Avenue</li>
            <li>Beverly Hills, CA 90210</li>
            <li>contact@nestlux.com</li>
            <li>+1 (800) 123-4567</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
        <p>&copy; {new Date().getFullYear()} NestLux Real Estate. All rights reserved.</p>
      </div>
    </footer>
  );
}
