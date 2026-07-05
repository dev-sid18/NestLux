"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Bed, Bath, Square, Check, X, Calendar, View } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import toast from "react-hot-toast";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";

import { getPropertyById, getProperties, submitInquiry } from "@/lib/api";

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [property, setProperty] = useState<any>(null);
  const [similarProperties, setSimilarProperties] = useState<any[]>([]);
  const [activeImage, setActiveImage] = useState("");
  
  useEffect(() => {
    if (!id) return;
    getPropertyById(id).then(data => {
      setProperty(data);
      setActiveImage(data.images && data.images[0]);
    }).catch(err => console.error(err));

    getProperties().then(data => {
      if (data && Array.isArray(data)) {
        setSimilarProperties(data.filter((p: any) => p._id !== id).slice(0, 3));
      }
    });
  }, [id]);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [is360ViewerOpen, setIs360ViewerOpen] = useState(false);
  
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", date: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Booking a tour for ${property?.title || 'property'} on ${formData.date}`,
        propertyId: property?._id,
        date: formData.date
      });
      toast.success("Tour booked successfully! We will email you the confirmation.");
      setFormData({ name: "", email: "", phone: "", date: "" });
    } catch (error) {
      toast.error("Failed to book tour. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!property) return <div className="min-h-screen pt-32 text-center">Loading property...</div>;

  return (
    <main className="min-h-screen pt-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-navy text-gold text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {property.status}
              </span>
              <span className="text-foreground/60 text-sm capitalize">{property.type}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center gap-2 text-foreground/70">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{property.location}</span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm text-foreground/60 mb-1">Asking Price</p>
            <p className="font-display text-4xl font-bold text-gold">${property.price.toLocaleString()}</p>
          </div>
        </div>

        {/* 360 Viewer Button */}
        <div className="flex justify-end mb-6">
          <button 
            onClick={() => setIs360ViewerOpen(true)}
            className="bg-gold/10 text-gold border border-gold hover:bg-gold hover:text-navy px-6 py-3 rounded-full font-bold transition-colors flex items-center gap-2"
          >
            <View className="w-5 h-5" /> Explore 360° View
          </button>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16 h-[50vh] min-h-[400px]">
          <div 
            className="md:col-span-3 relative rounded-2xl overflow-hidden cursor-pointer group"
            onClick={() => setIsLightboxOpen(true)}
          >
            <Image src={activeImage} alt="Main" fill className="object-cover group-hover:scale-102 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            {property.images.slice(1, 4).map((img: string, idx: number) => (
              <div 
                key={idx} 
                className="relative flex-1 rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => setActiveImage(img)}
              >
                <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Details & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
          <div className="lg:col-span-2 space-y-12">
            {/* Key Features */}
            <div className="glass-card p-6 md:p-8 flex justify-around items-center divide-x divide-foreground/10">
              <div className="flex flex-col items-center px-4">
                <Bed className="w-8 h-8 text-gold mb-2" />
                <span className="font-bold text-xl">{property.bedrooms}</span>
                <span className="text-foreground/60 text-sm">Bedrooms</span>
              </div>
              <div className="flex flex-col items-center px-4">
                <Bath className="w-8 h-8 text-gold mb-2" />
                <span className="font-bold text-xl">{property.bathrooms}</span>
                <span className="text-foreground/60 text-sm">Bathrooms</span>
              </div>
              <div className="flex flex-col items-center px-4">
                <Square className="w-8 h-8 text-gold mb-2" />
                <span className="font-bold text-xl">{property.sqft}</span>
                <span className="text-foreground/60 text-sm">Square Feet</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-display text-3xl font-bold mb-4">About this Property</h2>
              <p className="text-foreground/70 leading-relaxed text-lg">
                {property.description} Experience the epitome of luxury living in this carefully crafted space designed for comfort and elegance. Every detail has been considered to provide a premium lifestyle for discerning residents.
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="font-display text-3xl font-bold mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-foreground/80">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div>
              <h2 className="font-display text-3xl font-bold mb-6">Location</h2>
              <div className="w-full h-80 rounded-2xl glass-card relative overflow-hidden flex items-center justify-center bg-foreground/5">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gold mx-auto mb-2" />
                  <p className="font-medium">{property.location}</p>
                  <p className="text-sm text-foreground/60">Map integration placeholder</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Booking Form */}
          <div className="lg:col-span-1">
            <div className="glass-card p-8 sticky top-32">
              <h3 className="font-display text-2xl font-bold mb-2">Book a Tour</h3>
              <p className="text-foreground/60 text-sm mb-6">Schedule an exclusive viewing of this property.</p>
              
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background border border-foreground/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-colors text-sm" />
                </div>
                <div>
                  <input required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-background border border-foreground/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-colors text-sm" />
                </div>
                <div>
                  <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-background border border-foreground/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-colors text-sm" />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3 w-5 h-5 text-foreground/40" />
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-background border border-foreground/10 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-gold transition-colors text-sm cursor-pointer" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-gold hover:bg-gold/90 text-navy font-bold py-3 rounded-lg transition-all mt-4">
                  {isSubmitting ? "Booking..." : "Schedule Tour"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="border-t border-foreground/10 pt-16 mb-16">
            <h2 className="font-display text-3xl font-bold mb-8">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarProperties.map((prop, i) => (
                <PropertyCard 
                  key={prop._id || prop.id}
                  id={prop._id || prop.id}
                  title={prop.title}
                  price={prop.price}
                  location={prop.location}
                  bedrooms={prop.bedrooms}
                  bathrooms={prop.bathrooms}
                  sqft={prop.sqft}
                  image={prop.images ? prop.images[0] : prop.image}
                  status={prop.status}
                  delay={i * 0.1} 
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          >
            <button onClick={() => setIsLightboxOpen(false)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10">
              <X className="w-10 h-10" />
            </button>
            <div className="relative w-full max-w-6xl h-[80vh] mx-4">
              <Image src={activeImage} alt="Fullscreen" fill className="object-contain" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 360 Viewer Modal */}
      <AnimatePresence>
        {is360ViewerOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            <div className="p-4 flex justify-between items-center bg-black/50 absolute top-0 w-full z-10">
              <h3 className="text-white font-display text-xl">360° Virtual Tour</h3>
              <button onClick={() => setIs360ViewerOpen(false)} className="text-white hover:text-gold transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="flex-1 w-full relative">
              <ReactPhotoSphereViewer 
                src="https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg" 
                height="100vh" 
                width="100%" 
                defaultZoomLvl={30}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
