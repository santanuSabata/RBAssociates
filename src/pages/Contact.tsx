import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, AlertCircle
} from 'lucide-react';
import { GeneralSettings } from '../types.js';

interface ContactProps {
  settings: GeneralSettings;
}

export default function Contact({ settings }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Income Tax Filing',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API form reception
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', service: 'Income Tax Filing', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 pb-20" id="contact-page">
      {/* Page Header */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white border-b border-slate-200 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-indigo-900/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-900 bg-indigo-50 px-3 py-1 rounded">Contact Channels</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-slate-900">Contact Us</h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto font-sans font-medium">
            Schedule a certified tax audit or company incorporation consult with our senior partners today.
          </p>
        </div>
      </section>

      {/* Main Body */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          
          {/* Left Column: Official Contact details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono text-indigo-900 uppercase tracking-widest font-bold block">Headquarters Raipur</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">Let's Discuss Your Financial Goals</h2>
              <p className="text-slate-500 text-sm font-sans font-light leading-relaxed">
                Whether you need standard bookkeeping services or high-value representations, our certified advisory desk is ready to assist.
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Address */}
              <div className="flex gap-4 p-5 rounded bg-white border border-slate-200 shadow-sm">
                <div className="h-10 w-10 rounded bg-indigo-50 flex items-center justify-center text-indigo-900 shrink-0">
                  <MapPin size={20} />
                </div>
                <div className="space-y-1 text-left">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Office Address</span>
                  <p className="text-slate-700 text-xs leading-relaxed font-sans font-medium">
                    {settings.officeAddress}
                  </p>
                </div>
              </div>

              {/* Phones */}
              <div className="flex gap-4 p-5 rounded bg-white border border-slate-200 shadow-sm">
                <div className="h-10 w-10 rounded bg-indigo-50 flex items-center justify-center text-indigo-900 shrink-0">
                  <Phone size={20} />
                </div>
                <div className="space-y-1 text-left">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Hotlines & WhatsApp</span>
                  <div className="flex flex-col text-xs font-mono text-slate-600 font-semibold">
                    <a href={`tel:${settings.primaryMobile}`} className="hover:text-indigo-900 transition-colors">
                      {settings.primaryMobile} (Primary Call)
                    </a>
                    {settings.secondaryMobile && (
                      <a href={`tel:${settings.secondaryMobile}`} className="hover:text-indigo-900 transition-colors mt-0.5">
                        {settings.secondaryMobile} (Support Desk)
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Emails */}
              <div className="flex gap-4 p-5 rounded bg-white border border-slate-200 shadow-sm">
                <div className="h-10 w-10 rounded bg-indigo-50 flex items-center justify-center text-indigo-900 shrink-0">
                  <Mail size={20} />
                </div>
                <div className="space-y-1 text-left">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Inbox Connections</span>
                  <div className="flex flex-col text-xs font-mono text-slate-600 font-semibold">
                    <a href={`mailto:${settings.contactEmail}`} className="hover:text-indigo-900 transition-colors">
                      {settings.contactEmail}
                    </a>
                    {settings.alternateEmail && (
                      <a href={`mailto:${settings.alternateEmail}`} className="hover:text-indigo-900 transition-colors mt-0.5">
                        {settings.alternateEmail}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex gap-4 p-5 rounded bg-white border border-slate-200 shadow-sm">
                <div className="h-10 w-10 rounded bg-indigo-50 flex items-center justify-center text-indigo-900 shrink-0">
                  <Clock size={20} />
                </div>
                <div className="space-y-1 text-left">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Office Timings</span>
                  <p className="text-slate-700 text-xs font-sans font-medium">
                    Monday to Saturday: 10:00 AM to 07:00 PM <br />
                    <span className="text-[10px] text-indigo-900 font-mono mt-0.5 block font-bold">Sunday: Closed for public appointments</span>
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Contact form panel */}
          <div className="lg:col-span-7 bg-white p-8 rounded border border-slate-200 relative overflow-hidden shadow-sm">
            
            <h3 className="text-xl font-bold font-display text-slate-900 mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-indigo-900" />
              <span>Request Free Corporate Consultation</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-mono font-bold text-slate-500 block">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-900 focus:bg-white transition-colors font-medium"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-mono font-bold text-slate-500 block">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-900 focus:bg-white transition-colors font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs font-mono font-bold text-slate-500 block">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-900 focus:bg-white transition-colors font-medium"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="service" className="text-xs font-mono font-bold text-slate-500 block">Subject of Inquiry *</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-900 focus:bg-white transition-colors font-semibold"
                  >
                    <option>Income Tax Filing</option>
                    <option>GST Registration & Filing</option>
                    <option>Accounting Services</option>
                    <option>Audit Services</option>
                    <option>Company Registration</option>
                    <option>Compliance Management</option>
                    <option>Financial Planning</option>
                    <option>Business Advisory</option>
                    <option>Other Services</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-mono font-bold text-slate-500 block">Your Message / Query *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your tax, bookkeeping, or business incorporation requirements in detail..."
                  className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-900 focus:bg-white transition-colors resize-none font-medium"
                />
              </div>

              {success && (
                <div className="p-4 rounded bg-emerald-50 border border-emerald-100 flex gap-3 text-emerald-800">
                  <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-600" />
                  <div className="text-xs text-left leading-normal font-sans">
                    <strong>Message Sent Successfully!</strong> Our senior partners will review your financial query and get back to you within 2 business hours.
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-900/10 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Send size={14} className="stroke-[2.5]" />
                    <span>Send Inquiry Message</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5 justify-center text-[10px] text-slate-400 font-mono mt-2 font-semibold">
                <AlertCircle size={12} className="text-indigo-900" />
                <span>Encrypted secure submission protocol</span>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* Google Map Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="rounded overflow-hidden border border-slate-200 shadow-md h-[420px] bg-slate-100 relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118983.83401569424!2d81.56241315849884!3d21.261771146603417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dda23be28229%3A0x263e2030c109f40!2sRaipur%2C%20Chhattisgarh!5e0!3m2!1sen!2sin!4v1711111111111!5m2!1sen!2sin" 
            className="w-full h-full border-0 opacity-90"
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="RB Associates Location"
          />
          <div className="absolute top-6 left-6 p-4 rounded bg-white/95 border border-slate-200 shadow-md text-left max-w-xs pointer-events-none">
            <span className="text-[10px] text-indigo-900 font-mono uppercase font-bold block">Raipur HQ</span>
            <p className="text-slate-800 text-xs mt-1 leading-relaxed font-sans font-medium">
              Corporate Tower, VIP Road, Raipur, Chhattisgarh - 492001
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
