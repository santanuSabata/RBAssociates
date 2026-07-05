import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, FileCheck, Calculator, Shield, Building2, Briefcase, TrendingUp, 
  Compass, CheckCircle2, Phone, X, ArrowRight, HelpCircle, AlertCircle
} from 'lucide-react';
import { GeneralSettings, ServiceItem } from '../types.js';

interface ServicesProps {
  settings: GeneralSettings;
  services: ServiceItem[];
  setActivePage: (page: string) => void;
}

export default function Services({ settings, services, setActivePage }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const getServiceIcon = (name: string, size = 24) => {
    switch (name) {
      case 'FileText': return <FileText size={size} className="text-indigo-900" />;
      case 'FileCheck': return <FileCheck size={size} className="text-indigo-900" />;
      case 'Calculator': return <Calculator size={size} className="text-indigo-900" />;
      case 'ShieldAlert': return <Shield size={size} className="text-indigo-900" />;
      case 'Building2': return <Building2 size={size} className="text-indigo-900" />;
      case 'Briefcase': return <Briefcase size={size} className="text-indigo-900" />;
      case 'TrendingUp': return <TrendingUp size={size} className="text-indigo-900" />;
      case 'Compass': return <Compass size={size} className="text-indigo-900" />;
      default: return <FileText size={size} className="text-indigo-900" />;
    }
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 pb-24" id="services-page">
      {/* Page Header */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white border-b border-slate-200 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-indigo-900/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-900 bg-indigo-50 px-3 py-1 rounded">Corporate Offerings</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-slate-900">Our Professional Services</h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto font-sans font-medium">
            Providing structured, fully compliant bookkeeping, audit representations, tax structuring, and business setup frameworks.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {services.map((service) => (
            <div
              key={service._id}
              onClick={() => setSelectedService(service)}
              className="group p-8 rounded bg-white border border-slate-200 hover:border-indigo-900 transition-all flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-md"
            >
              <div>
                <div className="h-12 w-12 rounded bg-indigo-50 flex items-center justify-center mb-6 group-hover:bg-indigo-900 transition-colors">
                  <span className="group-hover:text-white transition-colors">
                    {getServiceIcon(service.iconName, 22)}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display text-slate-900 mb-3 group-hover:text-indigo-900 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed font-sans font-light line-clamp-3">
                  {service.description}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">Expert Advisory</span>
                <span className="text-xs font-bold font-display text-indigo-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Benefits</span>
                  <ArrowRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service Details Overlay Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 w-full max-w-2xl rounded overflow-hidden shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors z-20 cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>

              {/* Cover Image Frame */}
              {selectedService.imageUrl && (
                <div className="h-48 w-full bg-slate-100 relative">
                  <img
                    src={selectedService.imageUrl}
                    alt={selectedService.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  
                  {/* Floating Title Inside Frame */}
                  <div className="absolute bottom-6 left-6 flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-white flex items-center justify-center text-indigo-900 border border-slate-200 shadow-sm">
                      {getServiceIcon(selectedService.iconName, 20)}
                    </div>
                    <h2 className="text-xl font-bold font-display text-slate-900">
                      {selectedService.title}
                    </h2>
                  </div>
                </div>
              )}

              {/* Details Body */}
              <div className="p-6 md:p-8 space-y-6 text-left">
                {/* Descriptive section if image wasn't loaded */}
                {!selectedService.imageUrl && (
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="h-10 w-10 rounded bg-indigo-50 flex items-center justify-center text-indigo-900">
                      {getServiceIcon(selectedService.iconName, 20)}
                    </div>
                    <h2 className="text-xl font-bold font-display text-slate-900">
                      {selectedService.title}
                    </h2>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono font-bold tracking-wider text-indigo-900 uppercase">Service Description</h4>
                  <p className="text-slate-600 text-sm leading-relaxed font-sans font-light">
                    {selectedService.description}
                  </p>
                </div>

                {/* Benefits List */}
                {selectedService.benefits && selectedService.benefits.length > 0 && (
                  <div className="space-y-3.5">
                    <h4 className="text-[10px] font-mono font-bold tracking-wider text-indigo-900 uppercase">Core Business Benefits</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedService.benefits.map((benefit, i) => (
                        <div key={i} className="flex gap-2.5 items-start">
                          <CheckCircle2 size={16} className="text-indigo-900 shrink-0 mt-0.5" />
                          <span className="text-slate-600 text-xs font-sans font-medium leading-snug">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-mono font-semibold">
                    <AlertCircle size={14} className="text-indigo-900" />
                    <span>Raipur Head Office Representation</span>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setSelectedService(null);
                        setActivePage('contact');
                      }}
                      className="flex-1 sm:flex-none px-5 py-2.5 rounded bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md"
                    >
                      Consult This Service
                    </button>
                    <a
                      href={`tel:${settings.primaryMobile}`}
                      className="flex-1 sm:flex-none px-5 py-2.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs text-center uppercase tracking-widest transition-all"
                    >
                      Call Advisor
                    </a>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
