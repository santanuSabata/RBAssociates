import { 
  GeneralSettings, 
  CMSValue, 
  ServiceItem, 
  GalleryItem, 
  TeamMember, 
  TestimonialItem, 
  AdminUser,
  JourneyItem,
  PartnerItem
} from '../types.js';

const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('rb_admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const apiService = {
  // Authentication
  async login(username: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Login failed');
    }
    return res.json();
  },

  async verifySession() {
    const res = await fetch(`${API_BASE}/auth/session`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      localStorage.removeItem('rb_admin_token');
      throw new Error('Session expired');
    }
    return res.json();
  },

  // Settings
  async getSettings(): Promise<GeneralSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch general settings');
    return res.json();
  },

  async updateSettings(settings: Partial<GeneralSettings>): Promise<GeneralSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(settings)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update settings');
    }
    const data = await res.json();
    return data.settings;
  },

  // CMS
  async getCMS(): Promise<CMSValue> {
    const res = await fetch(`${API_BASE}/cms`);
    if (!res.ok) throw new Error('Failed to fetch CMS content');
    return res.json();
  },

  async updateCMS(cms: Partial<CMSValue>): Promise<CMSValue> {
    const res = await fetch(`${API_BASE}/cms`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(cms)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update CMS content');
    }
    const data = await res.json();
    return data.cms;
  },

  // Services
  async getServices(): Promise<ServiceItem[]> {
    const res = await fetch(`${API_BASE}/services`);
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },

  async addService(service: Omit<ServiceItem, '_id'>): Promise<ServiceItem> {
    const res = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(service)
    });
    if (!res.ok) throw new Error('Failed to add service');
    const data = await res.json();
    return data.service;
  },

  async updateService(id: string, service: Partial<ServiceItem>): Promise<ServiceItem> {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(service)
    });
    if (!res.ok) throw new Error('Failed to update service');
    const data = await res.json();
    return data.service;
  },

  async deleteService(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete service');
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    const res = await fetch(`${API_BASE}/gallery`);
    if (!res.ok) throw new Error('Failed to fetch gallery');
    return res.json();
  },

  async addGalleryItem(item: Omit<GalleryItem, '_id'>): Promise<GalleryItem> {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to add gallery item');
    const data = await res.json();
    return data.item;
  },

  async updateGalleryItem(id: string, item: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to update gallery item');
    const data = await res.json();
    return data.item;
  },

  async deleteGalleryItem(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete gallery item');
  },

  // Team
  async getTeam(): Promise<TeamMember[]> {
    const res = await fetch(`${API_BASE}/team`);
    if (!res.ok) throw new Error('Failed to fetch team');
    return res.json();
  },

  async addTeamMember(member: Omit<TeamMember, '_id'>): Promise<TeamMember> {
    const res = await fetch(`${API_BASE}/team`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(member)
    });
    if (!res.ok) throw new Error('Failed to add team member');
    const data = await res.json();
    return data.member;
  },

  async updateTeamMember(id: string, member: Partial<TeamMember>): Promise<TeamMember> {
    const res = await fetch(`${API_BASE}/team/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(member)
    });
    if (!res.ok) throw new Error('Failed to update team member');
    const data = await res.json();
    return data.member;
  },

  async deleteTeamMember(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/team/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete team member');
  },

  // Testimonials
  async getTestimonials(): Promise<TestimonialItem[]> {
    const res = await fetch(`${API_BASE}/testimonials`);
    if (!res.ok) throw new Error('Failed to fetch testimonials');
    return res.json();
  },

  async addTestimonial(testimonial: Omit<TestimonialItem, '_id'>): Promise<TestimonialItem> {
    const res = await fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(testimonial)
    });
    if (!res.ok) throw new Error('Failed to add testimonial');
    const data = await res.json();
    return data.testimonial;
  },

  async updateTestimonial(id: string, testimonial: Partial<TestimonialItem>): Promise<TestimonialItem> {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(testimonial)
    });
    if (!res.ok) throw new Error('Failed to update testimonial');
    const data = await res.json();
    return data.testimonial;
  },

  async deleteTestimonial(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete testimonial');
  },

  // Users
  async getUsers(): Promise<AdminUser[]> {
    const res = await fetch(`${API_BASE}/users`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async createUser(user: Omit<AdminUser, '_id'> & { password?: string }): Promise<AdminUser> {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(user)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create user');
    }
    const data = await res.json();
    return data.user;
  },

  async updateUser(id: string, user: Partial<AdminUser> & { password?: string }): Promise<AdminUser> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(user)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update user');
    }
    const data = await res.json();
    return data.user;
  },

  async deleteUser(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete user');
    }
  },

  // Journey
  async getJourney(): Promise<JourneyItem[]> {
    const res = await fetch(`${API_BASE}/journey`);
    if (!res.ok) throw new Error('Failed to fetch journey milestones');
    return res.json();
  },

  async addJourneyMilestone(milestone: Omit<JourneyItem, '_id'>): Promise<JourneyItem> {
    const res = await fetch(`${API_BASE}/journey`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(milestone)
    });
    if (!res.ok) throw new Error('Failed to add journey milestone');
    const data = await res.json();
    return data.milestone;
  },

  async updateJourneyMilestone(id: string, milestone: Partial<JourneyItem>): Promise<JourneyItem> {
    const res = await fetch(`${API_BASE}/journey/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(milestone)
    });
    if (!res.ok) throw new Error('Failed to update journey milestone');
    const data = await res.json();
    return data.milestone;
  },

  async deleteJourneyMilestone(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/journey/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete journey milestone');
  },

  // Partners
  async getPartners(): Promise<PartnerItem[]> {
    const res = await fetch(`${API_BASE}/partners`);
    if (!res.ok) throw new Error('Failed to fetch trusted partners');
    return res.json();
  },

  async addPartner(partner: Omit<PartnerItem, '_id'>): Promise<PartnerItem> {
    const res = await fetch(`${API_BASE}/partners`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(partner)
    });
    if (!res.ok) throw new Error('Failed to add trusted partner');
    const data = await res.json();
    return data.partner;
  },

  async updatePartner(id: string, partner: Partial<PartnerItem>): Promise<PartnerItem> {
    const res = await fetch(`${API_BASE}/partners/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(partner)
    });
    if (!res.ok) throw new Error('Failed to update trusted partner');
    const data = await res.json();
    return data.partner;
  },

  async deletePartner(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/partners/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete trusted partner');
  }
};
