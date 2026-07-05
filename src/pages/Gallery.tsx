import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Filter, Eye } from 'lucide-react';
import { GalleryItem } from '../types.js';

interface GalleryProps {
  gallery: GalleryItem[];
}

export default function Gallery({ gallery }: GalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Office', 'Seminars', 'Client Meets', 'Team Achievements'];

  // Filter gallery items based on selection
  const filteredGallery = selectedCategory === 'All'
    ? gallery
    : gallery.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredGallery.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredGallery.length) % filteredGallery.length);
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 pb-24" id="gallery-page">
      {/* Page Header */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white border-b border-slate-200 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-indigo-900/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-900 bg-indigo-50 px-3 py-1 rounded">Corporate Events</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-slate-900">Our Photo Gallery</h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto font-sans font-medium">
            Insights into our consulting seminars, Raipur headquarters, client advisory desks, and corporate milestones.
          </p>
        </div>
      </section>

      {/* Category Filter Menu */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2.5">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-mono mr-2 font-bold">
          <Filter size={14} className="text-indigo-900" />
          <span>FILTER:</span>
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded font-mono uppercase tracking-widest transition-all border cursor-pointer ${
              selectedCategory.toLowerCase() === cat.toLowerCase()
                ? 'bg-indigo-900 text-white border-indigo-900 font-bold shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-900/30 hover:text-indigo-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Gallery Image Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredGallery.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center space-y-4 text-slate-400"
            >
              <ImageIcon size={48} className="mx-auto stroke-1 text-slate-300" />
              <p className="text-sm font-sans font-medium">No images found in this corporate category.</p>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredGallery.map((item, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={item._id}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative rounded overflow-hidden bg-white border border-slate-200 aspect-[4/3] cursor-pointer shadow-sm hover:shadow-md"
                >
                  {/* Photo frame */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  
                  {/* Gradient hover layer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Icon zoom overlay indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-10 w-10 rounded-full bg-indigo-900 flex items-center justify-center text-white shadow-lg">
                      <Eye size={18} className="stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Descriptions block at the bottom */}
                  <div className="absolute bottom-5 left-5 right-5 text-left space-y-0.5">
                    <span className="text-[9px] font-mono font-bold uppercase text-indigo-300 tracking-widest block">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-white font-display">
                      {item.title}
                    </h3>
                    <p className="text-slate-200 text-[10px] leading-relaxed font-sans font-light line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Lightbox Modal (Full Screen with Balanced Controls) */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredGallery[lightboxIndex] && (
          <div 
            className="fixed inset-0 z-50 flex flex-col justify-between p-4 bg-slate-950/95 backdrop-blur-md animate-fadeIn"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top Bar controls */}
            <div className="flex items-center justify-between py-2 text-white max-w-7xl mx-auto w-full">
              <span className="text-xs font-mono text-slate-400 font-semibold">
                {filteredGallery[lightboxIndex].category.toUpperCase()} &bull; {lightboxIndex + 1} / {filteredGallery.length}
              </span>
              <button
                onClick={() => setLightboxIndex(null)}
                className="h-10 w-10 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                aria-label="Close lightbox"
              >
                <X size={18} />
              </button>
            </div>

            {/* Middle Frame content */}
            <div className="flex-1 flex items-center justify-between max-w-7xl mx-auto w-full py-4 relative">
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-0 md:left-4 z-20 h-12 w-12 rounded bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 transition-colors cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Central Image Panel */}
              <div className="w-full flex justify-center max-h-[70vh] px-12">
                <motion.img
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={filteredGallery[lightboxIndex]._id}
                  src={filteredGallery[lightboxIndex].imageUrl}
                  alt={filteredGallery[lightboxIndex].title}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[70vh] rounded object-contain border border-slate-800 shadow-2xl bg-slate-900"
                />
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-0 md:right-4 z-20 h-12 w-12 rounded bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 transition-colors cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Caption pane */}
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-4 text-white">
              <h2 className="text-lg font-bold font-display text-white">
                {filteredGallery[lightboxIndex].title}
              </h2>
              <p className="text-slate-400 text-xs font-sans font-light">
                {filteredGallery[lightboxIndex].description}
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
