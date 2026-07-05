import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_DIR = path.join(process.cwd(), 'data');

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export interface DatabaseSchema {
  users: any[];
  cms: any;
  services: any[];
  gallery: any[];
  team: any[];
  testimonials: any[];
  settings: any;
  journey: any[];
  partners: any[];
}

class JsonDatabase {
  private getFilePath(collection: string) {
    return path.join(DB_DIR, `${collection}.json`);
  }

  public read(collection: string): any[] | any {
    const filePath = this.getFilePath(collection);
    if (!fs.existsSync(filePath)) {
      this.seedDefault(collection);
    }
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error(`Error reading collection ${collection}, re-seeding...`, e);
      this.seedDefault(collection);
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  }

  public write(collection: string, data: any): void {
    const filePath = this.getFilePath(collection);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Collection operations
  public list(collection: string): any[] {
    const data = this.read(collection);
    return Array.isArray(data) ? data : [];
  }

  public findById(collection: string, id: string): any | null {
    const list = this.list(collection);
    return list.find(item => item._id === id || item.id === id) || null;
  }

  public insert(collection: string, doc: any): any {
    const list = this.list(collection);
    const newDoc = { ...doc, _id: generateId(), createdAt: new Date().toISOString() };
    list.push(newDoc);
    this.write(collection, list);
    return newDoc;
  }

  public update(collection: string, id: string, updates: any): any | null {
    const list = this.list(collection);
    const index = list.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    const updatedDoc = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    list[index] = updatedDoc;
    this.write(collection, list);
    return updatedDoc;
  }

  public delete(collection: string, id: string): boolean {
    const list = this.list(collection);
    const filtered = list.filter(item => item._id !== id && item.id !== id);
    if (list.length === filtered.length) return false;
    this.write(collection, filtered);
    return true;
  }

  // Single record collections (like settings, cms)
  public getSingle(collection: string): any {
    const data = this.read(collection);
    if (Array.isArray(data)) {
      return data[0] || {};
    }
    return data;
  }

  public updateSingle(collection: string, updates: any): any {
    const current = this.getSingle(collection);
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
    this.write(collection, updated);
    return updated;
  }

  private seedDefault(collection: string) {
    const filePath = this.getFilePath(collection);
    let defaultData: any = [];

    if (collection === 'settings') {
      defaultData = {
        websiteName: "RB Associates",
        websiteLogo: "", // Can be text-based if empty
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
    } else if (collection === 'cms') {
      defaultData = {
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
    } else if (collection === 'users') {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync('admin123', salt);
      defaultData = [
        {
          _id: "admin-user",
          email: "admin@rbassociates.com",
          username: "admin",
          fullName: "CA Rahul Bajaj",
          password: hashedPassword,
          role: "Administrator",
          createdAt: new Date().toISOString()
        }
      ];
    } else if (collection === 'services') {
      defaultData = [
        {
          _id: "s1",
          title: "Income Tax Filing",
          iconName: "FileText",
          description: "Complete tax planning, optimization, and ITR filing for individuals, partnership firms, LLPs, and corporates. We handle intricate deductions and provide official tax representations.",
          benefits: [
            "Minimize tax liability legally",
            "Avoid late penalties and scrutiny notices",
            "Accurate computation of advance tax",
            "Representations before tax authorities"
          ],
          imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800"
        },
        {
          _id: "s2",
          title: "GST Registration & Filing",
          iconName: "FileCheck",
          description: "End-to-end GST compliance services including new GST registration, composition scheme transitions, monthly returns (GSTR-1, 3B), annual reconciliation, and audit support.",
          benefits: [
            "Input Tax Credit (ITC) optimization",
            "Hassle-free monthly reconciliation",
            "GST audit & investigation defense",
            "Smooth e-Way Bill generation guidance"
          ],
          imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800"
        },
        {
          _id: "s3",
          title: "Accounting Services",
          iconName: "Calculator",
          description: "Premium corporate bookkeeping, preparation of balance sheets, cash-flow statements, management reporting (MIS), and complete payroll management structured to regulatory standards.",
          benefits: [
            "Real-time visibility into company expenses",
            "Audit-ready financial books maintained daily",
            "Robust payroll structure with EPF/ESIC compliance",
            "Custom weekly MIS reports for directors"
          ],
          imageUrl: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=800"
        },
        {
          _id: "s4",
          title: "Audit & Assurance",
          iconName: "ShieldAlert",
          description: "Statutory audits under Companies Act, tax audits under Income Tax Act, internal reviews for process improvement, forensic auditing to uncover irregularities, and stock audits.",
          benefits: [
            "Enhanced creditworthiness with financial institutions",
            "Detection and prevention of operational leakages",
            "Strict compliance with Indian Accounting Standards (Ind AS)",
            "Unbiased reports for shareholders"
          ],
          imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
        },
        {
          _id: "s5",
          title: "Company Registration",
          iconName: "Building2",
          description: "Accelerate your entrepreneurial journey. We register Private Limited Companies, LLPs, One Person Companies (OPC), Section 8 Non-Profits, and obtain PAN, TAN, and DIN.",
          benefits: [
            "Full certificate of incorporation in 5-7 days",
            "Name search guidance and digital signature processing",
            "Immediate corporate bank account opening assistance",
            "Consultation on post-incorporation legalities"
          ],
          imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
        },
        {
          _id: "s6",
          title: "Compliance Management",
          iconName: "Briefcase",
          description: "Avoid massive penalties with our corporate secretarial packages. We handle ROC Annual Filings (MGT-7, AOC-4), Board Meeting minutes, DIN KYC, and trademark registrations.",
          benefits: [
            "Maintain an active and healthy company registry",
            "Protection against director disqualifications",
            "Corporate restructuring advice (shares, additions)",
            "Comprehensive regulatory calendar tracking"
          ],
          imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800"
        },
        {
          _id: "s7",
          title: "Financial Planning",
          iconName: "TrendingUp",
          description: "Comprehensive capital budgeting, investment advisory, project report preparation, bank loan syndication, debt restructuring, and wealth optimization advice.",
          benefits: [
            "High-chance project reports for bank approvals",
            "Optimal debt-to-equity restructuring",
            "Corporate wealth management with strong returns",
            "Business valuation for fundraising"
          ],
          imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800"
        },
        {
          _id: "s8",
          title: "Business Advisory",
          iconName: "Compass",
          description: "Strategic counseling for business growth, cash-flow models, startup mentorship, mergers and acquisitions, and cost optimization plans for maximizing profit margins.",
          benefits: [
            "Actionable strategy to scale business models",
            "Identify and cut redundant overhead costs",
            "Expert negotiations and deal-structuring support",
            "Sustained quarterly expansion planning"
          ],
          imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
        }
      ];
    } else if (collection === 'gallery') {
      defaultData = [
        {
          _id: "g1",
          title: "Executive Office Space",
          category: "Office",
          imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
          description: "Our premium corporate consulting office located in VIP Road, Raipur."
        },
        {
          _id: "g2",
          title: "Annual Budget Webinar",
          category: "Seminars",
          imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800",
          description: "CA Rahul Bajaj delivering key insights on Union Budget impact analysis."
        },
        {
          _id: "g3",
          title: "Client Consultation Session",
          category: "Client Meets",
          imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
          description: "Strategic financial restructuring discussion with key industry clients."
        },
        {
          _id: "g4",
          title: "Core Advisory Team",
          category: "Office",
          imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800",
          description: "Our experienced partners analyzing national tax policy updates."
        },
        {
          _id: "g5",
          title: "Tax Excellence Summit",
          category: "Seminars",
          imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
          description: "Honored with the Leadership in Corporate compliance trophy in Raipur."
        },
        {
          _id: "g6",
          title: "Corporate Client Advisory",
          category: "Client Meets",
          imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
          description: "Reviewing company compliance status boards during a quarterly meeting."
        }
      ];
    } else if (collection === 'team') {
      defaultData = [
        {
          _id: "t1",
          name: "CA Rahul Bajaj",
          designation: "Founder & Senior Partner",
          imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=500",
          description: "Chartered Accountant with 15+ years of extensive experience in Corporate Auditing, International Tax, and High-Value Business Restructuring. Ex-consultant at top-tier firms.",
          socialLinks: {
            facebook: "https://facebook.com",
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com"
          }
        },
        {
          _id: "t2",
          name: "CA Neha Sharma",
          designation: "Partner - Indirect Tax & GST Specialist",
          imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=500",
          description: "Expert in national Goods and Services Tax (GST) mechanisms, state tax policy representations, and complex corporate dispute resolutions. Author of several tax compliance digests.",
          socialLinks: {
            facebook: "https://facebook.com",
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com"
          }
        },
        {
          _id: "t3",
          name: "Amit Patel",
          designation: "Senior Corporate Accounting Head",
          imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=500",
          description: "Passionate about micro-detailing corporate balance sheets and streamlining multi-layered payroll workflows. Guides our accounting interns and oversees ERP bookkeeping audits.",
          socialLinks: {
            facebook: "https://facebook.com",
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com"
          }
        },
        {
          _id: "t4",
          name: "Priya Mishra",
          designation: "Corporate Compliance Officer",
          imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=500",
          description: "Specializes in MCA filing algorithms, startup incorporation frameworks, ROC corporate governance, and digital trademark filings. Ensures compliance with zero regulatory friction.",
          socialLinks: {
            facebook: "https://facebook.com",
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com"
          }
        }
      ];
    } else if (collection === 'testimonials') {
      defaultData = [
        {
          _id: "test1",
          clientName: "Rajesh Agarwal",
          companyName: "Raipur Steel Industries",
          review: "RB Associates has transformed our corporate tax structuring completely. Their compliance auditing is detail-oriented, accurate, and saves us from costly errors. Absolutely outstanding service!",
          rating: 5,
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
        },
        {
          _id: "test2",
          clientName: "Ananya Sahu",
          companyName: "Chhattisgarh Organics Pvt Ltd",
          review: "As a young startup founder, I was overwhelmed by legalities like ROC, GST registration, and corporate bylaws. CA Neha and Priya handled everything effortlessly. It allowed us to focus purely on product growth.",
          rating: 5,
          imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300"
        },
        {
          _id: "test3",
          clientName: "Vikram Singh",
          companyName: "V.S. Logistics Raipur",
          review: "Statutory tax audit was always a stressful event until we partnered with RB Associates. Their transparent work systems, secure electronic portals, and proactive advisory have added immense trust to our accounts.",
          rating: 5,
          imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300"
        }
      ];
    } else if (collection === 'faqs') {
      defaultData = [
        {
          _id: "faq-1",
          question: "What is the standard due date for individual Income Tax filing in India?",
          answer: "For individual taxpayers, salaried employees, and business entities whose accounts do not require an audit, the standard due date for filing Income Tax Returns (ITR) is July 31st of the assessment year. For companies and audited entities, it is usually October 31st.",
          category: "Taxation",
          isActive: true
        },
        {
          _id: "faq-2",
          question: "Who is required to obtain GST registration?",
          answer: "GST registration is mandatory for businesses supplying goods with an annual aggregate turnover exceeding ₹40 Lakhs (₹20 Lakhs for special category states) and for service providers exceeding ₹20 Lakhs (₹10 Lakhs for special category states). Casual taxable persons and e-commerce operators must register regardless of turnover.",
          category: "GST Compliance",
          isActive: true
        },
        {
          _id: "faq-3",
          question: "What are the key corporate ROC compliance requirements after incorporation?",
          answer: "Post-incorporation compliance includes appointing a statutory auditor within 30 days, holding the first board meeting within 30 days, filing Form INC-20A (Commencement of Business) within 180 days, and conducting annual general meetings (AGM) along with filing AOC-4 (financial statements) and MGT-7 (annual return).",
          category: "Corporate ROC",
          isActive: true
        },
        {
          _id: "faq-4",
          question: "Can I claim Input Tax Credit (ITC) on all business purchases?",
          answer: "You can claim ITC on most goods and services used in the course or furtherance of business. However, Section 17(5) of the CGST Act blocks ITC on specific items, such as motor vehicles (with exceptions), food and beverages, club memberships, personal consumption, and goods lost or destroyed.",
          category: "GST Compliance",
          isActive: true
        },
        {
          _id: "faq-5",
          question: "What is advance tax, and who needs to pay it?",
          answer: "Advance tax is tax paid in advance during the financial year instead of a lump sum at the year-end. It is mandatory for any taxpayer (salaried, self-employed, or corporate) whose estimated total tax liability for the year, after deducting TDS/TCS, is ₹10,000 or more.",
          category: "Taxation",
          isActive: true
        }
      ];
    } else if (collection === 'journey') {
      defaultData = [
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
      ];
    } else if (collection === 'partners') {
      defaultData = [
        {
          _id: "p1",
          name: "Apex Solutions",
          logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200",
          websiteUrl: "https://example.com"
        },
        {
          _id: "p2",
          name: "Horizon Enterprises",
          logoUrl: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&q=80&w=200",
          websiteUrl: "https://example.com"
        },
        {
          _id: "p3",
          name: "Prime Consulting",
          logoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200",
          websiteUrl: "https://example.com"
        },
        {
          _id: "p4",
          name: "Nexa Industries",
          logoUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200",
          websiteUrl: "https://example.com"
        },
        {
          _id: "p5",
          name: "Stellar Venture Partners",
          logoUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=200",
          websiteUrl: "https://example.com"
        }
      ];
    } else if (collection === 'audit_logs') {
      defaultData = [
        {
          _id: "log-seed",
          action: "System Initialization",
          details: "Seed database created and initialized with defaults.",
          performedBy: "System Root",
          timestamp: new Date().toISOString()
        }
      ];
    }

    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
  }

  public log(action: string, details: string, performedBy: string = 'Administrator'): void {
    try {
      const list = this.list('audit_logs');
      const newDoc = {
        _id: generateId(),
        action,
        details,
        performedBy,
        timestamp: new Date().toISOString()
      };
      list.unshift(newDoc);
      this.write('audit_logs', list.slice(0, 500)); // Cap at 500 logs
    } catch (e) {
      console.error('Error writing audit log:', e);
    }
  }
}

export const db = new JsonDatabase();
