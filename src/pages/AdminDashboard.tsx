import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, ImageIcon, Briefcase, Users, MessageSquare, 
  Settings, Lock, LogOut, Plus, Trash2, Edit2, Check, AlertTriangle, 
  Globe, Mail, Phone, ExternalLink, HelpCircle, UserCheck, ShieldCheck, Eye, Handshake
} from 'lucide-react';
import { apiService } from '../services/api.js';
import { 
  GeneralSettings, CMSValue, ServiceItem, GalleryItem, 
  TeamMember, TestimonialItem, AdminUser, JourneyItem, PartnerItem 
} from '../types.js';

interface AdminDashboardProps {
  settings: GeneralSettings;
  cms: CMSValue;
  services: ServiceItem[];
  gallery: GalleryItem[];
  team: TeamMember[];
  testimonials: TestimonialItem[];
  journey: JourneyItem[];
  partners: PartnerItem[];
  onSettingsUpdate: (settings: GeneralSettings) => void;
  onCMSUpdate: (cms: CMSValue) => void;
  onServicesUpdate: (services: ServiceItem[]) => void;
  onGalleryUpdate: (gallery: GalleryItem[]) => void;
  onTeamUpdate: (team: TeamMember[]) => void;
  onTestimonialsUpdate: (testimonials: TestimonialItem[]) => void;
  onJourneyUpdate: (journey: JourneyItem[]) => void;
  onPartnersUpdate: (partners: PartnerItem[]) => void;
  setActivePage: (page: string) => void;
  adminLoggedIn: boolean;
  setAdminLoggedIn: (val: boolean) => void;
}

