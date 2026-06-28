"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Footer from "@/components/Footer";
import { Award, Shield, Users, Clock } from "lucide-react";

const agents = [
  { name: "Sarah Jenkins", role: "Principal Broker", image: "https://picsum.photos/seed/sarah/400/400" },
  { name: "David Chen", role: "Luxury Specialist", image: "https://picsum.photos/seed/david/400/400" },
  { name: "Elena Rodriguez", role: "Commercial Lead", image: "https://picsum.photos/seed/elena/400/400" },
  { name: "Marcus Johnson", role: "Investment Advisor", image: "https://picsum.photos/seed/marcus/400/400" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 bg-background">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">Redefining Luxury Real Estate</h1>
            <p className="text-foreground/70 text-lg">
              At NestLux, we believe that finding a home is more than a transaction—it's a life-changing experience. Our curated portfolio and dedicated experts ensure unparalleled service for discerning clients worldwide.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative h-[60vh] w-full rounded-3xl overflow-hidden glass-card p-2"
          >
            <Image
              src="https://picsum.photos/seed/office/1920/1080"
              alt="NestLux Office"
              fill
              className="object-cover rounded-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-foreground/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Integrity", desc: "Honesty and transparency in every interaction." },
              { icon: Award, title: "Excellence", desc: "Setting the highest standard in the industry." },
              { icon: Users, title: "Client First", desc: "Your goals are our primary focus and priority." },
              { icon: Clock, title: "Dedication", desc: "Working tirelessly to achieve your real estate dreams." },
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6 text-gold">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">{value.title}</h3>
                <p className="text-foreground/70">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold mb-4">Meet Our Experts</h2>
          <p className="text-foreground/70">The dedicated professionals behind your success.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {agents.map((agent, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card group overflow-hidden"
            >
              <div className="relative h-72 w-full overflow-hidden">
                <Image
                  src={agent.image}
                  alt={agent.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-xl mb-1">{agent.name}</h3>
                <p className="text-gold font-medium text-sm">{agent.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
