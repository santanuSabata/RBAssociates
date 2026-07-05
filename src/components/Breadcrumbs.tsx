import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface BreadcrumbsProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export default function Breadcrumbs({ activePage, setActivePage }: BreadcrumbsProps) {
  // If we are on the Home page, do not render breadcrumbs
  if (activePage === 'home') return null;

  // Map page IDs to human-readable labels
  const pageLabels: Record<string, string> = {
    about: 'About Us',
    services: 'Our Services',
    gallery: 'Photo Gallery',
    contact: 'Contact Us',
    admin: 'Executive Desk'
  };

  const currentLabel = pageLabels[activePage] || activePage;

  return (
    <div className="w-full bg-slate-50 border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8" id="site-breadcrumbs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Navigation Breadcrumb Links */}
        <nav className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-500" aria-label="Breadcrumb">
          {/* Home Link */}
          <button
            onClick={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 hover:text-indigo-900 transition-colors cursor-pointer group"
          >
            <Home size={13} className="text-slate-400 group-hover:text-indigo-900 transition-colors" />
            <span>HOME</span>
          </button>

          {/* Separator Chevron */}
          <ChevronRight size={12} className="text-slate-300 stroke-[2.5]" />

          {/* Current Page Link (Active/Static) */}
          <span className="text-indigo-900 select-none uppercase tracking-wider">
            {currentLabel}
          </span>
        </nav>

        {/* Small contextual badge */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase">
            RB ASSOCIATES &bull; {currentLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
