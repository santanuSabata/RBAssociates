import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Award, Users, CheckCircle2, ArrowRight, Star, 
  ChevronLeft, ChevronRight, Calculator, FileText, FileCheck, Building2, TrendingUp,
  ChevronDown, HelpCircle, Linkedin, Twitter, Facebook
} from 'lucide-react';
import { GeneralSettings, CMSValue, ServiceItem, TestimonialItem, TeamMember, JourneyItem, PartnerItem } from '../types.js';

interface HomeProps {
  settings: GeneralSettings;
  cms: CMSValue;
  services: ServiceItem[];
  testimonials: TestimonialItem[];
  team: TeamMember[];
  journey: JourneyItem[];
  partners: PartnerItem[];
  setActivePage: (page: string) => void;
}

export default function Home({ settings, cms, services, testimonials, team, journey, partners, setActivePage }: HomeProps) {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [faqsLoading, setFaqsLoading] = useState<boolean>(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Dynamic fetch of tax & compliance FAQs
  useEffect(() => {
    fetch('/api/cms/faqs')
      .then(res => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then(data => {
        setFaqs(data);
        setFaqsLoading(false);
      })
      .catch(() => {
        // High fidelity fallback seeds
        setFaqs([
          {
            _id: "faq-1",
            question: "What is the standard due date for individual Income Tax filing in India?",
            answer: "For individual taxpayers, salaried employees, and business entities whose accounts do not require an audit, the standard due date for filing Income Tax Returns (ITR) is July 31st of the assessment year. For companies and audited entities, it is usually October 31st.",
            category: "Taxation"
          },
          {
            _id: "faq-2",
            question: "Who is required to obtain GST registration?",
            answer: "GST registration is mandatory for businesses supplying goods with an annual aggregate turnover exceeding ₹40 Lakhs (₹20 Lakhs for special category states) and for service providers exceeding ₹20 Lakhs (₹10 Lakhs for special category states). Casual taxable persons and e-commerce operators must register regardless of turnover.",
            category: "GST Compliance"
          },
          {
            _id: "faq-3",
            question: "What are the key corporate ROC compliance requirements after incorporation?",
            answer: "Post-incorporation compliance includes appointing a statutory auditor within 30 days, holding the first board meeting within 30 days, filing Form INC-20A (Commencement of Business) within 180 days, and conducting annual general meetings (AGM) along with filing AOC-4 (financial statements) and MGT-7 (annual return).",
            category: "Corporate ROC"
          },
          {
            _id: "faq-4",
            question: "Can I claim Input Tax Credit (ITC) on all business purchases?",
            answer: "You can claim ITC on most goods and services used in the course or furtherance of business. However, Section 17(5) of the CGST Act blocks ITC on specific items, such as motor vehicles (with exceptions), food and beverages, club memberships, personal consumption, and goods lost or destroyed.",
            category: "GST Compliance"
          },
          {
            _id: "faq-5",
            question: "What is advance tax, and who needs to pay it?",
            answer: "Advance tax is tax paid in advance during the financial year instead of a lump sum at the year-end. It is mandatory for any taxpayer (salaried, self-employed, or corporate) whose estimated total tax liability for the year, after deducting TDS/TCS, is ₹10,000 or more.",
            category: "Taxation"
          }
        ]);
        setFaqsLoading(false);
      });
  }, []);

  // Auto-cycle testimonials every 6 seconds
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const handleNextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const featuredServices = services.slice(0, 6);

  // Map icon strings to Lucide elements
  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'FileText': return <FileText size={24} className="text-indigo-900" />;
      case 'FileCheck': return <FileCheck size={24} className="text-indigo-900" />;
      case 'Calculator': return <Calculator size={24} className="text-indigo-900" />;
      case 'Building2': return <Building2 size={24} className="text-indigo-900" />;
      case 'TrendingUp': return <TrendingUp size={24} className="text-indigo-900" />;
      default: return <FileText size={24} className="text-indigo-900" />;
    }
  };

  return (
    <div className="w-full relative bg-slate-50 text-slate-800" id="home-page">
      {/* SECTION 1: HERO SECTION (Geometric balanced style) */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-50 border-b border-slate-200">
        {/* Soft geometric glowing elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-900/5 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-slate-300/10 rounded-full filter blur-[120px] pointer-events-none" />
        
        {/* Precise Mathematical Grid Pattern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          
          {/* Left Text/Messaging Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded bg-indigo-50 border border-indigo-100 text-xs font-mono font-bold text-indigo-900 uppercase tracking-widest"
            >
              <Award size={14} className="text-indigo-900 animate-pulse" />
              <span>Premium Chartered Accountant Firm</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-[1.1] text-slate-900"
            >
              {cms.heroTitle || settings.websiteTagline}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-slate-600 text-base sm:text-lg max-w-2xl font-sans font-light leading-relaxed"
            >
              {cms.heroSubtitle || settings.shortDescription}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <button
                onClick={() => setActivePage('contact')}
                className="px-8 py-3.5 rounded bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md shadow-orange-900/20 hover:shadow-orange-900/30 active:scale-95 cursor-pointer"
              >
                {cms.heroCtaText || "Get Free Consultation"}
              </button>
              <button
                onClick={() => setActivePage('services')}
                className="px-8 py-3.5 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-widest transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                Explore Services
              </button>
            </motion.div>

            {/* Quick trust flags */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 border-t border-slate-200 text-slate-500 text-xs font-mono font-semibold"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-indigo-900" />
                <span>100% Tax Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-indigo-900" />
                <span>Secure Digital Desk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-indigo-900" />
                <span>Raipur Headquartered</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Beautiful Mathematically Balanced Isometric Grid */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-8 lg:pt-0">
            <div className="relative w-full max-w-[420px] aspect-square">
              
              {/* Outer soft glowing backdrop */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/10 to-slate-200/40 rounded-full blur-[40px] animate-pulse" />

              {/* Base Isometric main slate card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotateX: 10, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
                transition={{ duration: 1 }}
                className="w-full h-full rounded-lg bg-white p-6 border border-slate-200 shadow-xl flex flex-col justify-between"
              >
                {/* Growth graphics */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] text-indigo-900 uppercase font-mono font-bold tracking-widest">RB ASSOCIATES</span>
                    <h3 className="text-base font-bold font-display text-slate-900 mt-0.5">Corporate Financial Growth</h3>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                </div>

                <div className="my-6 space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>GST File Security</span>
                      <span className="font-mono text-indigo-900 font-bold">99.8%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-[99.8%] bg-indigo-900" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Tax Audit Compliance</span>
                      <span className="font-mono text-indigo-900 font-bold">100%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-indigo-900" />
                    </div>
                  </div>
                </div>

                {/* Grid layout indicators */}
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-left">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono font-semibold block">PARTNERS</span>
                    <span className="text-lg font-bold font-display text-slate-900">4 Certified</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono font-semibold block">EXPERIENCE</span>
                    <span className="text-lg font-bold font-display text-slate-900">15+ Years</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Element 1: Total Corporate Clients */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 px-4 py-3 rounded bg-white border border-slate-200 shadow-lg flex items-center gap-3"
              >
                <div className="h-9 w-9 rounded bg-indigo-50 flex items-center justify-center text-indigo-900">
                  <Users size={18} />
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-mono font-semibold block uppercase">Clients</span>
                  <span className="text-xs font-bold text-slate-900">500+ Active</span>
                </div>
              </motion.div>

              {/* Floating Element 2: Asset Optimization */}
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-6 px-4 py-3 rounded bg-white border border-slate-200 shadow-lg flex items-center gap-3"
              >
                <div className="h-9 w-9 rounded bg-indigo-50 flex items-center justify-center text-indigo-900">
                  <TrendingUp size={18} />
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-mono font-semibold block uppercase">Optimization</span>
                  <span className="text-xs font-bold text-slate-900">100% Secure</span>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 1.5: TRUSTED PARTNERS MARQUEE */}
      {partners && partners.length > 0 && (
        <section className="bg-slate-50 border-y border-slate-200/80 py-10 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-[10px] font-mono tracking-widest uppercase font-extrabold text-indigo-600 block mb-6">
                Corporate Trusts & Business Affiliations
              </span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 opacity-75 hover:opacity-100 transition-opacity duration-300">
              {partners.map((partner, index) => {
                const content = (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="h-10 sm:h-12 w-28 sm:w-36 flex items-center justify-center transition-all cursor-pointer grayscale hover:grayscale-0 filter"
                    title={partner.name}
                  >
                    <img 
                      src={partner.logoUrl} 
                      alt={partner.name} 
                      className="h-full w-full object-contain max-h-12"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                );

                if (partner.websiteUrl) {
                  return (
                    <a 
                      key={partner._id || index}
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus:outline-none"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <div key={partner._id || index}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: ABOUT PREVIEW SECTION */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual bento summary */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-slate-50 p-6 rounded border border-slate-200/80 text-left hover:border-indigo-900/30 transition-colors">
                <span className="text-4xl font-extrabold font-display text-indigo-900 block">15+</span>
                <span className="text-xs text-slate-500 font-bold font-sans uppercase tracking-wider block mt-1">Years Corporate Trust</span>
              </div>
              <div className="bg-slate-50 p-6 rounded border border-slate-200/80 text-left hover:border-indigo-900/30 transition-colors">
                <span className="text-4xl font-extrabold font-display text-indigo-900 block">100%</span>
                <span className="text-xs text-slate-500 font-bold font-sans uppercase tracking-wider block mt-1">Compliance Track</span>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="bg-slate-50 p-6 rounded border border-slate-200/80 text-left hover:border-indigo-900/30 transition-colors">
                <span className="text-4xl font-extrabold font-display text-indigo-900 block">4.9/5</span>
                <span className="text-xs text-slate-500 font-bold font-sans uppercase tracking-wider block mt-1">Client Satisfaction</span>
              </div>
              <div className="bg-slate-50 p-6 rounded border border-slate-200/80 text-left hover:border-indigo-900/30 transition-colors">
                <span className="text-4xl font-extrabold font-display text-indigo-900 block">4</span>
                <span className="text-xs text-slate-500 font-bold font-sans uppercase tracking-wider block mt-1">Expert CA Partners</span>
              </div>
            </div>
          </div>

          {/* Right Text Description */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-900 bg-indigo-50 px-3 py-1 rounded">Corporate Backgrounder</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
              {cms.aboutTitle || "Expert Financial Solutions Backed by Integrity"}
            </h2>
            <p className="text-slate-600 leading-relaxed font-sans font-light text-base">
              {cms.aboutDescription ? cms.aboutDescription.substring(0, 320) + "..." : "RB Associates is a premium Chartered Accountant firm based in Raipur, Chhattisgarh. Over the years, we have built a flawless reputation for providing strategic taxation, GST consulting, and robust bookkeeping services to clients ranging from dynamic startup promoters to massive engineering enterprises."}
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded bg-indigo-50 flex items-center justify-center text-indigo-900 shrink-0 mt-0.5">
                  <CheckCircle2 size={12} className="stroke-[3]" />
                </div>
                <p className="text-slate-600 text-sm font-sans font-medium">Registered ROC & MCA corporate filing agents.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded bg-indigo-50 flex items-center justify-center text-indigo-900 shrink-0 mt-0.5">
                  <CheckCircle2 size={12} className="stroke-[3]" />
                </div>
                <p className="text-slate-600 text-sm font-sans font-medium">Strategic tax optimization structured individually per industry.</p>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={() => setActivePage('about')}
                className="inline-flex items-center gap-2 text-indigo-900 font-bold text-sm hover:text-indigo-800 transition-colors group cursor-pointer"
              >
                <span>Read Our Full Company Profile</span>
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform text-indigo-900" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: SERVICES OVERVIEW SECTION */}
      <section className="bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-900 bg-indigo-100 px-3 py-1 rounded">Service Offerings</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">Specialized Financial Services</h2>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xl mx-auto font-medium">
              We provide dynamic, compliance-backed accounting and tax structures focused on strategic safety and cost efficiency.
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {featuredServices.map((service) => (
              <motion.div
                key={service._id}
                whileHover={{ y: -6 }}
                className="p-8 rounded bg-white border border-slate-200 hover:border-indigo-900 transition-all group flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="h-12 w-12 rounded bg-indigo-50 flex items-center justify-center mb-6 group-hover:bg-indigo-900 transition-colors">
                    <span className="group-hover:text-white transition-colors">
                      {getServiceIcon(service.iconName)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-display text-slate-900 mb-3 group-hover:text-indigo-900 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-sans font-light line-clamp-3">
                    {service.description}
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center">
                  <span className="text-xs text-indigo-900 font-mono font-bold uppercase tracking-wider">Professional Filing</span>
                  <button
                    onClick={() => setActivePage('services')}
                    className="text-xs text-slate-500 group-hover:text-indigo-900 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View Benefits</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => setActivePage('services')}
              className="px-8 py-3.5 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm"
            >
              See All 8 Core Services
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 4: WHY CHOOSE US MATRIX */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-900 bg-indigo-50 px-3 py-1 rounded">Why Trust Us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
              {cms.whyChooseTitle || "Why Leading Businesses Trust RB Associates"}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xl mx-auto font-medium">
              {cms.whyChooseSubtitle || "We blend certified financial expertise with transparent compliance frameworks to scale corporate growth safely."}
            </p>
          </div>

          {/* Features Bento layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            
            <div className="p-6 rounded bg-slate-50 border border-slate-200 space-y-4 hover:border-indigo-900/30 transition-all">
              <div className="h-10 w-10 rounded bg-indigo-50 flex items-center justify-center text-indigo-900">
                <Award size={20} />
              </div>
              <h3 className="text-base font-bold font-display text-slate-900">Experienced Partners</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-sans font-light">
                Led by CA Rahul Bajaj with 15+ years experience handling complex tax audits, statutory corporate files, and strategic restructures.
              </p>
            </div>

            <div className="p-6 rounded bg-slate-50 border border-slate-200 space-y-4 hover:border-indigo-900/30 transition-all">
              <div className="h-10 w-10 rounded bg-indigo-50 flex items-center justify-center text-indigo-900">
                <Shield size={20} />
              </div>
              <h3 className="text-base font-bold font-display text-slate-900">Flawless Compliance</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-sans font-light">
                Zero penalty, zero friction policy. We track your GST calendars, ROC compliance dates, and advance tax dates so you sleep peacefully.
              </p>
            </div>

            <div className="p-6 rounded bg-slate-50 border border-slate-200 space-y-4 hover:border-indigo-900/30 transition-all">
              <div className="h-10 w-10 rounded bg-indigo-50 flex items-center justify-center text-indigo-900">
                <Users size={20} />
              </div>
              <h3 className="text-base font-bold font-display text-slate-900">Client-Centric Ethos</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-sans font-light">
                We assign a dedicated account executive to coordinate your bookkeeping, resolve GST mismatch issues, and expedite PAN/TAN registrations.
              </p>
            </div>

            <div className="p-6 rounded bg-slate-50 border border-slate-200 space-y-4 hover:border-indigo-900/30 transition-all">
              <div className="h-10 w-10 rounded bg-indigo-50 flex items-center justify-center text-indigo-900">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-base font-bold font-display text-slate-900">Growth-Driven Advice</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-sans font-light">
                We do not just file papers. We analyze your cash flow, balance sheets, and project ratios to recommend strategic scaling frameworks.
              </p>
            </div>

          </div>

        </div>
      </section>
 

      {/* SECTION 4.8: OUR JOURNEY */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200 relative overflow-hidden" id="journey-section">
        {/* Ambient background decoration */}
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-indigo-50/40 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto space-y-16 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-900 bg-indigo-100/60 border border-indigo-200/50 px-3 py-1 rounded">
              Our Legacy
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
              Our Journey
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto font-sans font-light leading-relaxed">
              Decades of precision compliance, ethical consulting, and financial growth leadership in central India.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Main Center Line (Desktop Only) */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-slate-200" />
            
            {/* Mobile Left Line */}
            <div className="block md:hidden absolute left-6 h-full w-0.5 bg-slate-200" />

            <div className="space-y-12 relative">
              {(journey && journey.length > 0 ? journey : [
                {
                  _id: "j1",
                  year: "2012",
                  title: "The Inception",
                  description: "Founded by CA Rahul Bajaj in Raipur with a small desk and a single goal: to make compliance effortless for local MSMEs.",
                  iconName: "Building2"
                },
                {
                  _id: "j2",
                  year: "2016",
                  title: "Digital Integration",
                  description: "Transitioned to cloud-based accounting systems, introducing remote bookkeeping and fast GST filing to 200+ active corporate clients.",
                  iconName: "TrendingUp"
                },
                {
                  _id: "j3",
                  year: "2020",
                  title: "The Resilience Chapter",
                  description: "Navigated complex post-pandemic corporate restructures, protecting clients from financial exposure through deep regulatory audit mastery.",
                  iconName: "Shield"
                },
                {
                  _id: "j4",
                  year: "2024",
                  title: "Chartered Partners Scaling",
                  description: "Expanded our team with specialist senior partners to establish an end-to-end tax advisory, audit leadership, and corporate compliance practice.",
                  iconName: "Award"
                }
              ]).map((milestone, idx) => {
                const isEven = idx % 2 === 0;
                
                const renderIcon = (name?: string) => {
                  switch (name) {
                    case 'Building2': return <Building2 className="w-5 h-5 text-indigo-900" />;
                    case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-indigo-900" />;
                    case 'Shield': return <Shield className="w-5 h-5 text-indigo-900" />;
                    case 'Award': return <Award className="w-5 h-5 text-indigo-900" />;
                    default: return <Award className="w-5 h-5 text-indigo-900" />;
                  }
                };

                return (
                  <div key={milestone._id} className="flex flex-col md:flex-row items-stretch gap-6 md:gap-0 relative group">
                    {/* Event Year node on center (Desktop) */}
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 -translate-y-1 z-20 items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-white border-2 border-indigo-900 shadow-md group-hover:bg-indigo-900 transition-all duration-300 flex items-center justify-center">
                        <span className="text-[10px] font-mono font-bold text-indigo-900 group-hover:text-white transition-colors">
                          {milestone.year}
                        </span>
                      </div>
                    </div>

                    {/* Mobile Year Node / Circle */}
                    <div className="flex md:hidden absolute left-6 transform -translate-x-1/2 z-20 items-center justify-center">
                      <div className="h-10 w-10 rounded-full bg-white border-2 border-indigo-900 shadow-md flex items-center justify-center">
                        <span className="text-[9px] font-mono font-bold text-indigo-900">
                          {milestone.year}
                        </span>
                      </div>
                    </div>

                    {/* Left Panel (Content on Even, Spacer on Odd) */}
                    <div className={`w-full md:w-1/2 pl-12 md:pl-0 md:pr-12 text-left md:text-right ${isEven ? 'md:block' : 'md:opacity-0 md:pointer-events-none'}`}>
                      {isEven && (
                        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-900/30 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 space-y-3">
                          <div className="flex items-center gap-3 justify-start md:justify-end">
                            <span className="inline-flex md:hidden h-8 w-8 rounded-full bg-indigo-50 items-center justify-center border border-indigo-100">
                              {renderIcon(milestone.iconName)}
                            </span>
                            <span className="hidden md:inline-flex h-8 w-8 rounded-full bg-indigo-50 items-center justify-center border border-indigo-100">
                              {renderIcon(milestone.iconName)}
                            </span>
                            <h3 className="text-base font-bold font-display text-slate-900 group-hover:text-indigo-900 transition-colors">
                              {milestone.title}
                            </h3>
                          </div>
                          <p className="text-slate-500 text-xs leading-relaxed font-sans font-light">
                            {milestone.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Desktop spacer for Year center alignment */}
                    <div className="hidden md:block w-px" />

                    {/* Right Panel (Spacer on Even, Content on Odd) */}
                    <div className={`w-full md:w-1/2 pl-12 md:pl-12 text-left ${!isEven ? 'md:block' : 'md:hidden md:opacity-0 md:pointer-events-none'}`}>
                      {!isEven && (
                        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-900/30 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 space-y-3">
                          <div className="flex items-center gap-3 justify-start">
                            <span className="h-8 w-8 rounded-full bg-indigo-50 items-center justify-center border border-indigo-100">
                              {renderIcon(milestone.iconName)}
                            </span>
                            <h3 className="text-base font-bold font-display text-slate-900 group-hover:text-indigo-900 transition-colors">
                              {milestone.title}
                            </h3>
                          </div>
                          <p className="text-slate-500 text-xs leading-relaxed font-sans font-light">
                            {milestone.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden relative border-b border-slate-200">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-900/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto space-y-12 text-center relative z-10">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-900 bg-indigo-100 px-3 py-1 rounded">Client Reviews</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">Backed by Excellent Feedback</h2>
            </div>

            {/* Slider Content */}
            <div className="relative min-h-[220px] flex items-center justify-center px-8 md:px-16 bg-white border border-slate-200 p-8 rounded shadow-sm">
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-1 text-indigo-900">
                  {[...Array(testimonials[currentTestimonialIndex].rating || 5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" className="stroke-none" />
                  ))}
                </div>
                
                <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-sans font-light italic">
                  "{testimonials[currentTestimonialIndex].review}"
                </p>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <img
                    src={testimonials[currentTestimonialIndex].imageUrl}
                    alt={testimonials[currentTestimonialIndex].clientName}
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-full border border-indigo-100 object-cover"
                  />
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-slate-900 font-display">
                      {testimonials[currentTestimonialIndex].clientName}
                    </h4>
                    <span className="text-xs text-indigo-900 font-semibold font-mono block -mt-0.5">
                      {testimonials[currentTestimonialIndex].companyName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handlePrevTestimonial}
                className="h-10 w-10 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-900 hover:border-indigo-900 transition-colors cursor-pointer shadow-sm"
                aria-label="Previous review"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-xs font-mono text-slate-500 font-semibold">
                {currentTestimonialIndex + 1} / {testimonials.length}
              </span>
              <button
                onClick={handleNextTestimonial}
                className="h-10 w-10 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-900 hover:border-indigo-900 transition-colors cursor-pointer shadow-sm"
                aria-label="Next review"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5.5: FAQ ACCORDION SECTION */}
      <section className="bg-slate-50 py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200 relative overflow-hidden" id="faq-section">
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-indigo-50 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-indigo-50 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-900 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded shadow-sm">
              Knowledge Desk
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
              Tax & Compliance Intel
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto font-sans font-light">
              Expert answers to critical regulatory, direct taxation, GST, and ROC questions curated by our senior partners.
            </p>
          </div>

          {faqsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="h-6 w-6 border-2 border-indigo-900 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono text-slate-400 font-bold uppercase">Loading FAQ Stream...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div 
                    key={faq._id || index}
                    className="border border-slate-200 rounded bg-white overflow-hidden shadow-sm transition-all duration-300 hover:border-indigo-900/30"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left transition-colors cursor-pointer select-none"
                    >
                      <div className="flex items-start gap-3">
                        <HelpCircle size={16} className="text-indigo-900 shrink-0 mt-1" />
                        <span className="text-sm sm:text-base font-bold text-slate-900 font-display">
                          {faq.question}
                        </span>
                      </div>
                      <span className={`p-1 rounded bg-slate-50 border border-slate-200 text-indigo-900 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown size={16} className="stroke-[2.5]" />
                      </span>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 pt-1 border-t border-slate-100 text-slate-600 text-xs sm:text-sm font-sans font-light leading-relaxed">
                            <p>{faq.answer}</p>
                            {faq.category && (
                              <div className="mt-4 flex items-center gap-1.5">
                                <span className="text-[10px] font-mono font-bold text-indigo-900 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase">
                                  {faq.category}
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 6: CONTACT CALL TO ACTION BANNER (Geometric Conversion block) */}
      <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto rounded bg-indigo-950 p-8 md:p-12 border border-indigo-900 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 text-left shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4 max-w-2xl relative z-10">
            <span className="text-xs font-mono text-indigo-300 uppercase tracking-widest font-bold block">Schedule Your Visit</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">Need Strategic Tax or Audit Consulting?</h2>
            <p className="text-slate-300 text-sm leading-relaxed font-sans font-light">
              Visit our corporate office at VIP Road, Raipur, or speak to our certified chartered accountants now. Let's design a compliant, risk-free financial model for your enterprise.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto relative z-10">
            <button
              onClick={() => setActivePage('contact')}
              className="w-full sm:w-auto px-8 py-3.5 rounded bg-white hover:bg-orange-50 text-orange-600 font-bold text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer"
            >
              Contact Us Now
            </button>
            <a
              href={`https://wa.me/${settings.whatsAppNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center px-8 py-3.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
