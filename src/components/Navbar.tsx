import React, { useState } from 'react';
import { Menu, X, Phone, Mail, Lock, Sparkles, LogOut, LayoutDashboard } from 'lucide-react';
import { GeneralSettings } from '../types.js';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  settings: GeneralSettings;
  adminLoggedIn: boolean;
  onLogout: () => void;
}

export default function Navbar({ activePage, setActivePage, settings, adminLoggedIn, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 text-slate-800 backdrop-blur-md border-b border-slate-200" id="app-header">
      {/* Top Utility Bar */}
      <div className="hidden md:flex w-full bg-slate-50 text-slate-600 text-xs py-2.5 px-8 justify-between items-center border-b border-slate-200/60">
        <div className="flex items-center gap-6 font-medium">
          <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
            <Mail size={13} className="text-indigo-600" />
            <span>{settings.contactEmail}</span>
          </a>
          <span className="flex items-center gap-1.5 text-slate-500">
            <Phone size={13} className="text-indigo-600" />
            <span>{settings.primaryMobile}</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded font-mono font-semibold tracking-wider">RAIPUR, CG</span>
          {adminLoggedIn ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1.5 text-xs text-indigo-700 hover:text-indigo-800 font-semibold ${activePage === 'admin' ? 'underline decoration-2' : ''}`}
              >
                <LayoutDashboard size={13} />
                <span>Dashboard</span>
              </button>
              <button onClick={onLogout} className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium">
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => handleNavClick('admin')}
              className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors font-medium text-slate-600"
            >
              <Lock size={13} className="text-indigo-600" />
              <span>Admin Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4.5 flex items-center justify-between">
        {/* Branding Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
          {settings.websiteLogo ? (
            <img 
              src={settings.websiteLogo} 
              alt={settings.websiteName || "Logo"} 
              className="h-15 w-auto max-w-[140px] object-contain transition-transform hover:scale-105" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-15 w-10 rounded bg-indigo-900 flex items-center justify-center shadow-md shadow-indigo-900/10 transition-transform hover:scale-105">
              <span className="text-lg font-bold font-display tracking-tight text-white">RB</span>
            </div>
          )}
           
        </div>

        {/* Desktop Navbar Links */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-sm">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative py-1.5 transition-colors duration-200 cursor-pointer text-slate-600 hover:text-indigo-900 ${
                activePage === item.id ? 'text-indigo-900 font-bold' : ''
              }`}
            >
              {item.label}
              {activePage === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.75 bg-indigo-900 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Call to Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={`tel:${settings.whatsAppNumber}`}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-2.5 rounded text-xs tracking-widest uppercase transition-all duration-200 shadow-md shadow-orange-900/20 hover:shadow-orange-900/30 active:scale-95"
          >
            <Phone size={13} className="stroke-[3]" />
            <span>Consult Now</span>
          </a>
        </div>
        
        {/* Mobile Navigation Trigger */}
        <div className="md:hidden flex items-center gap-3">
          {adminLoggedIn && (
            <button 
              onClick={() => handleNavClick('admin')}
              className={`p-2 text-indigo-900 hover:text-indigo-700 ${activePage === 'admin' ? 'bg-slate-100 rounded' : ''}`}
              title="Admin Dashboard"
            >
              <LayoutDashboard size={18} />
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-600 hover:text-indigo-900 hover:bg-slate-100 rounded transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="md:hidden w-full bg-white border-b border-slate-200 py-4 px-4 space-y-3 transition-all duration-300 animate-fadeIn shadow-lg">
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded text-sm font-semibold transition-colors ${
                  activePage === item.id
                    ? 'bg-indigo-50 text-indigo-900 border-l-4 border-indigo-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex flex-col gap-2 px-4 text-xs text-slate-500 font-mono">
              <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-2 py-1 hover:text-indigo-600">
                <Mail size={12} className="text-indigo-600" />
                <span>{settings.contactEmail}</span>
              </a>
              <a href={`tel:${settings.primaryMobile}`} className="flex items-center gap-2 py-1 hover:text-indigo-600">
                <Phone size={12} className="text-indigo-600" />
                <span>{settings.primaryMobile}</span>
              </a>
            </div>

            <div className="flex items-center justify-between px-4">
              <button
                onClick={() => handleNavClick('admin')}
                className="text-xs text-indigo-700 hover:underline flex items-center gap-1 font-mono font-semibold"
              >
                <Lock size={12} />
                <span>{adminLoggedIn ? 'Dashboard' : 'Admin Panel'}</span>
              </button>
              {adminLoggedIn && (
                <button 
                  onClick={onLogout}
                  className="text-xs text-red-600 hover:underline flex items-center gap-1 font-mono font-semibold"
                >
                  <LogOut size={12} />
                  <span>Logout</span>
                </button>
              )}
            </div>

            <div className="px-4">
              <a
                href={`tel:${settings.primaryMobile}`}
                className="w-full flex items-center justify-center gap-2 bg-indigo-900 text-white font-bold py-3 rounded text-xs tracking-widest uppercase transition-all shadow-md shadow-indigo-900/10"
              >
                <Phone size={14} className="stroke-[3]" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
