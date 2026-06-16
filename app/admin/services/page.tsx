'use client';

import { useState, useEffect, useRef } from 'react';

interface PricingTier {
  id: string;
  price_per_person: number;
  child_price?: number;
  min_passengers: number;
  max_passengers: number;
  label?: string;
}

interface ServiceRow {
  id: string;
  title_en: string;
  title_es: string;
  slug_en: string;
  slug_es: string;
  description_en: string;
  description_es: string;
  category: string;
  status: string;
  featured: boolean;
  is_per_person: boolean;
  child_price_enabled: boolean;
  has_open_bar: boolean;
  featured_image: string;
  gallery_images: string[];
  duration_minutes: number;
  base_capacity: number;
  extra_person_price: number | string | null;
  inclusions_en: string[];
  inclusions_es: string[];
  exclusions_en: string[];
  exclusions_es: string[];
  pricing_tiers: PricingTier[];
}

const minutesToHoursInput = (minutes?: number) => {
  if (minutes === null || minutes === undefined || minutes === 0) return '';
  return Number((minutes / 60).toFixed(2));
};

const hoursToMinutes = (hours: string) => Math.round((Number(hours) || 0) * 60);

const formatDurationHours = (minutes?: number) => {
  if (minutes === null || minutes === undefined) return '—';
  if (minutes === 0) return 'All Day';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServiceRow> & { price_per_person?: number | string; child_price?: number | string; extra_person_price?: number | string; pricing_packages?: {label: string; price: number | string; child_price: number | string}[] }>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    title_en: '', title_es: '', description_en: '', description_es: '',
    category: 'excursion', featured_image: '', duration_minutes: 240,
    price_per_person: '' as number | string, child_price: '' as number | string, featured: false, is_per_person: true, child_price_enabled: true, has_open_bar: false, base_capacity: 20,
    extra_person_price: '' as number | string,
    inclusions_en: '', exclusions_en: '',
    pricing_packages: [{label: '', price: '' as number | string, child_price: '' as number | string}] as {label: string; price: number | string; child_price: number | string}[],
  });
  const [filter, setFilter] = useState<'all' | 'tour' | 'excursion' | 'transfer'>('all');

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch(`/api/admin/services?t=${Date.now()}`, {
        cache: 'no-store',
        credentials: 'same-origin',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load services');
      }
      setServices(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Failed to load services' });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (s: ServiceRow) => {
    setEditingId(s.id);
    const packages = (s.pricing_tiers || []).map(t => ({
      label: t.label || '',
      price: t.price_per_person || '' as number | string,
      child_price: t.child_price || '' as number | string,
    }));
    setEditForm({
      title_en: s.title_en,
      title_es: s.title_es,
      description_en: s.description_en,
      description_es: s.description_es,
      category: s.category,
      status: s.status,
      featured: s.featured,
      is_per_person: s.is_per_person ?? s.category !== 'transfer',
      child_price_enabled: s.child_price_enabled ?? s.category !== 'transfer',
      has_open_bar: s.has_open_bar ?? false,
      featured_image: s.featured_image,
      duration_minutes: s.duration_minutes,
      base_capacity: s.base_capacity,
      extra_person_price: (s.extra_person_price ?? '') as any,
      inclusions_en: s.inclusions_en,
      exclusions_en: s.exclusions_en,
      price_per_person: s.pricing_tiers?.[0]?.price_per_person || '',
      child_price: s.pricing_tiers?.[0]?.child_price || '',
      pricing_packages: packages.length > 0 ? packages : [{label: '', price: '', child_price: ''}],
    });
  };

  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      const { pricing_packages, ...rest } = editForm;
      const payload: any = { id: editingId, ...rest };
      if (pricing_packages && pricing_packages.length > 0) {
        payload.pricing_packages = pricing_packages.filter(p => Number(p.price) > 0).map(p => ({
          label: p.label || null,
          price_per_person: Number(p.price) || 0,
          child_price: editForm.child_price_enabled ? (Number(p.child_price) || Math.round((Number(p.price) || 0) * 0.7)) : null,
        }));
        // Keep backward compat: set main price from first package
        if (payload.pricing_packages.length > 0) {
          payload.price_per_person = payload.pricing_packages[0].price_per_person;
          payload.child_price = payload.pricing_packages[0].child_price;
        }
      }
      const res = await fetch('/api/admin/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update');
      }
      if (data.success) {
        setMessage({ type: 'success', text: 'Service updated!' });
        if (data.service) {
          setServices(prev => prev.map(service => service.id === data.service.id ? data.service : service));
        } else {
          await fetchServices();
        }
        setEditingId(null);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const addService = async () => {
    setSaving(true);
    try {
      const packages = newService.pricing_packages.filter(p => Number(p.price) > 0).map(p => ({
        label: p.label || null,
        price_per_person: Number(p.price) || 0,
        child_price: newService.child_price_enabled ? (Number(p.child_price) || Math.round((Number(p.price) || 0) * 0.7)) : null,
      }));
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          ...newService,
          price_per_person: packages[0]?.price_per_person || Number(newService.price_per_person) || 0,
          child_price: packages[0]?.child_price ?? (newService.child_price_enabled ? (Number(newService.child_price) || Math.round(Number(newService.price_per_person) * 0.7)) : null),
          pricing_packages: packages.length > 0 ? packages : undefined,
          inclusions_en: newService.inclusions_en.split(',').map(s => s.trim()).filter(Boolean),
          exclusions_en: newService.exclusions_en.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create');
      }
      if (data.success) {
        setMessage({ type: 'success', text: 'Service created!' });
        setShowAddForm(false);
        setNewService({ title_en: '', title_es: '', description_en: '', description_es: '', category: 'excursion', featured_image: '', duration_minutes: 240, price_per_person: '', child_price: '', featured: false, is_per_person: true, child_price_enabled: true, has_open_bar: false, base_capacity: 20, extra_person_price: '', inclusions_en: '', exclusions_en: '', pricing_packages: [{label: '', price: '', child_price: ''}] });
        if (data.service) {
          setServices(prev => [data.service, ...prev]);
        } else {
          await fetchServices();
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const deleteService = async (id: string, name: string) => {
    if (!confirm(`Deactivate "${name}"? It will be hidden from the public site.`)) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to deactivate');
      }
      if (data.success) {
        setMessage({ type: 'success', text: 'Service deactivated' });
        if (data.service) {
          setServices(prev => prev.map(service => service.id === data.service.id ? data.service : service));
        } else {
          await fetchServices();
        }
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const reactivate = async (id: string) => {
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ id, status: 'active' }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reactivate');
      }
      if (data.success) {
        setMessage({ type: 'success', text: 'Reactivated!' });
        if (data.service) {
          setServices(prev => prev.map(service => service.id === data.service.id ? data.service : service));
        } else {
          await fetchServices();
        }
      }
    } catch (e: any) { setMessage({ type: 'error', text: e.message }); }
    setTimeout(() => setMessage(null), 3000);
  };

  const filtered = filter === 'all' ? services : services.filter(s => s.category === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">Loading services...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Manage Services</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          {showAddForm ? 'Cancel' : '+ Add New Service'}
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Add New Service Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 border-2 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-4">Add New Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title (English) *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={newService.title_en} onChange={e => setNewService({...newService, title_en: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title (Spanish)</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={newService.title_es} onChange={e => setNewService({...newService, title_es: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description (English)</label>
              <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} value={newService.description_en} onChange={e => setNewService({...newService, description_en: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description (Spanish)</label>
              <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} value={newService.description_es} onChange={e => setNewService({...newService, description_es: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm" value={newService.category} onChange={e => {
                const category = e.target.value;
                setNewService({
                  ...newService,
                  category,
                  is_per_person: category !== 'transfer',
                  child_price_enabled: category !== 'transfer',
                });
              }}>
                <option value="tour">Tour</option>
                <option value="excursion">Excursion</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
            {/* Pricing */}
            {newService.pricing_packages.length <= 1 ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Adult Price ($)</label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={newService.pricing_packages[0]?.price || ''}
                    onChange={e => {
                      const packages = [...newService.pricing_packages];
                      packages[0] = {...(packages[0] || {label: '', child_price: ''}), price: e.target.value};
                      setNewService({...newService, pricing_packages: packages});
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Child Price (up to 12 yrs) ($)</label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 disabled:text-gray-400"
                    value={newService.pricing_packages[0]?.child_price || ''}
                    onChange={e => {
                      const packages = [...newService.pricing_packages];
                      packages[0] = {...(packages[0] || {label: '', price: ''}), child_price: e.target.value};
                      setNewService({...newService, pricing_packages: packages});
                    }}
                    disabled={!newService.child_price_enabled}
                  />
                  <p className="text-xs text-gray-500 mt-1">Auto-calculated as 70% if left empty</p>
                </div>
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={() => setNewService({...newService, pricing_packages: [...newService.pricing_packages, {label: '', price: '', child_price: ''}]})}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >+ Add another pricing option (e.g. Dolphins packages)</button>
                </div>
              </>
            ) : (
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-2">Pricing Packages</label>
                <div className="space-y-2">
                  {newService.pricing_packages.map((pkg, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <input type="text" placeholder="Package name" className="flex-1 border rounded-lg px-3 py-2 text-sm" value={pkg.label} onChange={e => { const p = [...newService.pricing_packages]; p[idx] = {...p[idx], label: e.target.value}; setNewService({...newService, pricing_packages: p}); }} />
                      <input type="number" placeholder="Adult $" className="w-24 border rounded-lg px-3 py-2 text-sm" value={pkg.price || ''} onChange={e => { const p = [...newService.pricing_packages]; p[idx] = {...p[idx], price: e.target.value}; setNewService({...newService, pricing_packages: p}); }} />
                      {newService.child_price_enabled && (
                        <input type="number" placeholder="Child $" className="w-24 border rounded-lg px-3 py-2 text-sm" value={pkg.child_price || ''} onChange={e => { const p = [...newService.pricing_packages]; p[idx] = {...p[idx], child_price: e.target.value}; setNewService({...newService, pricing_packages: p}); }} />
                      )}
                      <button type="button" onClick={() => setNewService({...newService, pricing_packages: newService.pricing_packages.filter((_, i) => i !== idx)})} className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-lg font-bold">×</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setNewService({...newService, pricing_packages: [...newService.pricing_packages, {label: '', price: '', child_price: ''}]})} className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Add pricing option</button>
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
              <div className="flex items-center gap-2">
                <select
                  className="border rounded-lg px-3 py-2 text-sm"
                  value={newService.duration_minutes === null || newService.duration_minutes === undefined ? 'none' : newService.duration_minutes === 0 ? 'allday' : 'custom'}
                  onChange={e => {
                    const v = e.target.value;
                    setNewService({...newService, duration_minutes: v === 'none' ? (null as any) : v === 'allday' ? 0 : 240});
                  }}
                >
                  <option value="none">None</option>
                  <option value="custom">Hours</option>
                  <option value="allday">All Day</option>
                </select>
                {newService.duration_minutes !== null && newService.duration_minutes !== undefined && newService.duration_minutes !== 0 && (
                  <>
                    <input type="number" min="0" placeholder="hrs" className="w-16 border rounded-lg px-2 py-2 text-sm" value={Math.floor((newService.duration_minutes || 0) / 60) || ''} onChange={e => setNewService({...newService, duration_minutes: (Number(e.target.value) || 0) * 60 + ((newService.duration_minutes || 0) % 60)})} />
                    <span className="text-xs text-gray-500">h</span>
                    <input type="number" min="0" max="59" step="5" placeholder="min" className="w-16 border rounded-lg px-2 py-2 text-sm" value={(newService.duration_minutes || 0) % 60 || ''} onChange={e => setNewService({...newService, duration_minutes: Math.floor((newService.duration_minutes || 0) / 60) * 60 + (Number(e.target.value) || 0)})} />
                    <span className="text-xs text-gray-500">min</span>
                  </>
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Featured Image</label>
              <div className="flex items-center gap-3">
                {newService.featured_image && (
                  <img src={newService.featured_image} alt="Preview" className="w-16 h-16 rounded object-cover border" />
                )}
                <label className="cursor-pointer px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium">
                  Choose Image
                  <input type="file" accept="image/*" className="hidden" onChange={async e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const form = new FormData();
                    form.append('file', file);
                    const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
                    const data = await res.json();
                    if (data.success) setNewService({...newService, featured_image: data.url});
                  }} />
                </label>
                <input className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder="/images/excursions/example.png" value={newService.featured_image} onChange={e => setNewService({...newService, featured_image: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Max Capacity</label>
              <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" value={newService.base_capacity} onChange={e => setNewService({...newService, base_capacity: Number(e.target.value)})} />
            </div>
            {newService.category === 'transfer' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Extra Person Price ($)</label>
                <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. 10" value={newService.extra_person_price || ''} onChange={e => setNewService({...newService, extra_person_price: e.target.value})} />
                <p className="text-xs text-gray-500 mt-1">Cost per additional passenger beyond base (1-4 pax)</p>
              </div>
            )}
            <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <input type="checkbox" checked={newService.featured} onChange={e => setNewService({...newService, featured: e.target.checked})} />
              <label className="text-sm text-gray-700">⭐ Show on Homepage (Featured)</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={newService.is_per_person} onChange={e => setNewService({...newService, is_per_person: e.target.checked})} />
              <label className="text-sm text-gray-700">Price is per person</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={newService.child_price_enabled} onChange={e => setNewService({...newService, child_price_enabled: e.target.checked})} />
              <label className="text-sm text-gray-700">Child pricing available</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={newService.has_open_bar} onChange={e => setNewService({...newService, has_open_bar: e.target.checked})} />
              <label className="text-sm text-gray-700">Open bar included</label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Inclusions (comma-separated)</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Transportation, Lunch, Guide" value={newService.inclusions_en} onChange={e => setNewService({...newService, inclusions_en: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Exclusions (comma-separated)</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Tips, Personal items" value={newService.exclusions_en} onChange={e => setNewService({...newService, exclusions_en: e.target.value})} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={addService} disabled={saving || !newService.title_en} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-50">
              {saving ? 'Creating...' : 'Create Service'}
            </button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'tour', 'excursion', 'transfer'] as const).map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${filter === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {cat} {cat !== 'all' && `(${services.filter(s => s.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(service => (
                <tr key={service.id} className={`hover:bg-gray-50 ${service.status !== 'active' ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={service.featured_image || '/images/placeholder.svg'} alt="" className="w-10 h-10 rounded object-cover" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{service.title_en}</div>
                        <div className="text-xs text-gray-500">{service.title_es}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">{service.category}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    <div>
                      <div>Adult: ${service.pricing_tiers?.[0]?.price_per_person || 0}</div>
                      <div className="text-xs text-gray-500">Child: {service.child_price_enabled ? `$${service.pricing_tiers?.[0]?.child_price || 0}` : 'N/A'}</div>
                      <div className="text-xs text-gray-500">{service.is_per_person ? 'Per person' : 'Flat price'}</div>
                      {service.has_open_bar && <div className="text-xs text-blue-600">Open bar</div>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDurationHours(service.duration_minutes)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{service.status}</span>
                    {service.featured && <span className="ml-1 px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">★</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => startEdit(service)} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 font-medium">Edit</button>
                      {service.status === 'active' ? (
                        <button onClick={() => deleteService(service.id, service.title_en)} className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 font-medium">Deactivate</button>
                      ) : (
                        <button onClick={() => reactivate(service.id)} className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 font-medium">Activate</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={cancelEdit}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold">Edit Service</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title (English)</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" value={editForm.title_en || ''} onChange={e => setEditForm({...editForm, title_en: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title (Spanish)</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" value={editForm.title_es || ''} onChange={e => setEditForm({...editForm, title_es: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Description (English)</label>
                <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} value={editForm.description_en || ''} onChange={e => setEditForm({...editForm, description_en: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Description (Spanish)</label>
                <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} value={editForm.description_es || ''} onChange={e => setEditForm({...editForm, description_es: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm" value={editForm.category || ''} onChange={e => {
                  const category = e.target.value;
                  setEditForm({
                    ...editForm,
                    category,
                    is_per_person: category !== 'transfer',
                    child_price_enabled: category !== 'transfer',
                  });
                }}>
                  <option value="tour">Tour</option>
                  <option value="excursion">Excursion</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              {/* Pricing */}
              {(editForm.pricing_packages || []).length <= 1 ? (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Adult Price ($)</label>
                    <input
                      type="number"
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={(editForm.pricing_packages || [])[0]?.price || ''}
                      onChange={e => {
                        const packages = [...(editForm.pricing_packages || [{label: '', price: '', child_price: ''}])];
                        packages[0] = {...packages[0], price: e.target.value};
                        setEditForm({...editForm, pricing_packages: packages});
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Child Price (up to 12 yrs) ($)</label>
                    <input
                      type="number"
                      className="w-full border rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 disabled:text-gray-400"
                      value={(editForm.pricing_packages || [])[0]?.child_price || ''}
                      onChange={e => {
                        const packages = [...(editForm.pricing_packages || [{label: '', price: '', child_price: ''}])];
                        packages[0] = {...packages[0], child_price: e.target.value};
                        setEditForm({...editForm, pricing_packages: packages});
                      }}
                      disabled={!editForm.child_price_enabled}
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-calculated as 70% if left empty</p>
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={() => setEditForm({...editForm, pricing_packages: [...(editForm.pricing_packages || [{label: '', price: '', child_price: ''}]), {label: '', price: '', child_price: ''}]})}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >+ Add another pricing option (e.g. Dolphins packages)</button>
                  </div>
                </>
              ) : (
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-2">Pricing Packages</label>
                  <div className="space-y-2">
                    {(editForm.pricing_packages || []).map((pkg, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <input type="text" placeholder="Package name" className="flex-1 border rounded-lg px-3 py-2 text-sm" value={pkg.label} onChange={e => { const p = [...(editForm.pricing_packages || [])]; p[idx] = {...p[idx], label: e.target.value}; setEditForm({...editForm, pricing_packages: p}); }} />
                        <input type="number" placeholder="Adult $" className="w-24 border rounded-lg px-3 py-2 text-sm" value={pkg.price || ''} onChange={e => { const p = [...(editForm.pricing_packages || [])]; p[idx] = {...p[idx], price: e.target.value}; setEditForm({...editForm, pricing_packages: p}); }} />
                        {editForm.child_price_enabled && (
                          <input type="number" placeholder="Child $" className="w-24 border rounded-lg px-3 py-2 text-sm" value={pkg.child_price || ''} onChange={e => { const p = [...(editForm.pricing_packages || [])]; p[idx] = {...p[idx], child_price: e.target.value}; setEditForm({...editForm, pricing_packages: p}); }} />
                        )}
                        <button type="button" onClick={() => setEditForm({...editForm, pricing_packages: (editForm.pricing_packages || []).filter((_, i) => i !== idx)})} className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-lg font-bold">×</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setEditForm({...editForm, pricing_packages: [...(editForm.pricing_packages || []), {label: '', price: '', child_price: ''}]})} className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Add pricing option</button>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
                <div className="flex items-center gap-2">
                  <select
                    className="border rounded-lg px-3 py-2 text-sm"
                    value={editForm.duration_minutes === null || editForm.duration_minutes === undefined ? 'none' : editForm.duration_minutes === 0 ? 'allday' : 'custom'}
                    onChange={e => {
                      const v = e.target.value;
                      setEditForm({...editForm, duration_minutes: v === 'none' ? (null as any) : v === 'allday' ? 0 : 240});
                    }}
                  >
                    <option value="none">None</option>
                    <option value="custom">Hours</option>
                    <option value="allday">All Day</option>
                  </select>
                  {editForm.duration_minutes !== null && editForm.duration_minutes !== undefined && editForm.duration_minutes !== 0 && (
                    <>
                      <input type="number" min="0" placeholder="hrs" className="w-16 border rounded-lg px-2 py-2 text-sm" value={Math.floor((editForm.duration_minutes || 0) / 60) || ''} onChange={e => setEditForm({...editForm, duration_minutes: (Number(e.target.value) || 0) * 60 + ((editForm.duration_minutes || 0) % 60)})} />
                      <span className="text-xs text-gray-500">h</span>
                      <input type="number" min="0" max="59" step="5" placeholder="min" className="w-16 border rounded-lg px-2 py-2 text-sm" value={(editForm.duration_minutes || 0) % 60 || ''} onChange={e => setEditForm({...editForm, duration_minutes: Math.floor((editForm.duration_minutes || 0) / 60) * 60 + (Number(e.target.value) || 0)})} />
                      <span className="text-xs text-gray-500">min</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Max Capacity</label>
                <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" value={editForm.base_capacity || ''} onChange={e => setEditForm({...editForm, base_capacity: Number(e.target.value)})} />
              </div>
              {editForm.category === 'transfer' && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Extra Person Price ($)</label>
                  <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. 10" value={editForm.extra_person_price || ''} onChange={e => setEditForm({...editForm, extra_person_price: e.target.value})} />
                  <p className="text-xs text-gray-500 mt-1">Cost per additional passenger beyond base (1-4 pax)</p>
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Featured Image</label>
                <div className="flex items-center gap-3">
                  {editForm.featured_image && (
                    <img src={editForm.featured_image} alt="Preview" className="w-16 h-16 rounded object-cover border" />
                  )}
                  <label className="cursor-pointer px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium">
                    Choose Image
                    <input type="file" accept="image/*" className="hidden" onChange={async e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const form = new FormData();
                      form.append('file', file);
                      const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
                      const data = await res.json();
                      if (data.success) setEditForm({...editForm, featured_image: data.url});
                    }} />
                  </label>
                  <input className="flex-1 border rounded-lg px-3 py-2 text-sm" value={editForm.featured_image || ''} onChange={e => setEditForm({...editForm, featured_image: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm" value={editForm.status || 'active'} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={editForm.featured || false} onChange={e => setEditForm({...editForm, featured: e.target.checked})} />
                <label className="text-sm text-gray-700">Featured on homepage</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={editForm.is_per_person ?? true} onChange={e => setEditForm({...editForm, is_per_person: e.target.checked})} />
                <label className="text-sm text-gray-700">Price is per person</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={editForm.child_price_enabled ?? true} onChange={e => setEditForm({...editForm, child_price_enabled: e.target.checked})} />
                <label className="text-sm text-gray-700">Child pricing available</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={editForm.has_open_bar || false} onChange={e => setEditForm({...editForm, has_open_bar: e.target.checked})} />
                <label className="text-sm text-gray-700">Open bar included</label>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-2 sticky bottom-0 bg-white">
              <button onClick={cancelEdit} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">Cancel</button>
              <button onClick={saveEdit} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
