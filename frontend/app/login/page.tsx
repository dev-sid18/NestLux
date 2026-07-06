"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        router.push("/dashboard");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-gold/5 to-transparent" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-foreground/60">Sign in to your NestLux account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-3 w-5 h-5 text-foreground/40" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background/50 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-3 w-5 h-5 text-foreground/40" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-background/50 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-gold" />
              <span className="text-foreground/70">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-gold hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-gold hover:bg-gold/90 text-navy font-bold py-3 rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-foreground/60 text-sm mt-8">
          Don't have an account?{" "}
          <Link href="/register" className="text-gold font-medium hover:underline">
            Create Account
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
