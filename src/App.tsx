import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MessageSquare, Mail, AlertCircle, Loader } from 'lucide-react';
import Navbar from './components/Navbar.js';
import Breadcrumbs from './components/Breadcrumbs.js';
import Footer from './components/Footer.js';
import Home from './pages/Home.js';
import About from './pages/About.js';
import Services from './pages/Services.js';
import Gallery from './pages/Gallery.js';
import Contact from './pages/Contact.js';
import AdminDashboard from './pages/AdminDashboard.js';
import { apiService } from './services/api.js';
import { 
  GeneralSettings, CMSValue, ServiceItem, GalleryItem, 
  TeamMember, TestimonialItem, JourneyItem, PartnerItem
} from './types.js';

// SECURE FALLBACK DEFAULT SEEDS TO ASSURE 100% PREVIEW ROBUSTNESS DURING INGRESS COLD STARTS
const DEFAULT_SETTINGS: GeneralSettings = {
  websiteName: "RB Associates",
  websiteLogo: "",
  websiteFavicon: "",
  websiteTagline: "Your Trusted Partner for Tax, Compliance & Financial Growth",
  shortDescription: "Leading Chartered Accountant Firm in Raipur, Chhattisgarh offering premium services in GST, Income Tax, Corporate Audit, and Business Compliance.",
  primaryMobile: "+91 98765 43210",
  secondaryMobile: "+91 77123 45678",
  contactEmail: "info@rbassociates.com",
  alternateEmail: "support@rbassociates.com",
  whatsAppNumber: "+91 98765 43210",
  officeAddress: "Office No. 402, 4th Floor, Corporate Tower, VIP Road, Raipur, Chhattisgarh - 492001",
  facebookUrl: "https://facebook.com/rbassociates",
  instagramUrl: "https://instagram.com/rbassociates",
  linkedInUrl: "https://linkedin.com/company/rbassociates",
  twitterUrl: "https://twitter.com/rbassociates",
  youtubeUrl: "https://youtube.com/rbassociates",
  footerDescription: "Providing professional auditing, taxation, and business advisory services. Committed to excellence, integrity, and trust.",
  copyrightText: "© 2026 RB Associates. All rights reserved.",
  metaTitle: "RB Associates | Chartered Accountants in Raipur, Chhattisgarh",
  metaDescription: "Professional CA firm in Raipur specializing in Income Tax, GST, Auditing, Company Registration, and financial advisory services.",
  metaKeywords: "CA in Raipur, Chartered Accountant Raipur, GST Registration Raipur, Income Tax Filing Chhattisgarh, Audit Services, Company Compliance"
};

