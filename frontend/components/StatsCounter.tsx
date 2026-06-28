"use client";
import { motion, useInView, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Counter = ({ from, to, duration, suffix = "" }: { from: number, to: number, duration: number, suffix?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (inView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (duration * 1000);

        if (progress < 1) {
          setCount(Math.floor(from + (to - from) * progress));
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(to);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [inView, from, to, duration]);

  return (
    <span ref={ref} className="font-display text-4xl font-bold text-gold">
      {count}{suffix}
    </span>
  );
};

export default function StatsCounter() {
  const stats = [
    { label: "Properties Listed", value: 500, suffix: "+" },
    { label: "Happy Clients", value: 200, suffix: "+" },
    { label: "Years Experience", value: 15, suffix: "+" },
    { label: "Expert Agents", value: 50, suffix: "+" },
  ];

  return (
    <section className="py-20 relative bg-gradient-to-r from-navy to-navy/90 text-white">
      <div className="absolute inset-0 bg-[url('https://picsum.photos/id/10/1920/1080')] opacity-10 mix-blend-overlay object-cover"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass-card p-6 border-gold/20"
            >
              <Counter from={0} to={stat.value} duration={2} suffix={stat.suffix} />
              <p className="mt-2 text-white/80 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
