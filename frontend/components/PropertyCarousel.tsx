"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function PropertyCarousel({ properties }: { properties: any[] }) {
  if (!properties || properties.length === 0) return null;

  return (
    <section className="py-24 bg-background overflow-hidden relative">
      <div className="text-center mb-16 px-6">
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Exclusive Collection</h2>
        <p className="text-foreground/70 max-w-2xl mx-auto">Slide through our most prestigious properties.</p>
      </div>

      <div className="w-full max-w-[1400px] mx-auto pb-12">
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          loop={true}
          speed={1000}
          spaceBetween={-40}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 120, // Forces overlap, removing gaps
            depth: 200,   // Ensures background items shrink back
            modifier: 1,
            scale: 0.85,
            slideShadows: true,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
          className="w-full py-10"
        >
          {properties.map((prop, i) => (
            <SwiperSlide key={prop._id || prop.id} className="w-[75vw] md:w-[50vw] max-w-[650px] rounded-3xl overflow-hidden group cursor-pointer shadow-2xl relative">
              <Link href={`/properties/${prop._id || prop.id}`}>
                <div className="relative aspect-[16/9] w-full">
                  <Image 
                    src={prop.images ? prop.images[0] : prop.image} 
                    alt={prop.title} 
                    fill 
                    priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2 text-white/80 text-sm md:text-base mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{prop.location}</span>
                    </div>
                    <h3 className="font-display text-2xl md:text-4xl font-bold text-white mb-2">{prop.title}</h3>
                    <p className="text-gold font-bold text-lg md:text-2xl">${prop.price.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      <style jsx global>{`
        .swiper-slide {
          transition: filter 0.3s ease;
        }
        .swiper-slide-next,
        .swiper-slide-prev {
          filter: blur(2px) brightness(0.7);
        }
        .swiper-pagination-bullet-active {
          background-color: var(--gold, #FFD700) !important;
        }
      `}</style>
    </section>
  );
}
