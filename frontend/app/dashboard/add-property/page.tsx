"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { Upload, Sparkles, Building, MapPin, DollarSign, Bed, Bath, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AddPropertyPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    type: "villa",
    status: "For Sale"
  });
  
  const [files, setFiles] = useState<FileList | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.role === "user") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateAI = async () => {
    if (!formData.title || !formData.location) {
      toast.error("Please enter a title and location first.");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/generate-description`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: formData.title, 
          location: formData.location,
          type: formData.type,
          price: formData.price
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, description: data.description }));
        toast.success("AI generated a brilliant description!");
      } else {
        toast.error("Failed to generate description.");
      }
    } catch (error) {
      toast.error("AI Error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      
      if (files) {
        for (let i = 0; i < files.length; i++) {
          submitData.append("images", files[i]);
        }
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user?.token}`
        },
        body: submitData
      });

      if (res.ok) {
        toast.success("Property listed successfully!");
        router.push("/dashboard");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to list property");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <main className="min-h-screen pt-24 pb-12 bg-background px-4 md:px-8 max-w-4xl mx-auto">
      <Link href="/dashboard" className="flex items-center gap-2 text-foreground/60 hover:text-gold transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
        <h1 className="font-display text-3xl font-bold mb-2">List New Property</h1>
        <p className="text-foreground/60 mb-8">Add a new luxury property to your portfolio.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Property Title</label>
              <div className="relative">
                <Building className="absolute left-4 top-3 w-5 h-5 text-foreground/40" />
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-background/50 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 focus:border-gold outline-none" placeholder="e.g. Modern Glass Villa" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 w-5 h-5 text-foreground/40" />
                <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-background/50 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 focus:border-gold outline-none" placeholder="Beverly Hills, CA" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-3 w-5 h-5 text-foreground/40" />
                <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-background/50 border border-foreground/10 rounded-xl pl-10 pr-4 py-3 focus:border-gold outline-none" placeholder="5000000" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Bedrooms</label>
              <div className="relative">
                <Bed className="absolute left-4 top-3 w-5 h-5 text-foreground/40" />
                <input required type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full bg-background/50 border border-foreground/10 rounded-xl pl-10 pr-4 py-3 focus:border-gold outline-none" placeholder="5" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bathrooms</label>
              <div className="relative">
                <Bath className="absolute left-4 top-3 w-5 h-5 text-foreground/40" />
                <input required type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full bg-background/50 border border-foreground/10 rounded-xl pl-10 pr-4 py-3 focus:border-gold outline-none" placeholder="6" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-background/50 border border-foreground/10 rounded-xl px-4 py-3 focus:border-gold outline-none">
                <option value="villa">Villa</option>
                <option value="apartment">Apartment</option>
                <option value="mansion">Mansion</option>
                <option value="penthouse">Penthouse</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-background/50 border border-foreground/10 rounded-xl px-4 py-3 focus:border-gold outline-none">
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Area (sqft)</label>
              <div className="relative">
                <Building className="absolute left-4 top-3 w-5 h-5 text-foreground/40" />
                <input required type="number" name="sqft" value={formData.sqft} onChange={handleChange} className="w-full bg-background/50 border border-foreground/10 rounded-xl pl-10 pr-4 py-3 focus:border-gold outline-none" placeholder="4500" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium">Description</label>
              <button type="button" onClick={handleGenerateAI} disabled={isGenerating} className="text-xs flex items-center gap-1 bg-gold/10 text-gold px-3 py-1.5 rounded-full hover:bg-gold/20 transition-colors">
                <Sparkles className="w-3 h-3" /> {isGenerating ? "Thinking..." : "AI Writer"}
              </button>
            </div>
            <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full bg-background/50 border border-foreground/10 rounded-xl p-4 focus:border-gold outline-none resize-none" placeholder="Describe the property..."></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Photos</label>
            <div className="border-2 border-dashed border-foreground/20 rounded-xl p-8 text-center hover:border-gold/50 transition-colors cursor-pointer relative">
              <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Upload className="w-8 h-8 mx-auto mb-2 text-foreground/40" />
              <p className="text-foreground/60">{files ? `${files.length} files selected` : "Drag and drop or click to upload"}</p>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-gold text-white font-bold rounded-xl hover:bg-gold/90 transition-colors disabled:opacity-50">
            {isSubmitting ? "Uploading..." : "List Property"}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
