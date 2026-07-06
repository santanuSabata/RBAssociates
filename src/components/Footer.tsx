import React from 'react';
import { Mail, MapPin, Phone, MessageSquare, Facebook, Linkedin, Twitter, Instagram, Youtube, HelpCircle } from 'lucide-react';
import { GeneralSettings } from '../types.js';

interface FooterProps {
  settings: GeneralSettings;
  setActivePage: (page: string) => void;
}

export default function Footer({ settings, setActivePage }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleFooterLinkClick = (pageId: string) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { url: settings.facebookUrl, icon: <Facebook size={18} />, label: 'Facebook' },
    { url: settings.instagramUrl, icon: <Instagram size={18} />, label: 'Instagram' },
    { url: settings.linkedInUrl, icon: <Linkedin size={18} />, label: 'LinkedIn' },
    { url: settings.twitterUrl, icon: <Twitter size={18} />, label: 'Twitter/X' },
    { url: settings.youtubeUrl, icon: <Youtube size={18} />, label: 'YouTube' },
  ].filter(link => link.url && link.url.trim() !== '');

  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200" id="app-footer">
      {/* Top Banner Accent */}
      <div className="h-1 w-full bg-orange-600" />
      
      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleFooterLinkClick('home')}>
            {settings.websiteLogo ? (
              <img 
                src={settings.websiteLogo} 
                alt={settings.websiteName || "Logo"} 
                className="h-15 w-auto max-w-[150px] object-contain" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-15 w-15 rounded bg-orange-600 flex items-center justify-center font-bold font-display text-white text-lg">
                RB
              </div>
            )}
             
          </div>
          <p className="text-sm text-slate-500 leading-relaxed font-sans">
            {settings.footerDescription || settings.shortDescription}
          </p>
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-orange-600 hover:border-orange-600/30 hover:bg-orange-50 transition-all duration-200 shadow-sm"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-slate-900 text-xs font-bold tracking-widest uppercase mb-6 font-display border-l-2 border-orange-600 pl-3">
            Quick Navigation
          </h3>
          <ul className="space-y-3 text-sm font-medium">
            {[
              { id: 'home', label: 'Home Page' },
              { id: 'about', label: 'Company Profile' },
              { id: 'services', label: 'CA Services & Benefits' },
              { id: 'gallery', label: 'Photo Gallery' },
              { id: 'contact', label: 'Contact & Location' },
              { id: 'admin', label: 'Admin Login Area' },
            ].map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => handleFooterLinkClick(link.id)}
                  className="text-slate-500 hover:text-orange-600 hover:translate-x-1 transition-all duration-200 text-left cursor-pointer"
                >
                  &rarr; {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Core Financial Services */}
        <div>
          <h3 className="text-slate-900 text-xs font-bold tracking-widest uppercase mb-6 font-display border-l-2 border-orange-600 pl-3">
            Core Expertises
          </h3>
          <ul className="space-y-3 text-sm text-slate-500 font-medium">
            <li>
              <button onClick={() => handleFooterLinkClick('services')} className="hover:text-orange-600 transition-colors text-left">
                &bull; Income Tax Consultancy
              </button>
            </li>
            <li>
              <button onClick={() => handleFooterLinkClick('services')} className="hover:text-orange-600 transition-colors text-left">
                &bull; GST Registrations
              </button>
            </li>
            <li>
              <button onClick={() => handleFooterLinkClick('services')} className="hover:text-orange-600 transition-colors text-left">
                &bull; Statutory & Tax Auditing
              </button>
            </li>
            <li>
              <button onClick={() => handleFooterLinkClick('services')} className="hover:text-orange-600 transition-colors text-left">
                &bull; Corporate Bookkeeping
              </button>
            </li>
            <li>
              <button onClick={() => handleFooterLinkClick('services')} className="hover:text-orange-600 transition-colors text-left">
                &bull; Company & LLP Reg.
              </button>
            </li>
            <li>
              <button onClick={() => handleFooterLinkClick('services')} className="hover:text-orange-600 transition-colors text-left">
                &bull; MCA / ROC Secretarial
              </button>
            </li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-slate-900 text-xs font-bold tracking-widest uppercase mb-6 font-display border-l-2 border-orange-600 pl-3">
            Useful Links
          </h3>
          <ul className="space-y-3 text-sm text-slate-500 font-medium">
            {[
              { label: 'Income Tax Dept.', url: 'https://www.incometax.gov.in/' },
              { label: 'GST', url: 'https://www.gst.gov.in/' },
              { label: 'Min. of Corporate Affairs', url: 'https://www.mca.gov.in/' },
              { label: 'Employees Provident Fund', url: 'https://www.epfindia.gov.in/' },
              { label: 'CBIC', url: 'https://www.cbic.gov.in/' },
            ].map((link, idx) => (
              <li key={idx}>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-orange-600 transition-colors text-left flex items-start"
                >
                  <span className="mr-2">&bull;</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Dynamic Contact Details */}
        <div>
          <h3 className="text-slate-900 text-xs font-bold tracking-widest uppercase mb-6 font-display border-l-2 border-orange-600 pl-3">
            Office Headquarters
          </h3>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin size={18} className="text-orange-600 shrink-0 mt-0.5" />
              <span className="text-slate-500 leading-relaxed font-sans text-xs font-medium">
                {settings.officeAddress}
              </span>
            </li>
            <li className="flex gap-3 items-center">
              <Phone size={16} className="text-orange-600 shrink-0" />
              <div className="flex flex-col text-xs font-mono text-slate-600 font-semibold">
                <a href={`tel:${settings.primaryMobile}`} className="hover:text-orange-600 transition-colors">
                  {settings.primaryMobile}
                </a>
                {settings.secondaryMobile && (
                  <a href={`tel:${settings.secondaryMobile}`} className="hover:text-orange-600 transition-colors">
                    {settings.secondaryMobile}
                  </a>
                )}
              </div>
            </li>
            <li className="flex gap-3 items-center">
              <Mail size={16} className="text-orange-600 shrink-0" />
              <div className="flex flex-col text-xs font-mono text-slate-600 font-semibold">
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-orange-600 transition-colors">
                  {settings.contactEmail}
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Copyright */}
      <div className="bg-slate-100 py-6 px-4 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-sans font-medium">
          <span>
            {settings.copyrightText || `© ${currentYear} RB Associates. All rights reserved.`}
          </span>
          <div className="flex items-center gap-6">
            <button onClick={() => handleFooterLinkClick('about')} className="hover:text-orange-600 transition-colors">Terms of Service</button>
            <button onClick={() => handleFooterLinkClick('about')} className="hover:text-orange-600 transition-colors">Privacy Policy</button>
            <span className="text-orange-600/60 font-semibold">Designed for Premium Corporate Credibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
} 