export default function AdminDashboard({
  settings, cms, services, gallery, team, testimonials, journey, partners,
  onSettingsUpdate, onCMSUpdate, onServicesUpdate, onGalleryUpdate, onTeamUpdate, onTestimonialsUpdate, onJourneyUpdate, onPartnersUpdate,
  setActivePage, adminLoggedIn, setAdminLoggedIn
}: AdminDashboardProps) {
  
  // Auth Form State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Panel Tabs: 'settings' | 'cms' | 'services' | 'gallery' | 'team' | 'testimonials' | 'users' | 'faqs' | 'audit_logs' | 'journey' | 'partners'
  const [activeTab, setActiveTab] = useState<'settings' | 'cms' | 'services' | 'gallery' | 'team' | 'testimonials' | 'users' | 'faqs' | 'audit_logs' | 'journey' | 'partners'>('settings');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Loaded Users List
  const [usersList, setUsersList] = useState<AdminUser[]>([]);

  // Audit Logs & FAQs states
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLogsLoading, setAuditLogsLoading] = useState<boolean>(false);
  const [faqsList, setFaqsList] = useState<any[]>([]);
  const [faqsLoading, setFaqsLoading] = useState<boolean>(false);
  const [faqInput, setFaqInput] = useState({ question: '', answer: '', category: 'Taxation', isActive: true });

  // Modals & Action Forms
  const [logoUploading, setLogoUploading] = useState<boolean>(false);
  const [faviconUploading, setFaviconUploading] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields State Managers
  const [settingsForm, setSettingsForm] = useState<GeneralSettings>({ ...settings });
  const [cmsForm, setCmsForm] = useState<CMSValue>({ ...cms });
  
  // Dynamic Service / Gallery / Team / Testimonial / User Form Inputs
  const [serviceInput, setServiceInput] = useState({ title: '', iconName: 'FileText', description: '', benefitsStr: '', imageUrl: '' });
  const [galleryInput, setGalleryInput] = useState({ title: '', category: 'Office', imageUrl: '', description: '' });
  const [teamInput, setTeamInput] = useState({ name: '', designation: '', imageUrl: '', description: '', facebook: '', linkedin: '', twitter: '' });
  const [testimonialInput, setTestimonialInput] = useState({ clientName: '', companyName: '', review: '', rating: 5, imageUrl: '' });
  const [userInput, setUserInput] = useState({ username: '', password: '', email: '', fullName: '', role: 'Editor' });
  const [journeyInput, setJourneyInput] = useState({ year: '', title: '', description: '', iconName: 'Award' });
  const [partnerInput, setPartnerInput] = useState({ name: '', logoUrl: '', websiteUrl: '' });
  const [partnerLogoUploading, setPartnerLogoUploading] = useState<boolean>(false);

  // Sync initial inputs when props change
  useEffect(() => {
    setSettingsForm({ ...settings });
  }, [settings]);

  useEffect(() => {
    setCmsForm({ ...cms });
  }, [cms]);

  // Load Admin User accounts list upon tab change
  useEffect(() => {
    if (adminLoggedIn && activeTab === 'users') {
      fetchUsers();
    }
  }, [adminLoggedIn, activeTab]);

  // Load Audit Logs list upon tab change
  useEffect(() => {
    if (adminLoggedIn && activeTab === 'audit_logs') {
      fetchAuditLogs();
    }
  }, [adminLoggedIn, activeTab]);

  // Load FAQs list upon tab change
  useEffect(() => {
    if (adminLoggedIn && activeTab === 'faqs') {
      fetchFaqs();
    }
  }, [adminLoggedIn, activeTab]);

  const fetchAuditLogs = async () => {
    setAuditLogsLoading(true);
    try {
      const res = await fetch('/api/audit-logs', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('rb_admin_token')}` }
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAuditLogs(data);
    } catch (e) {
      triggerError('Failed to fetch administrative audit logs.');
    } finally {
      setAuditLogsLoading(false);
    }
  };

  const fetchFaqs = async () => {
    setFaqsLoading(true);
    try {
      const res = await fetch('/api/cms/faqs');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFaqsList(data);
    } catch (e) {
      triggerError('Failed to fetch CMS FAQs.');
    } finally {
      setFaqsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await apiService.getUsers();
      setUsersList(data);
    } catch (err: any) {
      triggerError('Failed to fetch administrator accounts.');
    }
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 4000);
  };

  // Helper file converter
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      callback(reader.result as string);
    };
    reader.onerror = (error) => {
      console.error('File-to-base64 conversion error:', error);
      triggerError('Failed to parse uploaded image file.');
    };
    reader.readAsDataURL(file);
  };

  // 1. AUTHENTICATION OPERATIONS
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const data = await apiService.login(loginUsername, loginPassword);
      localStorage.setItem('rb_admin_token', data.token);
      setAdminLoggedIn(true);
      triggerSuccess('Administrator logged in successfully!');
      setActiveTab('settings');
    } catch (err: any) {
      setLoginError(err.message || 'Invalid username or password.');
    } finally {
      setLoginLoading(false);
    }
  };

  // 2. CMS CONTENT OPERATIONS
  const handleCMSFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCmsForm({
      ...cmsForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCMSValueChange = (index: number, field: 'title' | 'description', value: string) => {
    const newList = [...(cmsForm.valuesList || [])];
    newList[index] = { ...newList[index], [field]: value };
    setCmsForm({ ...cmsForm, valuesList: newList });
  };

  const handleCMSUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await apiService.updateCMS(cmsForm);
      onCMSUpdate(updated);
      triggerSuccess('CMS Content saved and updated successfully!');
    } catch (err: any) {
      triggerError('Failed to update CMS page sections.');
    }
  };

  // 3. GENERAL SETTINGS OPERATIONS
  const handleSettingsFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettingsForm({
      ...settingsForm,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'websiteLogo' | 'websiteFavicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (field === 'websiteLogo') {
      setLogoUploading(true);
    } else {
      setFaviconUploading(true);
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/settings/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('rb_admin_token')}`
        },
        body: formData
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      setSettingsForm(prev => ({
        ...prev,
        [field]: data.url
      }));
      triggerSuccess(`${field === 'websiteLogo' ? 'Logo' : 'Favicon'} uploaded successfully from local computer!`);
    } catch (err) {
      triggerError('Failed to upload file from local computer.');
    } finally {
      if (field === 'websiteLogo') {
        setLogoUploading(false);
      } else {
        setFaviconUploading(false);
      }
    }
  };

  const handleSettingsUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await apiService.updateSettings(settingsForm);
      onSettingsUpdate(updated);
      triggerSuccess('General settings synchronized successfully!');
    } catch (err: any) {
      triggerError('Failed to update website configuration details.');
    }
  };

  // 4. SERVICES OPERATIONS
  const handleAddServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const benefits = serviceInput.benefitsStr.split(',').map(b => b.trim()).filter(b => b !== '');
      const added = await apiService.addService({
        title: serviceInput.title,
        description: serviceInput.description,
        iconName: serviceInput.iconName,
        benefits,
        imageUrl: serviceInput.imageUrl
      });
      onServicesUpdate([...services, added]);
      triggerSuccess('Service page added successfully!');
      setShowAddForm(false);
      setServiceInput({ title: '', iconName: 'FileText', description: '', benefitsStr: '', imageUrl: '' });
    } catch (err: any) {
      triggerError('Failed to create new corporate service.');
    }
  };

  const handleUpdateServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const benefits = serviceInput.benefitsStr.split(',').map(b => b.trim()).filter(b => b !== '');
      const updated = await apiService.updateService(editingItem._id, {
        title: serviceInput.title,
        description: serviceInput.description,
        iconName: serviceInput.iconName,
        benefits,
        imageUrl: serviceInput.imageUrl
      });
      onServicesUpdate(services.map(s => s._id === updated._id ? updated : s));
      triggerSuccess('Service page updated successfully!');
      setEditingItem(null);
    } catch (err: any) {
      triggerError('Failed to modify service.');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this service card? This action is irreversible.')) return;
    try {
      await apiService.deleteService(id);
      onServicesUpdate(services.filter(s => s._id !== id));
      triggerSuccess('Service deleted successfully!');
    } catch (err: any) {
      triggerError('Failed to delete service.');
    }
  };

  // 5. GALLERY OPERATIONS
  const handleAddGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const added = await apiService.addGalleryItem(galleryInput);
      onGalleryUpdate([...gallery, added]);
      triggerSuccess('Gallery picture uploaded successfully!');
      setShowAddForm(false);
      setGalleryInput({ title: '', category: 'Office', imageUrl: '', description: '' });
    } catch (err: any) {
      triggerError('Failed to append image file to gallery.');
    }
  };

  const handleUpdateGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const updated = await apiService.updateGalleryItem(editingItem._id, galleryInput);
      onGalleryUpdate(gallery.map(g => g._id === updated._id ? updated : g));
      triggerSuccess('Gallery image modified successfully!');
      setEditingItem(null);
    } catch (err: any) {
      triggerError('Failed to edit gallery metadata.');
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery photo?')) return;
    try {
      await apiService.deleteGalleryItem(id);
      onGalleryUpdate(gallery.filter(g => g._id !== id));
      triggerSuccess('Gallery item deleted.');
    } catch (err: any) {
      triggerError('Failed to delete gallery image.');
    }
  };

  // 6. TEAM MEMBERS OPERATIONS
  const handleAddTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const added = await apiService.addTeamMember({
        name: teamInput.name,
        designation: teamInput.designation,
        description: teamInput.description,
        imageUrl: teamInput.imageUrl,
        socialLinks: {
          facebook: teamInput.facebook,
          linkedin: teamInput.linkedin,
          twitter: teamInput.twitter
        }
      });
      onTeamUpdate([...team, added]);
      triggerSuccess('Advisory partner profile created!');
      setShowAddForm(false);
      setTeamInput({ name: '', designation: '', imageUrl: '', description: '', facebook: '', linkedin: '', twitter: '' });
    } catch (err: any) {
      triggerError('Failed to add team member.');
    }
  };

  const handleUpdateTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const updated = await apiService.updateTeamMember(editingItem._id, {
        name: teamInput.name,
        designation: teamInput.designation,
        description: teamInput.description,
        imageUrl: teamInput.imageUrl,
        socialLinks: {
          facebook: teamInput.facebook,
          linkedin: teamInput.linkedin,
          twitter: teamInput.twitter
        }
      });
      onTeamUpdate(team.map(t => t._id === updated._id ? updated : t));
      triggerSuccess('Partner details updated successfully!');
      setEditingItem(null);
    } catch (err: any) {
      triggerError('Failed to update partner profile.');
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm('Delete this partner profile?')) return;
    try {
      await apiService.deleteTeamMember(id);
      onTeamUpdate(team.filter(t => t._id !== id));
      triggerSuccess('Team member deleted.');
    } catch (err: any) {
      triggerError('Failed to delete team member.');
    }
  };

  // 7. TESTIMONIAL OPERATIONS
  const handleAddTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const added = await apiService.addTestimonial(testimonialInput);
      onTestimonialsUpdate([...testimonials, added]);
      triggerSuccess('Client review saved successfully!');
      setShowAddForm(false);
      setTestimonialInput({ clientName: '', companyName: '', review: '', rating: 5, imageUrl: '' });
    } catch (err: any) {
      triggerError('Failed to add client review.');
    }
  };

  const handleUpdateTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const updated = await apiService.updateTestimonial(editingItem._id, testimonialInput);
      onTestimonialsUpdate(testimonials.map(t => t._id === updated._id ? updated : t));
      triggerSuccess('Client review updated.');
      setEditingItem(null);
    } catch (err: any) {
      triggerError('Failed to update testimonial.');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client review?')) return;
    try {
      await apiService.deleteTestimonial(id);
      onTestimonialsUpdate(testimonials.filter(t => t._id !== id));
      triggerSuccess('Testimonial deleted.');
    } catch (err: any) {
      triggerError('Failed to delete testimonial.');
    }
  };

  // 8. ADMIN USERS OPERATIONS
  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const added = await apiService.createUser(userInput);
      setUsersList([...usersList, added]);
      triggerSuccess('New administrator account created!');
      setShowAddForm(false);
      setUserInput({ username: '', password: '', email: '', fullName: '', role: 'Editor' });
    } catch (err: any) {
      triggerError(err.message || 'Failed to create user.');
    }
  };

  const handleUpdateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const updated = await apiService.updateUser(editingItem._id, userInput);
      setUsersList(usersList.map(u => u._id === updated._id ? updated : u));
      triggerSuccess('Admin account modified successfully.');
      setEditingItem(null);
    } catch (err: any) {
      triggerError(err.message || 'Failed to update user.');
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await apiService.deleteUser(id);
      setUsersList(usersList.filter(u => u._id !== id));
      triggerSuccess('User account deleted.');
    } catch (err: any) {
      triggerError(err.message || 'Failed to delete user.');
    }
  };

  // 8.8. OUR JOURNEY OPERATIONS
  const handleAddJourneySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const added = await apiService.addJourneyMilestone(journeyInput);
      onJourneyUpdate([...journey, added]);
      triggerSuccess('Journey milestone added successfully!');
      setShowAddForm(false);
      setJourneyInput({ year: '', title: '', description: '', iconName: 'Award' });
    } catch (err: any) {
      triggerError('Failed to add journey milestone.');
    }
  };

  const handleUpdateJourneySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const updated = await apiService.updateJourneyMilestone(editingItem._id, journeyInput);
      onJourneyUpdate(journey.map(j => j._id === updated._id ? updated : j));
      triggerSuccess('Journey milestone updated successfully!');
      setEditingItem(null);
    } catch (err: any) {
      triggerError('Failed to update journey milestone.');
    }
  };

  const handleDeleteJourney = async (id: string) => {
    if (!confirm('Are you sure you want to delete this journey milestone?')) return;
    try {
      await apiService.deleteJourneyMilestone(id);
      onJourneyUpdate(journey.filter(j => j._id !== id));
      triggerSuccess('Journey milestone deleted.');
    } catch (err: any) {
      triggerError('Failed to delete journey milestone.');
    }
  };

  // 8.9. TRUSTED PARTNERS OPERATIONS
  const handleAddPartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const added = await apiService.addPartner(partnerInput);
      onPartnersUpdate([...partners, added]);
      triggerSuccess('Trusted partner added successfully!');
      setShowAddForm(false);
      setPartnerInput({ name: '', logoUrl: '', websiteUrl: '' });
    } catch (err: any) {
      triggerError('Failed to add trusted partner.');
    }
  };

  const handleUpdatePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const updated = await apiService.updatePartner(editingItem._id, partnerInput);
      onPartnersUpdate(partners.map(p => p._id === updated._id ? updated : p));
      triggerSuccess('Trusted partner updated successfully!');
      setEditingItem(null);
    } catch (err: any) {
      triggerError('Failed to update trusted partner.');
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trusted partner?')) return;
    try {
      await apiService.deletePartner(id);
      onPartnersUpdate(partners.filter(p => p._id !== id));
      triggerSuccess('Trusted partner deleted.');
    } catch (err: any) {
      triggerError('Failed to delete trusted partner.');
    }
  };

  // 9. FAQ OPERATIONS
  const handleAddFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cms/faqs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('rb_admin_token')}`
        },
        body: JSON.stringify(faqInput)
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFaqsList([...faqsList, data.faq]);
      triggerSuccess('FAQ added successfully!');
      setShowAddForm(false);
      setFaqInput({ question: '', answer: '', category: 'Taxation', isActive: true });
    } catch (e) {
      triggerError('Failed to add FAQ.');
    }
  };

  const handleUpdateFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const res = await fetch(`/api/cms/faqs/${editingItem._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('rb_admin_token')}`
        },
        body: JSON.stringify(faqInput)
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFaqsList(faqsList.map(f => f._id === editingItem._id ? data.faq : f));
      triggerSuccess('FAQ updated successfully!');
      setEditingItem(null);
    } catch (e) {
      triggerError('Failed to update FAQ.');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      const res = await fetch(`/api/cms/faqs/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('rb_admin_token')}`
        }
      });
      if (!res.ok) throw new Error();
      setFaqsList(faqsList.filter(f => f._id !== id));
      triggerSuccess('FAQ deleted successfully!');
    } catch (e) {
      triggerError('Failed to delete FAQ.');
    }
  };

  // PUBLIC GATEWAY: IF NOT LOGGED IN, RENDER PREMIUM LOGIN PORTAL
  if (!adminLoggedIn) {
    return (
      <div className="w-full bg-slate-50 text-slate-800 min-h-[85vh] flex items-center justify-center px-4" id="admin-login-screen">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-900/5 rounded-full filter blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded shadow-lg space-y-6 text-left relative z-10">
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded bg-indigo-50 flex items-center justify-center text-indigo-900 border border-indigo-100 shadow-sm">
              <Lock size={22} className="stroke-[2]" />
            </div>
            <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900 mt-3">Admin Desk Access</h2>
            <p className="text-slate-500 text-xs font-sans font-light">
              Log in to manage RB Associates website contents, services roster, and settings.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="user" className="text-xs font-mono font-bold text-slate-500">Username or Email</label>
              <input
                type="text"
                id="user"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-900 focus:bg-white transition-colors font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pass" className="text-xs font-mono font-bold text-slate-500">Security Password</label>
              <input
                type="password"
                id="pass"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-900 focus:bg-white transition-colors font-semibold"
              />
            </div>

            {loginError && (
              <div className="p-3.5 rounded bg-red-50 border border-red-100 flex gap-2 text-red-700 text-xs font-semibold">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md shadow-indigo-900/10"
            >
              {loginLoading ? <span>Verifying...</span> : <span>Sign In to Desk</span>}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <button 
              onClick={() => setActivePage('home')}
              className="text-xs text-indigo-900 hover:underline inline-flex items-center gap-1.5 font-mono font-bold cursor-pointer"
            >
              &larr; Back to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD VIEW RENDER
  return (
    <div className="w-full bg-slate-50 text-slate-800 min-h-[90vh] pb-20" id="admin-dashboard-panel">
      {/* Dynamic Notifications */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded bg-indigo-900 border border-indigo-950 text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce-short">
          <Check size={16} className="stroke-[3]" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded bg-red-500 border border-red-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2">
          <AlertTriangle size={16} className="stroke-[3]" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Admin header */}
      <section className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-900 shadow-sm">
            <ShieldCheck size={22} />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-bold font-display text-slate-900">RB Associates Executive Desk</h1>
            <p className="text-[10px] text-indigo-950 font-mono font-bold">Role: Administrator Account &bull; Safe SSL connection</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('home')}
            className="px-4 py-2 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 transition-all text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            <Globe size={13} />
            <span>Go to Public Site</span>
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('rb_admin_token');
              setAdminLoggedIn(false);
              setActivePage('home');
            }}
            className="px-4 py-2 text-xs font-bold rounded bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Nav links */}
        <aside className="lg:col-span-3 bg-white border border-slate-200 rounded overflow-hidden p-3 space-y-1.5 text-left shadow-sm">
          <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-widest px-3 pt-2 pb-1.5 block border-b border-slate-100 mb-2">Modules</span>
          
          <button
            onClick={() => { setActiveTab('settings'); setEditingItem(null); setShowAddForm(false); }}
            className={`w-full px-4 py-3 rounded text-xs font-semibold font-mono uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'settings' ? 'bg-indigo-900 text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-900'
            }`}
          >
            <Settings size={15} />
            <span>General Settings</span>
          </button>

          <button
            onClick={() => { setActiveTab('cms'); setEditingItem(null); setShowAddForm(false); }}
            className={`w-full px-4 py-3 rounded text-xs font-semibold font-mono uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'cms' ? 'bg-indigo-900 text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-900'
            }`}
          >
            <FileText size={15} />
            <span>CMS Content</span>
          </button>

          <button
            onClick={() => { setActiveTab('services'); setEditingItem(null); setShowAddForm(false); }}
            className={`w-full px-4 py-3 rounded text-xs font-semibold font-mono uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'services' ? 'bg-indigo-900 text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-900'
            }`}
          >
            <Briefcase size={15} />
            <span>CA Services</span>
          </button>

          <button
            onClick={() => { setActiveTab('gallery'); setEditingItem(null); setShowAddForm(false); }}
            className={`w-full px-4 py-3 rounded text-xs font-semibold font-mono uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'gallery' ? 'bg-indigo-900 text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-900'
            }`}
          >
            <ImageIcon size={15} />
            <span>Gallery Assets</span>
          </button>

          <button
            onClick={() => { setActiveTab('team'); setEditingItem(null); setShowAddForm(false); }}
            className={`w-full px-4 py-3 rounded text-xs font-semibold font-mono uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'team' ? 'bg-indigo-900 text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-900'
            }`}
          >
            <Users size={15} />
            <span>Advisory Team</span>
          </button>

          <button
            onClick={() => { setActiveTab('testimonials'); setEditingItem(null); setShowAddForm(false); }}
            className={`w-full px-4 py-3 rounded text-xs font-semibold font-mono uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'testimonials' ? 'bg-indigo-900 text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-900'
            }`}
          >
            <MessageSquare size={15} />
            <span>Client Reviews</span>
          </button>

          <button
            onClick={() => { setActiveTab('journey'); setEditingItem(null); setShowAddForm(false); }}
            className={`w-full px-4 py-3 rounded text-xs font-semibold font-mono uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'journey' ? 'bg-indigo-900 text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-900'
            }`}
          >
            <Briefcase size={15} />
            <span>Our Journey</span>
          </button>

          <button
            onClick={() => { setActiveTab('partners'); setEditingItem(null); setShowAddForm(false); }}
            className={`w-full px-4 py-3 rounded text-xs font-semibold font-mono uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'partners' ? 'bg-indigo-900 text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-900'
            }`}
          >
            <Handshake size={15} />
            <span>Trusted Partners</span>
          </button>

          <button
            onClick={() => { setActiveTab('users'); setEditingItem(null); setShowAddForm(false); }}
            className={`w-full px-4 py-3 rounded text-xs font-semibold font-mono uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'users' ? 'bg-indigo-900 text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-900'
            }`}
          >
            <UserCheck size={15} />
            <span>Admin Users</span>
          </button>

          <button
            onClick={() => { setActiveTab('faqs'); setEditingItem(null); setShowAddForm(false); setFaqInput({ question: '', answer: '', category: 'Taxation', isActive: true }); }}
            className={`w-full px-4 py-3 rounded text-xs font-semibold font-mono uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'faqs' ? 'bg-indigo-900 text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-900'
            }`}
          >
            <HelpCircle size={15} />
            <span>Manage FAQs</span>
          </button>

          <button
            onClick={() => { setActiveTab('audit_logs'); setEditingItem(null); setShowAddForm(false); }}
            className={`w-full px-4 py-3 rounded text-xs font-semibold font-mono uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'audit_logs' ? 'bg-indigo-900 text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-900'
            }`}
          >
            <ShieldCheck size={15} />
            <span>Audit Logs</span>
          </button>
        </aside>

        {/* Central Work Space Frame */}
        <main className="lg:col-span-9 bg-white border border-slate-200 rounded p-6 sm:p-8 relative min-h-[500px] shadow-sm">
          
          {/* TAB 1: GENERAL SETTINGS EDITOR */}
          {activeTab === 'settings' && (
            <div className="space-y-6 text-left">
              <div className="border-b border-white/5 pb-4">
                <h2 className="text-xl font-bold font-display text-white">General Website Settings</h2>
                <p className="text-xs text-slate-400 mt-1">Configure global details, phone numbers, WhatsApp links, and SEO fields.</p>
              </div>

              <form onSubmit={handleSettingsUpdateSubmit} className="space-y-6">
                
                {/* Information block */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">Website Info</h3>

                  {/* Local Logo & Favicon Upload Block */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-950 border border-white/10 shadow-sm">
                    {/* Website Logo Section */}
                    <div className="space-y-3">
                      <label className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider block">Website Logo</label>
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded border border-white/10 bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                          {settingsForm.websiteLogo ? (
                            <img src={settingsForm.websiteLogo} alt="Logo Preview" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono">No Logo</span>
                          )}
                        </div>
                        <div className="flex-grow space-y-2">
                          <input
                            type="text"
                            name="websiteLogo"
                            value={settingsForm.websiteLogo || ''}
                            onChange={handleSettingsFieldChange}
                            placeholder="Logo URL (or uploaded path)"
                            className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                          />
                          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-indigo-900 hover:bg-indigo-800 text-white text-[11px] font-bold font-mono uppercase tracking-wider cursor-pointer transition-all shadow-sm select-none">
                            {logoUploading ? (
                              <>
                                <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                <span>Upload Logo</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={logoUploading}
                              onChange={(e) => handleFileUpload(e, 'websiteLogo')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Website Favicon Section */}
                    <div className="space-y-3">
                      <label className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider block">Website Favicon</label>
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded border border-white/10 bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                          {settingsForm.websiteFavicon ? (
                            <img src={settingsForm.websiteFavicon} alt="Favicon Preview" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono">No Favicon</span>
                          )}
                        </div>
                        <div className="flex-grow space-y-2">
                          <input
                            type="text"
                            name="websiteFavicon"
                            value={settingsForm.websiteFavicon || ''}
                            onChange={handleSettingsFieldChange}
                            placeholder="Favicon URL (or uploaded path)"
                            className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                          />
                          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-indigo-900 hover:bg-indigo-800 text-white text-[11px] font-bold font-mono uppercase tracking-wider cursor-pointer transition-all shadow-sm select-none">
                            {faviconUploading ? (
                              <>
                                <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                <span>Upload Favicon</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={faviconUploading}
                              onChange={(e) => handleFileUpload(e, 'websiteFavicon')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Website Name</label>
                      <input
                        type="text"
                        name="websiteName"
                        value={settingsForm.websiteName}
                        onChange={handleSettingsFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Website Tagline</label>
                      <input
                        type="text"
                        name="websiteTagline"
                        value={settingsForm.websiteTagline}
                        onChange={handleSettingsFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">Short Meta Description</label>
                    <textarea
                      name="shortDescription"
                      rows={2}
                      value={settingsForm.shortDescription}
                      onChange={handleSettingsFieldChange}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 resize-none"
                    />
                  </div>
                </div>

                {/* Contact information block */}
                <div className="space-y-4 border-t border-white/5 pt-6">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">Official Contact Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Primary Contact Number</label>
                      <input
                        type="text"
                        name="primaryMobile"
                        value={settingsForm.primaryMobile}
                        onChange={handleSettingsFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Secondary Contact Number</label>
                      <input
                        type="text"
                        name="secondaryMobile"
                        value={settingsForm.secondaryMobile}
                        onChange={handleSettingsFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Official Contact Email</label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={settingsForm.contactEmail}
                        onChange={handleSettingsFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Alternate Email</label>
                      <input
                        type="email"
                        name="alternateEmail"
                        value={settingsForm.alternateEmail}
                        onChange={handleSettingsFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">WhatsApp Link Number</label>
                      <input
                        type="text"
                        name="whatsAppNumber"
                        value={settingsForm.whatsAppNumber}
                        onChange={handleSettingsFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">Headquarters Physical Address</label>
                    <textarea
                      name="officeAddress"
                      rows={2}
                      value={settingsForm.officeAddress}
                      onChange={handleSettingsFieldChange}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 resize-none"
                    />
                  </div>
                </div>

                {/* Social links block */}
                <div className="space-y-4 border-t border-white/5 pt-6">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">Social Handles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Facebook URL</label>
                      <input
                        type="text"
                        name="facebookUrl"
                        value={settingsForm.facebookUrl}
                        onChange={handleSettingsFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">LinkedIn URL</label>
                      <input
                        type="text"
                        name="linkedInUrl"
                        value={settingsForm.linkedInUrl}
                        onChange={handleSettingsFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Description */}
                <div className="space-y-4 border-t border-white/5 pt-6">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">Footer Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Footer Description</label>
                      <input
                        type="text"
                        name="footerDescription"
                        value={settingsForm.footerDescription}
                        onChange={handleSettingsFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Copyright Text</label>
                      <input
                        type="text"
                        name="copyrightText"
                        value={settingsForm.copyrightText}
                        onChange={handleSettingsFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* SEO fields block */}
                <div className="space-y-4 border-t border-white/5 pt-6">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">SEO Configurations</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Meta Page Title</label>
                      <input
                        type="text"
                        name="metaTitle"
                        value={settingsForm.metaTitle}
                        onChange={handleSettingsFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Meta Keywords (Comma separated)</label>
                      <input
                        type="text"
                        name="metaKeywords"
                        value={settingsForm.metaKeywords}
                        onChange={handleSettingsFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">Meta Description</label>
                    <textarea
                      name="metaDescription"
                      rows={2}
                      value={settingsForm.metaDescription}
                      onChange={handleSettingsFieldChange}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    Synchronize Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: CMS EDITOR */}
          {activeTab === 'cms' && (
            <div className="space-y-6 text-left">
              <div className="border-b border-white/5 pb-4">
                <h2 className="text-xl font-bold font-display text-white">CMS Content Sections</h2>
                <p className="text-xs text-slate-400 mt-1">Modify standard hero headers, sub-headlines, mission/vision statements, and values list.</p>
              </div>

              <form onSubmit={handleCMSUpdateSubmit} className="space-y-6">
                
                {/* Hero Section Texts */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">Hero Section Content</h3>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">Hero Bold Headline Title</label>
                    <textarea
                      name="heroTitle"
                      rows={2}
                      value={cmsForm.heroTitle}
                      onChange={handleCMSFieldChange}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">Hero Subtitle Text</label>
                    <textarea
                      name="heroSubtitle"
                      rows={2}
                      value={cmsForm.heroSubtitle}
                      onChange={handleCMSFieldChange}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Hero CTA Button Text</label>
                      <input
                        type="text"
                        name="heroCtaText"
                        value={cmsForm.heroCtaText}
                        onChange={handleCMSFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* About Profile Texts */}
                <div className="space-y-4 border-t border-white/5 pt-6">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">About Profile Content</h3>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">About Card Title</label>
                    <input
                      type="text"
                      name="aboutTitle"
                      value={cmsForm.aboutTitle}
                      onChange={handleCMSFieldChange}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">About Extensive Paragraph</label>
                    <textarea
                      name="aboutDescription"
                      rows={4}
                      value={cmsForm.aboutDescription}
                      onChange={handleCMSFieldChange}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                {/* Why Choose Section Texts */}
                <div className="space-y-4 border-t border-white/5 pt-6">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">Why Choose Section</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Why Choose Title</label>
                      <input
                        type="text"
                        name="whyChooseTitle"
                        value={cmsForm.whyChooseTitle}
                        onChange={handleCMSFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Why Choose Subtitle</label>
                      <input
                        type="text"
                        name="whyChooseSubtitle"
                        value={cmsForm.whyChooseSubtitle}
                        onChange={handleCMSFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Mission & Vision statements */}
                <div className="space-y-4 border-t border-white/5 pt-6">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">Mission & Vision Statement</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Mission Card Header</label>
                      <input
                        type="text"
                        name="missionTitle"
                        value={cmsForm.missionTitle}
                        onChange={handleCMSFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Vision Card Header</label>
                      <input
                        type="text"
                        name="visionTitle"
                        value={cmsForm.visionTitle}
                        onChange={handleCMSFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Mission Paragraph</label>
                      <textarea
                        name="missionText"
                        rows={3}
                        value={cmsForm.missionText}
                        onChange={handleCMSFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Vision Paragraph</label>
                      <textarea
                        name="visionText"
                        rows={3}
                        value={cmsForm.visionText}
                        onChange={handleCMSFieldChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Core Values valuesList */}
                <div className="space-y-4 border-t border-white/5 pt-6">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">Corporate Values List</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {(cmsForm.valuesList || []).map((val, index) => (
                      <div key={index} className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-3">
                        <span className="text-[9px] font-mono font-bold text-amber-500 block">VALUE SLOT {index + 1}</span>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-500">Value Title</label>
                          <input
                            type="text"
                            value={val.title}
                            onChange={(e) => handleCMSValueChange(index, 'title', e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 rounded p-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-500">Value Description</label>
                          <textarea
                            value={val.description}
                            rows={2}
                            onChange={(e) => handleCMSValueChange(index, 'description', e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 rounded p-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    Save CMS Layout
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SERVICES MANAGEMENT */}
          {activeTab === 'services' && (
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-white">Chartered Accountant Services</h2>
                  <p className="text-xs text-slate-400 mt-1">Add, modify or delete CA services cards.</p>
                </div>
                {!showAddForm && !editingItem && (
                  <button
                    onClick={() => {
                      setShowAddForm(true);
                      setServiceInput({ title: '', iconName: 'FileText', description: '', benefitsStr: '', imageUrl: '' });
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Create Service</span>
                  </button>
                )}
              </div>

              {/* Add / Edit forms block */}
              {(showAddForm || editingItem) && (
                <form 
                  onSubmit={showAddForm ? handleAddServiceSubmit : handleUpdateServiceSubmit}
                  className="p-6 rounded-xl bg-slate-950 border border-white/10 space-y-4 animate-fadeIn"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">
                      {showAddForm ? "Create New Service Card" : `Edit Service: ${editingItem?.title}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => { setShowAddForm(false); setEditingItem(null); }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Service Title *</label>
                      <input
                        type="text"
                        required
                        value={serviceInput.title}
                        onChange={(e) => setServiceInput({ ...serviceInput, title: e.target.value })}
                        placeholder="e.g. Audit & Tax Consulting"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Icon Symbol *</label>
                      <select
                        value={serviceInput.iconName}
                        onChange={(e) => setServiceInput({ ...serviceInput, iconName: e.target.value })}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        <option value="FileText">Document (FileText)</option>
                        <option value="FileCheck">GST/Filing (FileCheck)</option>
                        <option value="Calculator">Accounting (Calculator)</option>
                        <option value="ShieldAlert">Audit/Assurance (ShieldAlert)</option>
                        <option value="Building2">Registrations (Building2)</option>
                        <option value="Briefcase">ROC Compliance (Briefcase)</option>
                        <option value="TrendingUp">Financial Planning (TrendingUp)</option>
                        <option value="Compass">Business Strategy (Compass)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">Service Image (File Upload or URL) *</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={serviceInput.imageUrl}
                        onChange={(e) => setServiceInput({ ...serviceInput, imageUrl: e.target.value })}
                        placeholder="Image URL or upload below..."
                        className="flex-1 bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (base64) => setServiceInput({ ...serviceInput, imageUrl: base64 }))}
                        className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">Service Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={serviceInput.description}
                      onChange={(e) => setServiceInput({ ...serviceInput, description: e.target.value })}
                      placeholder="Write comprehensive services description paragraphs here..."
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">Core Benefits List (Separated by comma) *</label>
                    <input
                      type="text"
                      value={serviceInput.benefitsStr}
                      onChange={(e) => setServiceInput({ ...serviceInput, benefitsStr: e.target.value })}
                      placeholder="e.g. Save 30% taxes, 100% legal coverage, Flawless balance sheet"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 uppercase cursor-pointer"
                    >
                      {showAddForm ? "Save Service" : "Apply Updates"}
                    </button>
                  </div>
                </form>
              )}

              {/* Services Table */}
              {!showAddForm && !editingItem && (
                <div className="overflow-x-auto rounded-xl border border-white/5">
                  <table className="w-full text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-mono text-left">
                      <tr>
                        <th className="p-3.5">Service Title</th>
                        <th className="p-3.5">Icon String</th>
                        <th className="p-3.5">Benefits Highlights</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {services.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-950/40">
                          <td className="p-3.5 font-bold text-white">{item.title}</td>
                          <td className="p-3.5 font-mono text-amber-500">{item.iconName}</td>
                          <td className="p-3.5 max-w-xs truncate">{item.benefits.join(', ')}</td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setServiceInput({
                                  title: item.title,
                                  iconName: item.iconName,
                                  description: item.description,
                                  benefitsStr: item.benefits.join(', '),
                                  imageUrl: item.imageUrl
                                });
                              }}
                              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteService(item._id)}
                              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GALLERY MANAGEMENT */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-white">Gallery Photo Assets</h2>
                  <p className="text-xs text-slate-400 mt-1">Manage office pictures, seminars, and client meetings panels.</p>
                </div>
                {!showAddForm && !editingItem && (
                  <button
                    onClick={() => {
                      setShowAddForm(true);
                      setGalleryInput({ title: '', category: 'Office', imageUrl: '', description: '' });
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Upload Image</span>
                  </button>
                )}
              </div>

              {/* Add / Edit Form */}
              {(showAddForm || editingItem) && (
                <form 
                  onSubmit={showAddForm ? handleAddGallerySubmit : handleUpdateGallerySubmit}
                  className="p-6 rounded-xl bg-slate-950 border border-white/10 space-y-4 animate-fadeIn"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">
                      {showAddForm ? "Upload Gallery Image" : `Modify Metadata: ${editingItem?.title}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => { setShowAddForm(false); setEditingItem(null); }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Image Title *</label>
                      <input
                        type="text"
                        required
                        value={galleryInput.title}
                        onChange={(e) => setGalleryInput({ ...galleryInput, title: e.target.value })}
                        placeholder="e.g. Consulting Seminar 2026"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Category Group *</label>
                      <select
                        value={galleryInput.category}
                        onChange={(e) => setGalleryInput({ ...galleryInput, category: e.target.value })}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        <option value="Office">Office</option>
                        <option value="Seminars">Seminars</option>
                        <option value="Client Meets">Client Meets</option>
                        <option value="Team Achievements">Team Achievements</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">Image Resource (File Upload or URL) *</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={galleryInput.imageUrl}
                        onChange={(e) => setGalleryInput({ ...galleryInput, imageUrl: e.target.value })}
                        placeholder="Asset URL or upload file..."
                        className="flex-1 bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (base64) => setGalleryInput({ ...galleryInput, imageUrl: base64 }))}
                        className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-slate-800 file:text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">Short Caption description</label>
                    <input
                      type="text"
                      value={galleryInput.description}
                      onChange={(e) => setGalleryInput({ ...galleryInput, description: e.target.value })}
                      placeholder="Describe the occasion briefly..."
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 uppercase cursor-pointer"
                    >
                      {showAddForm ? "Upload to Gallery" : "Update metadata"}
                    </button>
                  </div>
                </form>
              )}

              {/* Gallery List Table */}
              {!showAddForm && !editingItem && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {gallery.map((item) => (
                    <div key={item._id} className="p-3 bg-slate-950 rounded-xl border border-white/5 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="h-32 rounded overflow-hidden bg-slate-900 border border-white/5">
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover grayscale opacity-60" referrerPolicy="no-referrer" />
                        </div>
                        <div className="text-left">
                          <span className="text-[9px] font-mono text-amber-500 font-semibold">{item.category}</span>
                          <h4 className="text-xs font-bold text-white font-display line-clamp-1">{item.title}</h4>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 border-t border-white/5 pt-2">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setGalleryInput(item);
                          }}
                          className="p-1 bg-slate-900 rounded text-slate-400 hover:text-white"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteGallery(item._id)}
                          className="p-1 bg-slate-900 rounded text-slate-400 hover:text-red-400"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: TEAM ADVISORY MANAGEMENT */}
          {activeTab === 'team' && (
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-white">Advisory Partners & Team</h2>
                  <p className="text-xs text-slate-400 mt-1">Manage partner details, designations, and professional descriptions.</p>
                </div>
                {!showAddForm && !editingItem && (
                  <button
                    onClick={() => {
                      setShowAddForm(true);
                      setTeamInput({ name: '', designation: '', imageUrl: '', description: '', facebook: '', linkedin: '', twitter: '' });
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Create Partner</span>
                  </button>
                )}
              </div>

              {/* Team form */}
              {(showAddForm || editingItem) && (
                <form 
                  onSubmit={showAddForm ? handleAddTeamSubmit : handleUpdateTeamSubmit}
                  className="p-6 rounded-xl bg-slate-950 border border-white/10 space-y-4 animate-fadeIn"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">
                      {showAddForm ? "Add New Advisory Partner" : `Modify Partner Profile: ${editingItem?.name}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => { setShowAddForm(false); setEditingItem(null); }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Partner Name *</label>
                      <input
                        type="text"
                        required
                        value={teamInput.name}
                        onChange={(e) => setTeamInput({ ...teamInput, name: e.target.value })}
                        placeholder="e.g. CA Rahul Bajaj"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Official Designation *</label>
                      <input
                        type="text"
                        required
                        value={teamInput.designation}
                        onChange={(e) => setTeamInput({ ...teamInput, designation: e.target.value })}
                        placeholder="e.g. Senior Audit Head"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">Avatar Image (Upload or URL) *</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={teamInput.imageUrl}
                        onChange={(e) => setTeamInput({ ...teamInput, imageUrl: e.target.value })}
                        placeholder="Image URL or upload..."
                        className="flex-1 bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (base64) => setTeamInput({ ...teamInput, imageUrl: base64 }))}
                        className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">Professional Profile Bio Highlight *</label>
                    <textarea
                      required
                      rows={3}
                      value={teamInput.description}
                      onChange={(e) => setTeamInput({ ...teamInput, description: e.target.value })}
                      placeholder="e.g. Ex-Senior consultant at KPMG, specializing in direct tax optimization filings."
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  {/* Social Handles */}
                  <div className="space-y-3 border-t border-white/5 pt-3">
                    <label className="text-xs font-mono text-slate-400 font-semibold block">Social Channels URLs (LinkedIn, Facebook)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={teamInput.linkedin}
                        onChange={(e) => setTeamInput({ ...teamInput, linkedin: e.target.value })}
                        placeholder="LinkedIn Profile Link"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={teamInput.facebook}
                        onChange={(e) => setTeamInput({ ...teamInput, facebook: e.target.value })}
                        placeholder="Facebook Profile Link"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 uppercase cursor-pointer"
                    >
                      Save Partner Profile
                    </button>
                  </div>
                </form>
              )}

              {/* Team Table list */}
              {!showAddForm && !editingItem && (
                <div className="overflow-x-auto rounded-xl border border-white/5">
                  <table className="w-full text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-mono text-left">
                      <tr>
                        <th className="p-3.5">Partner Name</th>
                        <th className="p-3.5">Designation</th>
                        <th className="p-3.5">Bio Snippet</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {team.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-950/40">
                          <td className="p-3.5 font-bold text-white flex items-center gap-2">
                            <img src={item.imageUrl} alt={item.name} className="h-6 w-6 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                            <span>{item.name}</span>
                          </td>
                          <td className="p-3.5 text-amber-500 font-semibold">{item.designation}</td>
                          <td className="p-3.5 max-w-xs truncate">{item.description}</td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setTeamInput({
                                  name: item.name,
                                  designation: item.designation,
                                  description: item.description,
                                  imageUrl: item.imageUrl,
                                  facebook: item.socialLinks?.facebook || '',
                                  linkedin: item.socialLinks?.linkedin || '',
                                  twitter: item.socialLinks?.twitter || ''
                                });
                              }}
                              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteTeam(item._id)}
                              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: TESTIMONIALS MANAGEMENT */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-white">Client Reviews & Testimonials</h2>
                  <p className="text-xs text-slate-400 mt-1">Manage ratings, quotes, and reviewer details.</p>
                </div>
                {!showAddForm && !editingItem && (
                  <button
                    onClick={() => {
                      setShowAddForm(true);
                      setTestimonialInput({ clientName: '', companyName: '', review: '', rating: 5, imageUrl: '' });
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Create Review</span>
                  </button>
                )}
              </div>

              {/* Testimonials Form */}
              {(showAddForm || editingItem) && (
                <form 
                  onSubmit={showAddForm ? handleAddTestimonialSubmit : handleUpdateTestimonialSubmit}
                  className="p-6 rounded-xl bg-slate-950 border border-white/10 space-y-4 animate-fadeIn"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">
                      {showAddForm ? "Create Client Review" : `Edit Testimonial: ${editingItem?.clientName}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => { setShowAddForm(false); setEditingItem(null); }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Client Name *</label>
                      <input
                        type="text"
                        required
                        value={testimonialInput.clientName}
                        onChange={(e) => setTestimonialInput({ ...testimonialInput, clientName: e.target.value })}
                        placeholder="e.g. Rajesh Agarwal"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Company Designation *</label>
                      <input
                        type="text"
                        required
                        value={testimonialInput.companyName}
                        onChange={(e) => setTestimonialInput({ ...testimonialInput, companyName: e.target.value })}
                        placeholder="e.g. CEO, Raipur Steel Industries"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Rating Rating (1-5 stars) *</label>
                      <select
                        value={testimonialInput.rating}
                        onChange={(e) => setTestimonialInput({ ...testimonialInput, rating: parseInt(e.target.value, 10) })}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Profile Picture (Upload or URL) *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={testimonialInput.imageUrl}
                          onChange={(e) => setTestimonialInput({ ...testimonialInput, imageUrl: e.target.value })}
                          placeholder="Image URL..."
                          className="flex-1 bg-slate-900 border border-white/10 rounded-lg p-2 text-xs text-white"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (base64) => setTestimonialInput({ ...testimonialInput, imageUrl: base64 }))}
                          className="text-[10px] w-24 overflow-hidden text-slate-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">Client Review Quote *</label>
                    <textarea
                      required
                      rows={3}
                      value={testimonialInput.review}
                      onChange={(e) => setTestimonialInput({ ...testimonialInput, review: e.target.value })}
                      placeholder="Write review quotation verbatim here..."
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 uppercase cursor-pointer"
                    >
                      Save Review
                    </button>
                  </div>
                </form>
              )}

              {/* Testimonials Table */}
              {!showAddForm && !editingItem && (
                <div className="overflow-x-auto rounded-xl border border-white/5">
                  <table className="w-full text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-mono text-left">
                      <tr>
                        <th className="p-3.5">Client Profile</th>
                        <th className="p-3.5">Stars</th>
                        <th className="p-3.5">Quote Review</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {testimonials.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-950/40">
                          <td className="p-3.5 font-bold text-white flex items-center gap-2">
                            <img src={item.imageUrl} alt={item.clientName} className="h-6 w-6 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                            <div>
                              <span>{item.clientName}</span>
                              <span className="text-[10px] text-slate-400 block font-normal">{item.companyName}</span>
                            </div>
                          </td>
                          <td className="p-3.5 font-mono text-amber-500 font-bold">{item.rating} Stars</td>
                          <td className="p-3.5 max-w-xs truncate">{item.review}</td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setTestimonialInput(item);
                              }}
                              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteTestimonial(item._id)}
                              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: ADMIN USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-white">Administrative Desk Accounts</h2>
                  <p className="text-xs text-slate-400 mt-1">Configure security profiles and dashboard credentials.</p>
                </div>
                {!showAddForm && !editingItem && (
                  <button
                    onClick={() => {
                      setShowAddForm(true);
                      setUserInput({ username: '', password: '', email: '', fullName: '', role: 'Editor' });
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Create User</span>
                  </button>
                )}
              </div>

              {/* Users Form */}
              {(showAddForm || editingItem) && (
                <form 
                  onSubmit={showAddForm ? handleAddUserSubmit : handleUpdateUserSubmit}
                  className="p-6 rounded-xl bg-slate-950 border border-white/10 space-y-4 animate-fadeIn"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">
                      {showAddForm ? "Create New Security Profile" : `Edit Admin Profile: ${editingItem?.username}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => { setShowAddForm(false); setEditingItem(null); }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Desk Username *</label>
                      <input
                        type="text"
                        required
                        value={userInput.username}
                        onChange={(e) => setUserInput({ ...userInput, username: e.target.value })}
                        placeholder="e.g. rahulca"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Security Password {editingItem && "(Leave blank to keep)"}</label>
                      <input
                        type="password"
                        required={showAddForm}
                        value={userInput.password}
                        onChange={(e) => setUserInput({ ...userInput, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Admin Full Name *</label>
                      <input
                        type="text"
                        required
                        value={userInput.fullName}
                        onChange={(e) => setUserInput({ ...userInput, fullName: e.target.value })}
                        placeholder="CA Rahul Bajaj"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={userInput.email}
                        onChange={(e) => setUserInput({ ...userInput, email: e.target.value })}
                        placeholder="rahul@rbassociates.com"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">Security Role *</label>
                    <select
                      value={userInput.role}
                      onChange={(e) => setUserInput({ ...userInput, role: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    >
                      <option value="Administrator">Administrator</option>
                      <option value="Editor">Editor</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 uppercase cursor-pointer"
                    >
                      Save Admin User
                    </button>
                  </div>
                </form>
              )}

              {/* Users Table list */}
              {!showAddForm && !editingItem && (
                <div className="overflow-x-auto rounded-xl border border-white/5">
                  <table className="w-full text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-mono text-left">
                      <tr>
                        <th className="p-3.5">Full Name</th>
                        <th className="p-3.5">Username</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Role</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {usersList.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-950/40">
                          <td className="p-3.5 font-bold text-white">{item.fullName}</td>
                          <td className="p-3.5 font-mono text-amber-500">{item.username}</td>
                          <td className="p-3.5">{item.email}</td>
                          <td className="p-3.5 text-slate-400">{item.role}</td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setUserInput({
                                  username: item.username,
                                  password: '',
                                  email: item.email,
                                  fullName: item.fullName,
                                  role: item.role
                                });
                              }}
                              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(item._id)}
                              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 8.5: FAQ MANAGER */}
          {activeTab === 'faqs' && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-slate-900">CMS FAQ Manager</h2>
                  <p className="text-xs text-slate-500 mt-1">Manage standard questions, direct taxation compliance, and GST info cards.</p>
                </div>
                {!showAddForm && !editingItem && (
                  <button
                    onClick={() => {
                      setShowAddForm(true);
                      setFaqInput({ question: '', answer: '', category: 'Taxation', isActive: true });
                    }}
                    className="px-4 py-2 text-xs font-bold rounded bg-indigo-900 hover:bg-indigo-800 text-white flex items-center gap-1 transition-all cursor-pointer shadow-sm font-mono uppercase"
                  >
                    <Plus size={14} />
                    <span>Create FAQ</span>
                  </button>
                )}
              </div>

              {/* FAQ Add/Edit Form */}
              {(showAddForm || editingItem) && (
                <form 
                  onSubmit={showAddForm ? handleAddFaqSubmit : handleUpdateFaqSubmit}
                  className="p-6 rounded bg-slate-950 border border-white/10 space-y-4 animate-fadeIn text-white"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">
                      {showAddForm ? "Create FAQ Entry" : `Edit FAQ Entry`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => { setShowAddForm(false); setEditingItem(null); }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">Question Title *</label>
                    <input
                      type="text"
                      required
                      value={faqInput.question}
                      onChange={(e) => setFaqInput({ ...faqInput, question: e.target.value })}
                      placeholder="e.g. What is the due date for individual ITR?"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">Detailed Answer *</label>
                    <textarea
                      required
                      rows={4}
                      value={faqInput.answer}
                      onChange={(e) => setFaqInput({ ...faqInput, answer: e.target.value })}
                      placeholder="Specify the complete advisory response clearly..."
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Category Segment *</label>
                      <select
                        value={faqInput.category}
                        onChange={(e) => setFaqInput({ ...faqInput, category: e.target.value })}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        <option value="Taxation">Taxation</option>
                        <option value="GST Compliance">GST Compliance</option>
                        <option value="Corporate ROC">Corporate ROC</option>
                        <option value="Audit & Advisory">Audit & Advisory</option>
                        <option value="General">General</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Status *</label>
                      <select
                        value={faqInput.isActive ? 'true' : 'false'}
                        onChange={(e) => setFaqInput({ ...faqInput, isActive: e.target.value === 'true' })}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        <option value="true">Active (Visible)</option>
                        <option value="false">Hidden (Draft)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold rounded bg-amber-500 hover:bg-amber-400 text-slate-950 uppercase cursor-pointer"
                    >
                      Save FAQ Entry
                    </button>
                  </div>
                </form>
              )}

              {/* FAQs Table List */}
              {!showAddForm && !editingItem && (
                faqsLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <div className="h-6 w-6 border-2 border-indigo-900 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-mono text-slate-400 font-bold uppercase">Loading FAQ Stream...</span>
                  </div>
                ) : faqsList.length === 0 ? (
                  <div className="p-8 border border-dashed border-slate-200 rounded text-center text-slate-400 text-xs">
                    No FAQs registered yet. Click "Create FAQ" to begin.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50">
                    <table className="w-full text-xs text-slate-700 font-sans">
                      <thead className="bg-slate-100 text-slate-600 font-mono text-left border-b border-slate-200">
                        <tr>
                          <th className="p-3.5">Category</th>
                          <th className="p-3.5">Question</th>
                          <th className="p-3.5">Answer Summary</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {faqsList.map((item, idx) => (
                          <tr key={item._id || idx} className="hover:bg-white bg-slate-50/50">
                            <td className="p-3.5">
                              <span className="text-[10px] font-mono font-bold text-indigo-900 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase">
                                {item.category}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold text-slate-900 max-w-xs truncate">{item.question}</td>
                            <td className="p-3.5 text-slate-500 max-w-md truncate">{item.answer}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${item.isActive !== false ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                {item.isActive !== false ? 'ACTIVE' : 'DRAFT'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setEditingItem(item);
                                  setFaqInput({
                                    question: item.question,
                                    answer: item.answer,
                                    category: item.category || 'Taxation',
                                    isActive: item.isActive !== false
                                  });
                                }}
                                className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-indigo-900 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteFaq(item._id)}
                                className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-red-600 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          )}

          {/* TAB 8.8: OUR JOURNEY TIMELINE MANAGER */}
          {activeTab === 'journey' && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-slate-900">Our Journey Timeline</h2>
                  <p className="text-xs text-slate-500 mt-1">Manage historic milestones and legacy achievements displayed on the home page.</p>
                </div>
                {!showAddForm && !editingItem && (
                  <button
                    onClick={() => {
                      setShowAddForm(true);
                      setJourneyInput({ year: '', title: '', description: '', iconName: 'Award' });
                    }}
                    className="px-4 py-2 text-xs font-bold rounded bg-indigo-900 hover:bg-indigo-800 text-white flex items-center gap-1 transition-all cursor-pointer shadow-sm font-mono uppercase"
                  >
                    <Plus size={14} />
                    <span>Add Milestone</span>
                  </button>
                )}
              </div>

              {/* Add / Edit Form */}
              {(showAddForm || editingItem) && (
                <form 
                  onSubmit={showAddForm ? handleAddJourneySubmit : handleUpdateJourneySubmit}
                  className="p-6 rounded bg-slate-950 border border-white/10 space-y-4 animate-fadeIn text-white"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">
                      {showAddForm ? "Add Journey Milestone" : "Edit Journey Milestone"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => { setShowAddForm(false); setEditingItem(null); }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Milestone Year *</label>
                      <input
                        type="text"
                        required
                        value={journeyInput.year}
                        onChange={(e) => setJourneyInput({ ...journeyInput, year: e.target.value })}
                        placeholder="e.g. 2012"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Visual Icon *</label>
                      <select
                        value={journeyInput.iconName}
                        onChange={(e) => setJourneyInput({ ...journeyInput, iconName: e.target.value })}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        <option value="Building2">Building (Establishment/Founding)</option>
                        <option value="TrendingUp">Trending Up (Growth/Digital)</option>
                        <option value="Shield">Shield (Resilience/Trust)</option>
                        <option value="Award">Award (Legacy/Achievement)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">Milestone Title *</label>
                    <input
                      type="text"
                      required
                      value={journeyInput.title}
                      onChange={(e) => setJourneyInput({ ...journeyInput, title: e.target.value })}
                      placeholder="e.g. Digital Integration"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 font-semibold">Detailed Description *</label>
                    <textarea
                      required
                      rows={4}
                      value={journeyInput.description}
                      onChange={(e) => setJourneyInput({ ...journeyInput, description: e.target.value })}
                      placeholder="Provide a high-quality explanation of the milestone achieved during this period..."
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white leading-relaxed font-sans"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-mono font-bold uppercase tracking-widest rounded shadow-md transition-all cursor-pointer"
                    >
                      {showAddForm ? "Publish Milestone" : "Save Milestone Changes"}
                    </button>
                  </div>
                </form>
              )}

              {/* Milestone List */}
              {!showAddForm && !editingItem && (
                journey.length === 0 ? (
                  <div className="p-12 border border-dashed border-slate-200 rounded text-center text-slate-400 text-xs font-sans">
                    No timeline milestones published yet. Click "Add Milestone" to populate your legacy journey.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50">
                    <table className="w-full text-xs text-slate-700 font-sans">
                      <thead className="bg-slate-100 text-slate-600 font-mono text-left border-b border-slate-200">
                        <tr>
                          <th className="p-3.5 w-24">Year</th>
                          <th className="p-3.5 w-32">Icon</th>
                          <th className="p-3.5">Milestone Title</th>
                          <th className="p-3.5">Description</th>
                          <th className="p-3.5 text-right w-24">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {journey.map((item, idx) => (
                          <tr key={item._id || idx} className="hover:bg-white bg-slate-50/50">
                            <td className="p-3.5 font-mono font-bold text-indigo-900">{item.year}</td>
                            <td className="p-3.5">
                              <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-200/60 border border-slate-200 px-2 py-0.5 rounded uppercase">
                                {item.iconName || 'Award'}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold text-slate-900">{item.title}</td>
                            <td className="p-3.5 text-slate-500 max-w-sm truncate" title={item.description}>{item.description}</td>
                            <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setEditingItem(item);
                                  setJourneyInput({
                                    year: item.year,
                                    title: item.title,
                                    description: item.description,
                                    iconName: item.iconName || 'Award'
                                  });
                                }}
                                className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-indigo-900 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteJourney(item._id)}
                                className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-red-600 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          )}

          {/* TAB 8.9: TRUSTED PARTNERS MANAGER */}
          {activeTab === 'partners' && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-slate-900">Trusted Partners & Client Logos</h2>
                  <p className="text-xs text-slate-500 mt-1">Manage partner logos, corporate affiliations, and associations displayed on the home page.</p>
                </div>
                {!showAddForm && !editingItem && (
                  <button
                    onClick={() => {
                      setShowAddForm(true);
                      setPartnerInput({ name: '', logoUrl: '', websiteUrl: '' });
                    }}
                    className="px-4 py-2 text-xs font-bold rounded bg-indigo-900 hover:bg-indigo-800 text-white flex items-center gap-1 transition-all cursor-pointer shadow-sm font-mono uppercase"
                  >
                    <Plus size={14} />
                    <span>Add Partner Logo</span>
                  </button>
                )}
              </div>

              {/* Add / Edit Form */}
              {(showAddForm || editingItem) && (
                <form 
                  onSubmit={showAddForm ? handleAddPartnerSubmit : handleUpdatePartnerSubmit}
                  className="p-6 rounded bg-slate-950 border border-white/10 space-y-4 animate-fadeIn text-white"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">
                      {showAddForm ? "Add New Trusted Partner" : "Edit Trusted Partner"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => { setShowAddForm(false); setEditingItem(null); }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Partner Name *</label>
                      <input
                        type="text"
                        required
                        value={partnerInput.name}
                        onChange={(e) => setPartnerInput({ ...partnerInput, name: e.target.value })}
                        placeholder="e.g. Tally Solutions"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Website URL (Optional)</label>
                      <input
                        type="url"
                        value={partnerInput.websiteUrl}
                        onChange={(e) => setPartnerInput({ ...partnerInput, websiteUrl: e.target.value })}
                        placeholder="e.g. https://example.com"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400 font-semibold block">Logo Image *</label>
                    <div className="flex items-start gap-4 flex-col sm:flex-row">
                      {partnerInput.logoUrl && (
                        <div className="p-2 rounded bg-white border border-white/20">
                          <img 
                            src={partnerInput.logoUrl} 
                            alt="Preview" 
                            className="h-16 w-32 object-contain bg-slate-100 p-1 rounded" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div className="flex-grow space-y-2 w-full">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Direct Image URL (or upload below)"
                            value={partnerInput.logoUrl}
                            onChange={(e) => setPartnerInput({ ...partnerInput, logoUrl: e.target.value })}
                            className="flex-grow bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              setPartnerLogoUploading(true);
                              handleImageUpload(e, (base64) => {
                                setPartnerInput(prev => ({ ...prev, logoUrl: base64 }));
                                setPartnerLogoUploading(false);
                              });
                            }}
                            className="hidden"
                            id="partner-logo-file"
                          />
                          <label
                            htmlFor="partner-logo-file"
                            className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 border border-white/10 text-white text-xs font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors inline-block"
                          >
                            {partnerLogoUploading ? 'Uploading...' : 'Upload Image File'}
                          </label>
                          <span className="text-[10px] text-slate-500 font-sans">PNG/JPG up to 5MB. Prefer horizontal logos.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={partnerLogoUploading}
                      className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-mono font-bold uppercase tracking-widest rounded shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      {showAddForm ? "Publish Partner Logo" : "Save Partner Changes"}
                    </button>
                  </div>
                </form>
              )}

              {/* Partner Logos List */}
              {!showAddForm && !editingItem && (
                partners.length === 0 ? (
                  <div className="p-12 border border-dashed border-slate-200 rounded text-center text-slate-400 text-xs font-sans">
                    No trusted partners published yet. Click "Add Partner Logo" to showcase client brands or organizations.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {partners.map((partner, idx) => (
                      <div 
                        key={partner._id || idx} 
                        className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-900/30 transition-all duration-300 hover:shadow-md flex flex-col justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 bg-white rounded border border-slate-100 flex items-center justify-center p-2 shrink-0">
                            {partner.logoUrl ? (
                              <img 
                                src={partner.logoUrl} 
                                alt={partner.name} 
                                className="h-full w-full object-contain" 
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="h-full w-full rounded bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs font-mono">
                                LOGO
                              </div>
                            )}
                          </div>
                          <div className="space-y-1 overflow-hidden">
                            <h4 className="font-bold text-sm text-slate-900 truncate" title={partner.name}>{partner.name}</h4>
                            {partner.websiteUrl ? (
                              <a 
                                href={partner.websiteUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1 hover:underline truncate"
                              >
                                <span>Visit Website</span>
                                <ExternalLink size={10} />
                              </a>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">No website specified</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3.5 mt-4">
                          <button
                            onClick={() => {
                              setEditingItem(partner);
                              setPartnerInput({
                                name: partner.name,
                                logoUrl: partner.logoUrl,
                                websiteUrl: partner.websiteUrl || ''
                              });
                            }}
                            className="px-3 py-1.5 text-[11px] font-mono font-bold text-indigo-900 hover:bg-indigo-50 border border-indigo-200 rounded transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 size={11} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeletePartner(partner._id)}
                            className="px-3 py-1.5 text-[11px] font-mono font-bold text-red-600 hover:bg-red-50 border border-red-200 rounded transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 size={11} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}

          {/* TAB 9: AUDIT LOGS VIEW */}
          {activeTab === 'audit_logs' && (
            <div className="space-y-6 text-left">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl font-bold font-display text-slate-900">Security & Action Audit Logs</h2>
                <p className="text-xs text-slate-500 mt-1">Real-time track records of settings, CMS content updates, and modifications.</p>
              </div>

              {auditLogsLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <div className="h-6 w-6 border-2 border-indigo-900 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono text-slate-400 font-bold uppercase">Streaming Security Log entries...</span>
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="p-12 border border-dashed border-slate-200 rounded text-center text-slate-400 text-xs font-sans">
                  No administrative actions logged in this session yet.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50">
                  <table className="w-full text-xs text-slate-700 font-sans">
                    <thead className="bg-slate-100 text-slate-600 font-mono text-left border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Action Code</th>
                        <th className="p-3.5">Target/Module</th>
                        <th className="p-3.5">Action Details</th>
                        <th className="p-3.5">Performed By</th>
                        <th className="p-3.5">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {auditLogs.slice().reverse().map((log, idx) => (
                        <tr key={log._id || idx} className="hover:bg-white bg-slate-50/50">
                          <td className="p-3.5 font-mono font-bold text-slate-900">
                            <span className="px-2 py-0.5 bg-slate-200 rounded text-slate-800">
                              {log.action}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="text-[10px] font-mono font-bold text-indigo-900 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase">
                              {log.target}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600 max-w-sm truncate" title={log.details}>
                            {log.details}
                          </td>
                          <td className="p-3.5 font-mono text-amber-700 font-semibold">{log.performedBy || 'System Admin'}</td>
                          <td className="p-3.5 text-slate-400 font-mono">
                            {new Date(log.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
