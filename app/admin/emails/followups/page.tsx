'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  source: string;
  status: string;
  created_at: string;
}

export default function FollowUpEmails() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactedLeads();
  }, []);

  const fetchContactedLeads = async () => {
    try {
      const res = await fetch('/api/admin/leads?status=contacted');
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-deep-navy">Customer Follow-up Emails</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-medium text-deep-navy mb-4">Send Follow-up Email</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-gray mb-1">
                Customer Email
              </label>
              <input
                type="email"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="customer@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-gray mb-1">
                Template
              </label>
              <select className="w-full border rounded-lg px-3 py-2">
                <option>Select a template</option>
                <option>Post-booking feedback request</option>
                <option>Special offer for return customers</option>
                <option>Thank you for your visit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-gray mb-1">
                Subject
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter email subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-gray mb-1">
                Message
              </label>
              <textarea
                rows={6}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter your message"
              />
            </div>

            <div className="flex justify-end">
              <Button variant="primary" type="submit">
                Send Follow-up
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-deep-navy mb-4">Follow-up Templates</h3>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-deep-navy">Feedback Request</h4>
              <p className="text-sm text-slate-gray mt-1">Request feedback after service completion</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-deep-navy">Thank You</h4>
              <p className="text-sm text-slate-gray mt-1">Thank customers for their business</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-deep-navy">Special Offer</h4>
              <p className="text-sm text-slate-gray mt-1">Offer discounts for return customers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-deep-navy mb-4">Contacted Leads</h3>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No contacted leads yet. Mark leads as &quot;Contacted&quot; from the Communications Hub.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-gray uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-gray uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-gray uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-gray uppercase tracking-wider">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        lead.source === 'booking' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {lead.source === 'booking' ? 'Booking' : 'Contact'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
