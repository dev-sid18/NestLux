"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { Heart, Home, Settings, MessageSquare, LogOut } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const isAgent = user.role === "agent" || user.role === "admin";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <main className="min-h-screen pt-24 bg-background px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 py-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 glass-card p-6 h-fit sticky top-28">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xl uppercase">
              {user.name?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="font-bold text-lg">{user.name || "User"}</h2>
              <p className="text-sm text-foreground/60 capitalize">{user.role}</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gold/10 text-gold rounded-lg font-medium transition-colors">
              <Home className="w-5 h-5" />
              Overview
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-foreground/5 text-foreground/80 rounded-lg font-medium transition-colors">
              <Heart className="w-5 h-5" />
              Wishlist
            </button>
            {isAgent && (
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-foreground/5 text-foreground/80 rounded-lg font-medium transition-colors">
                <MessageSquare className="w-5 h-5" />
                Leads & Messages
              </button>
            )}
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-foreground/5 text-foreground/80 rounded-lg font-medium transition-colors">
              <Settings className="w-5 h-5" />
              Settings
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 mt-4 hover:bg-red-500/10 text-red-500 rounded-lg font-medium transition-colors">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <header className="flex justify-between items-center">
            <div>
              <h1 className="font-display text-3xl font-bold">Welcome back, {user.name?.split(' ')[0] || "there"}</h1>
              <p className="text-foreground/60">Here is what's happening with your account today.</p>
            </div>
            {isAgent && (
              <Link href="/dashboard/add-property" className="px-6 py-2.5 bg-gold text-white font-bold rounded-full hover:scale-105 transition-transform">
                + Add Listing
              </Link>
            )}
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-foreground/60 text-sm font-medium mb-2">Saved Properties</h3>
              <p className="text-4xl font-display font-bold text-gold">12</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-foreground/60 text-sm font-medium mb-2">Viewed This Week</h3>
              <p className="text-4xl font-display font-bold text-gold">45</p>
            </div>
            {isAgent && (
              <div className="glass-card p-6 border border-gold/20">
                <h3 className="text-foreground/60 text-sm font-medium mb-2">Active Listings</h3>
                <p className="text-4xl font-display font-bold text-gold">8</p>
              </div>
            )}
          </div>

          {/* Activity Section */}
          <section className="glass-card p-6">
            <h2 className="font-display text-2xl font-bold mb-6">Recent Activity</h2>
            <div className="text-center py-12 text-foreground/50">
              No recent activity to show yet.
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
