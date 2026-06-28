"use client";
import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  { name: 'Rajesh Kumar', role: 'Homebuyer', rating: 5, quote: 'NestLux made finding our dream home a breeze. Their service is truly premium.', avatar: 'RK' },
  { name: 'Priya Sharma', role: 'Property Investor', rating: 5, quote: 'I rely on NestLux for all my property investments. Expert agents and verified listings.', avatar: 'PS' },
  { name: 'Amit Patel', role: 'Seller', rating: 4, quote: 'They sold my house in record time. The presentation and marketing were top-notch.', avatar: 'AP' },
  { name: 'Sneha Gupta', role: 'First-time Buyer', rating: 5, quote: 'As a first-time buyer, I felt supported throughout the entire process. Thank you, NestLux!', avatar: 'SG' },
  { name: 'Vikram Singh', role: 'Renter', rating: 5, quote: 'Found an amazing apartment in the city center. The team was very responsive.', avatar: 'VS' },
  { name: 'Anjali Desai', role: 'Business Owner', rating: 5, quote: 'Their commercial property team is knowledgeable and professional. Highly recommended.', avatar: 'AD' },
];

const TestimonialCard = ({ testimonial }: { testimonial: any }) => (
  <div className="glass-card w-[350px] p-6 mx-4 flex-shrink-0 hover:scale-102 transition-transform cursor-pointer">
    <div className="flex gap-1 mb-4">
      {[...Array(testimonial.rating)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-gold text-gold" />
      ))}
    </div>
    <p className="text-foreground/80 mb-6 italic">"{testimonial.quote}"</p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-navy font-bold text-lg">
        {testimonial.avatar}
      </div>
      <div>
        <h4 className="font-bold">{testimonial.name}</h4>
        <p className="text-sm text-foreground/60">{testimonial.role}</p>
      </div>
    </div>
  </div>
);

export default function TestimonialTicker() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="text-center mb-16 px-6">
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
        <p className="text-foreground/70 max-w-2xl mx-auto">Discover why discerning buyers and sellers choose NestLux for their real estate needs.</p>
      </div>

      {/* Row 1 (Left to Right) */}
      <div className="relative flex overflow-x-hidden mb-8 group">
        <div className="animate-marquee whitespace-nowrap flex group-hover:[animation-play-state:paused]">
          {[...testimonials, ...testimonials].map((t, i) => (
            <TestimonialCard key={`row1-${i}`} testimonial={t} />
          ))}
        </div>
      </div>

      {/* Row 2 (Right to Left) */}
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee-reverse whitespace-nowrap flex group-hover:[animation-play-state:paused]">
          {[...testimonials, ...testimonials].reverse().map((t, i) => (
            <TestimonialCard key={`row2-${i}`} testimonial={t} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 35s linear infinite;
        }
      `}</style>
    </section>
  );
}
