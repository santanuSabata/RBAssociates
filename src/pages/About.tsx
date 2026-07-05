import React from 'react';
import { motion } from 'motion/react';
import { Shield, Award, Users, Compass, Linkedin, Twitter, Facebook, Sparkles } from 'lucide-react';
import { GeneralSettings, CMSValue, TeamMember } from '../types.js';

interface AboutProps {
  settings: GeneralSettings;
  cms: CMSValue;
  team: TeamMember[];
}

export default function About({ settings, cms, team }: AboutProps) {
  return (
    <div className="w-full bg-slate-50 text-slate-800 pb-20" id="about-page">
      {/* Page Header (Subtle grid pattern cover) */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white border-b border-slate-200 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-indigo-900/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-900 bg-indigo-50 px-3 py-1 rounded">Corporate Profile</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-slate-900">About {settings.websiteName}</h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto font-sans font-medium">
            Providing reliable auditing, strategic tax optimization, and flawless corporate filings in Raipur, Chhattisgarh.
          </p>
        </div>
      </section>

      {/* Corporate Introduction */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-900 bg-indigo-50 px-3 py-1 rounded">Founded On Integrity</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
              {cms.aboutTitle || "Expert Financial Solutions Backed by Integrity"}
            </h2>
            <div className="space-y-4 text-slate-600 font-sans font-light leading-relaxed text-base">
              <p>
                {cms.aboutDescription || "RB Associates is a premier Chartered Accountant firm based in Raipur, committed to delivering high-quality auditing, taxation, and business consulting services. We bridge the gap between financial complexity and business success. Founded with a vision to catalyze business growth, our team of highly qualified specialists offers deep expertise, ethical standards, and tailored solutions for enterprises of all sizes."}
              </p>
              <p>
                Whether you need to register a new Private Limited Company, resolve structural GST mismatches, formulate strategic corporate tax models, or represent your audits before regulatory boards, our firm is structured to deliver flawless results with absolute transparency.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-[440px] aspect-[4/3] rounded overflow-hidden border border-slate-200 shadow-xl bg-white">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
                alt="Corporate Glass Building"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
              
              {/* Glass overlay badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded bg-white/95 border border-slate-200/80 shadow-md text-left">
                <span className="text-indigo-900 font-mono text-xs uppercase block font-bold">Our Commitment</span>
                <p className="text-slate-700 text-xs mt-1 font-sans font-light leading-relaxed">
                  "Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution."
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Mission & Vision (Bento Grid Style) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          
          <div className="p-8 rounded bg-slate-50 border border-slate-200 space-y-4 hover:border-indigo-900/30 transition-all shadow-sm">
            <div className="h-12 w-12 rounded bg-indigo-50 flex items-center justify-center text-indigo-900">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900">
              {cms.missionTitle || "Our Mission"}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed font-sans font-light">
              {cms.missionText || "To empower businesses and entrepreneurs by providing high-quality, transparent, and timely financial solutions, compliance leadership, and strategic insights that catalyze enterprise growth."}
            </p>
          </div>

          <div className="p-8 rounded bg-slate-50 border border-slate-200 space-y-4 hover:border-indigo-900/30 transition-all shadow-sm">
            <div className="h-12 w-12 rounded bg-indigo-50 flex items-center justify-center text-indigo-900">
              <Compass size={24} />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900">
              {cms.visionTitle || "Our Vision"}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed font-sans font-light">
              {cms.visionText || "To be the most trusted and premium financial consultancy firm in central India, recognized for our absolute integrity, technological integration, and corporate growth catalysis."}
            </p>
          </div>

        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-900 bg-indigo-50 px-3 py-1 rounded">Our Foundation</span>
            <h2 className="text-3xl font-extrabold font-display text-slate-900">
              {cms.valuesTitle || "Our Core Values"}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-sans font-medium max-w-lg mx-auto">
              These principles guide our advisory workflows and define the long-term partnerships we build with corporate boards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {(cms.valuesList || [
              { title: "Absolute Integrity", description: "Uncompromising honesty and ethical compliance in every filing and audit." },
              { title: "Professional Excellence", description: "Providing highly specialized financial expertise customized to each industry sector." },
              { title: "Client Partnership", description: "We treat your business compliance and tax optimization as our own goals." },
              { title: "Technological Agility", description: "Leveraging digital workflows for rapid, transparent bookkeeping and secure report delivery." }
            ]).map((value, i) => (
              <div key={i} className="p-6 rounded bg-white border border-slate-200 space-y-3 hover:border-indigo-900 transition-colors shadow-sm">
                <span className="text-xs font-mono font-bold text-indigo-900 uppercase">Value &bull; 0{i + 1}</span>
                <h3 className="text-base font-bold font-display text-slate-900">{value.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-sans font-light">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Professional Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-900 bg-indigo-100 px-3 py-1 rounded">Certified Advisors</span>
            <h2 className="text-3xl font-extrabold font-display text-slate-900">Meet Our Chartered Partners</h2>
            <p className="text-slate-600 text-sm leading-relaxed max-w-lg mx-auto font-medium">
              Our partners bring deep tax compliance, legal ROC governance, and corporate statutory audit backgrounds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {team.map((member) => (
              <div
                key={member._id}
                className="rounded overflow-hidden bg-slate-50 border border-slate-200 hover:border-indigo-900 transition-all flex flex-col group shadow-sm"
              >
                {/* Photo frame */}
                <div className="h-64 w-full bg-slate-200 overflow-hidden relative">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-80" />
                </div>

                {/* Profile detail */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold font-display text-slate-900 group-hover:text-indigo-900 transition-colors">
                      {member.name}
                    </h3>
                    <span className="text-xs font-semibold font-mono text-indigo-900 block mt-0.5">
                      {member.designation}
                    </span>
                    <p className="text-slate-600 text-xs leading-relaxed font-sans font-light mt-3">
                      {member.description}
                    </p>
                  </div>

                  {/* Social icons */}
                  {member.socialLinks && (
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                      {member.socialLinks.linkedin && (
                        <a
                          href={member.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-indigo-900 transition-colors"
                          aria-label={`${member.name} LinkedIn`}
                        >
                          <Linkedin size={14} />
                        </a>
                      )}
                      {member.socialLinks.twitter && (
                        <a
                          href={member.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-indigo-900 transition-colors"
                          aria-label={`${member.name} Twitter`}
                        >
                          <Twitter size={14} />
                        </a>
                      )}
                      {member.socialLinks.facebook && (
                        <a
                          href={member.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-indigo-900 transition-colors"
                          aria-label={`${member.name} Facebook`}
                        >
                          <Facebook size={14} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
