export interface GeneralSettings {
  websiteName: string;
  websiteLogo: string;
  websiteFavicon: string;
  websiteTagline: string;
  shortDescription: string;
  primaryMobile: string;
  secondaryMobile: string;
  contactEmail: string;
  alternateEmail: string;
  whatsAppNumber: string;
  officeAddress: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedInUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  footerDescription: string;
  copyrightText: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

export interface CMSValue {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  aboutTitle: string;
  aboutDescription: string;
  whyChooseTitle: string;
  whyChooseSubtitle: string;
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
  valuesTitle: string;
  valuesList: Array<{ title: string; description: string }>;
}

export interface ServiceItem {
  _id: string;
  title: string;
  iconName: string;
  description: string;
  benefits: string[];
  imageUrl: string;
}

export interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  designation: string;
  imageUrl: string;
  description: string;
  socialLinks: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface TestimonialItem {
  _id: string;
  clientName: string;
  companyName: string;
  review: string;
  rating: number;
  imageUrl: string;
}

export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  createdAt?: string;
}

export interface JourneyItem {
  _id: string;
  year: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface PartnerItem {
  _id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
}