const DEFAULT_CMS: CMSValue = {
  heroTitle: "Your Trusted Partner for Tax, Compliance & Financial Growth",
  heroSubtitle: "Premium Chartered Accountant services in Raipur. Empowering your business with accurate accounting, transparent compliance, and expert wealth planning.",
  heroCtaText: "Get Free Consultation",
  aboutTitle: "Expert Financial Solutions Backed by Integrity",
  aboutDescription: "RB Associates is a premier CA firm based in Raipur, committed to delivering high-quality auditing, taxation, and business consulting services. We bridge the gap between financial complexity and business success. Founded with a vision to catalyze business growth, our team of highly qualified specialists offers deep expertise, ethical standards, and tailored solutions for enterprises of all sizes.",
  whyChooseTitle: "Why Leading Businesses Trust RB Associates",
  whyChooseSubtitle: "We combine decade-long expertise with personal attention to deliver unmatched value and perfect compliance.",
  missionTitle: "Our Mission",
  missionText: "To empower businesses and entrepreneurs by providing high-quality, transparent, and timely financial solutions, compliance leadership, and strategic insights.",
  visionTitle: "Our Vision",
  visionText: "To be the most trusted and premium financial consultancy firm in central India, recognized for our absolute integrity, technological integration, and corporate growth catalysis.",
  valuesTitle: "Our Core Values",
  valuesList: [
    { title: "Absolute Integrity", description: "Uncompromising honesty and ethical compliance in every filing and audit." },
    { title: "Professional Excellence", description: "Providing highly specialized financial expertise customized to each industry sector." },
    { title: "Client Partnership", description: "We treat your business compliance and tax optimization as our own goals." },
    { title: "Technological Agility", description: "Leveraging digital workflows for rapid, transparent bookkeeping and secure report delivery." }
  ]
};

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [loading, setLoading] = useState<boolean>(true);

  // Core Global States
  const [settings, setSettings] = useState<GeneralSettings>(DEFAULT_SETTINGS);
  const [cms, setCms] = useState<CMSValue>(DEFAULT_CMS);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [journey, setJourney] = useState<JourneyItem[]>([]);
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  
  // Auth State
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(false);

  // Scroll Progress State
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Synchronize database records on load
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedSettings, loadedCMS, loadedServices, loadedGallery, loadedTeam, loadedTestimonials, loadedJourney, loadedPartners] = await Promise.all([
          apiService.getSettings().catch(() => DEFAULT_SETTINGS),
          apiService.getCMS().catch(() => DEFAULT_CMS),
          apiService.getServices().catch(() => []),
          apiService.getGallery().catch(() => []),
          apiService.getTeam().catch(() => []),
          apiService.getTestimonials().catch(() => []),
          apiService.getJourney().catch(() => []),
          apiService.getPartners().catch(() => []),
        ]);

        setSettings(loadedSettings);
        setCms(loadedCMS);
        setServices(loadedServices);
        setGallery(loadedGallery);
        setTeam(loadedTeam);
        setTestimonials(loadedTestimonials);
        setJourney(loadedJourney);
        setPartners(loadedPartners);

        // Verify active administrator session token
        const token = localStorage.getItem('rb_admin_token');
        if (token) {
          await apiService.verifySession()
            .then(() => setAdminLoggedIn(true))
            .catch(() => setAdminLoggedIn(false));
        }
      } catch (err) {
        console.warn("Backend seeding is in progress, rendering high-fidelity fallback parameters.", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('rb_admin_token');
    setAdminLoggedIn(false);
    setActivePage('home');
  };

  // Sync SEO Head Tags dynamically
  useEffect(() => {
    if (settings) {
      document.title = settings.metaTitle || `${settings.websiteName} | Chartered Accountants Raipur`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', settings.metaDescription || settings.shortDescription);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = "description";
        newMeta.content = settings.metaDescription || settings.shortDescription;
        document.head.appendChild(newMeta);
      }
    }
  }, [settings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center text-slate-800 space-y-4">
        <Loader className="animate-spin text-indigo-900" size={32} />
        <span className="text-sm font-mono tracking-widest text-slate-500 font-semibold">LOADING RB ASSOCIATES DESK...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-indigo-900 selection:text-white font-sans">
      
      {/* Slim, elegant scroll-progress indicator at the very top of the screen */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-indigo-600 via-indigo-950 to-amber-500 z-[100] transition-all duration-100 ease-out shadow-sm shadow-indigo-600/10 pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
        id="scroll-progress-bar"
      />

      {/* Dynamic Navigation Header */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        settings={settings}
        adminLoggedIn={adminLoggedIn}
        onLogout={handleLogout}
      />

      {/* Breadcrumb Navigation below the Navbar for inner pages */}
      <Breadcrumbs activePage={activePage} setActivePage={setActivePage} />

      {/* Main Pages Canvas with Entering Smooth Transition Effects */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {activePage === 'home' && (
              <Home 
                settings={settings} 
                cms={cms} 
                services={services} 
                testimonials={testimonials} 
                team={team}
                journey={journey}
                partners={partners}
                setActivePage={setActivePage} 
              />
            )}
            {activePage === 'about' && (
              <About 
                settings={settings} 
                cms={cms} 
                team={team} 
              />
            )}
            {activePage === 'services' && (
              <Services 
                settings={settings} 
                services={services} 
                setActivePage={setActivePage} 
              />
            )}
            {activePage === 'gallery' && (
              <Gallery 
                gallery={gallery} 
              />
            )}
            {activePage === 'contact' && (
              <Contact 
                settings={settings} 
              />
            )}
            {activePage === 'admin' && (
              <AdminDashboard 
                settings={settings}
                cms={cms}
                services={services}
                gallery={gallery}
                team={team}
                testimonials={testimonials}
                journey={journey}
                partners={partners}
                onSettingsUpdate={setSettings}
                onCMSUpdate={setCms}
                onServicesUpdate={setServices}
                onGalleryUpdate={setGallery}
                onTeamUpdate={setTeam}
                onTestimonialsUpdate={setTestimonials}
                onJourneyUpdate={setJourney}
                onPartnersUpdate={setPartners}
                setActivePage={setActivePage}
                adminLoggedIn={adminLoggedIn}
                setAdminLoggedIn={setAdminLoggedIn}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Call & WhatsApp Action buttons tray (Relocated to bottom-right with interactive labels) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3.5 items-end">
        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${settings.whatsAppNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/25 transition-all duration-300 hover:scale-105 active:scale-95 group overflow-hidden border border-emerald-500/20"
          title="Chat on WhatsApp"
        >
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out text-xs font-bold tracking-wider uppercase whitespace-nowrap">
            WhatsApp Us
          </span>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.13-1.345a9.921 9.921 0 004.873 1.28h.005c5.507 0 9.99-4.478 9.99-9.985C22 6.478 17.517 2 12.012 2zm4.7 13.92c-.258.724-1.287 1.344-1.802 1.43a3.563 3.563 0 01-1.637-.037c-.378-.112-.876-.282-1.488-.546-2.585-1.12-4.237-3.755-4.366-3.927-.128-.172-1.047-1.385-1.047-2.64 0-1.256.643-1.873.88-2.13.235-.257.515-.322.687-.322h.43c.128 0 .3.021.43.322.15.343.515 1.244.558 1.33.043.085.064.193 0 .322-.064.129-.129.215-.258.365a11.3 11.3 0 00-.28.386c-.15.172-.322.365-.129.687.193.322.86 1.417 1.846 2.296.815.727 1.503.953 1.846 1.094.343.14.537.108.73-.108.194-.215.838-.966.966-1.3.129-.333.258-.28.43-.215.172.064 1.095.515 1.28.6a2.76 2.76 0 01.322.15c.129.086.129.365.043.643z"/>
          </svg>
        </a>

        {/* Quick Phone Call Button */}
        <a
          href={`tel:${settings.primaryMobile}`}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-indigo-900 hover:bg-indigo-800 text-white shadow-xl shadow-indigo-900/25 transition-all duration-300 hover:scale-105 active:scale-95 group overflow-hidden relative border border-indigo-800/40"
          title="Call Official Desk"
        >
          <span className="absolute inset-0 rounded-full border border-indigo-500/30 animate-ping pointer-events-none" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out text-xs font-bold tracking-wider uppercase whitespace-nowrap">
            Call Office
          </span>
          <Phone size={18} className="stroke-[2.5] shrink-0" />
        </a>
      </div>

      {/* Dynamic Global Footer */}
      <Footer settings={settings} setActivePage={setActivePage} />

    </div>
  );
}
