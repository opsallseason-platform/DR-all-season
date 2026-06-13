'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Booking = {
  id: string;
  booking_reference: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  service_date: string;
  service_time: string;
  num_passengers: number;
  booking_status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  payment_status: 'paid' | 'pending' | 'failed' | 'refunded';
  total_amount: number;
  special_requests: string;
  flight_number: string | null;
  airline: string | null;
  services?: { title_en: string; title_es: string; category: string };
};

export default function BookingsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState<Booking | null>(null);
  const [showManualBooking, setShowManualBooking] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [services, setServices] = useState<{id: string; title: string; slug: string; category: string; price: number}[]>([]);
  const [manualForm, setManualForm] = useState({
    serviceIds: [] as string[],
    serviceDate: '',
    serviceTime: '',
    numPassengers: 1,
    customerFirstName: '',
    customerLastName: '',
    customerEmail: '',
    customerPhone: '',
    customerHotel: '',
    specialRequests: '',
    flightNumber: '',
    airline: '',
  });
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);
  const [manualSuccess, setManualSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, page]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchBookings();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (searchQuery) params.set('search', searchQuery);
      params.set('page', String(page));
      params.set('limit', '20');

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setBookings(data.bookings);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / 20);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  const handleConfirm = async (booking: Booking) => {
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: booking.id, booking_status: 'confirmed' }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, booking_status: 'confirmed' } : b));
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  const handleArchive = async (booking: Booking) => {
    try {
      const res = await fetch(`/api/admin/bookings?id=${booking.id}&action=archive`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.filter(b => b.id !== booking.id));
        setShowArchiveDialog(null);
      }
    } catch (error) {
      console.error('Error archiving booking:', error);
    }
  };

  const handlePermanentDelete = async (booking: Booking) => {
    try {
      const res = await fetch(`/api/admin/bookings?id=${booking.id}&action=delete`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.filter(b => b.id !== booking.id));
        setShowArchiveDialog(null);
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Manage and track all customer reservations</p>
        </div>
        <button
          onClick={() => {
            setShowManualBooking(true);
            setManualError(null);
            setManualSuccess(null);
            // Load services for dropdown
            fetch('/api/services').then(r => r.json()).then(data => {
              if (Array.isArray(data)) setServices(data.map((s: any) => ({ id: s.id, title: s.title || s.title_en, slug: s.slug, category: s.category, price: s.price || 0 })));
            });
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Reservation
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {bookings.filter(b => b.booking_status === 'confirmed').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {bookings.filter(b => b.booking_status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {bookings.filter(b => b.booking_status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by reference, customer, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-teal focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-teal focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-3 text-gray-600">Loading bookings...</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="font-medium">No bookings found</p>
            <p className="text-sm mt-1">Bookings will appear here once customers make reservations.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{booking.booking_reference}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.customer_first_name} {booking.customer_last_name}
                          </div>
                          <div className="text-sm text-gray-500">{booking.customer_email}</div>
                          {booking.customer_phone && (
                            <div className="text-sm text-gray-500">{booking.customer_phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {booking.services?.title_en || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {booking.services?.category === 'transfer' && (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                              ✈️ Airport Transfer
                            </span>
                          )}
                          {booking.flight_number && (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-sky-100 text-sky-700">
                              {booking.airline ? `${booking.airline} ` : ''}#{booking.flight_number}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.service_date}</div>
                        <div className="text-sm text-gray-500">{booking.service_time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.num_passengers}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.booking_status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.booking_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : booking.booking_status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(Number(booking.total_amount))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          {booking.booking_status === 'pending' && (
                            <button
                              onClick={() => handleConfirm(booking)}
                              className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                              title="Confirm Booking"
                            >
                              Confirm
                            </button>
                          )}
                          {booking.customer_phone && (
                            <>
                              <a
                                href={`tel:${booking.customer_phone}`}
                                className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center space-x-1"
                                title={`Call ${booking.customer_phone}`}
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>Call</span>
                              </a>
                              <button
                                onClick={() => { navigator.clipboard.writeText(booking.customer_phone); }}
                                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center space-x-1"
                                title="Copy number to clipboard"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                <span>Copy</span>
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="text-caribbean-teal hover:text-caribbean-teal-dark"
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <Link
                            href={`/admin/bookings/${booking.id}/edit`}
                            className="text-gray-600 hover:text-gray-900"
                            title="Edit Booking"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => setShowArchiveDialog(booking)}
                            className="text-red-400 hover:text-red-600"
                            title="Delete / Archive"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 md:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{bookings.length}</span> of <span className="font-medium">{total}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Page {page} of {totalPages || 1}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Booking Details - {selectedBooking.booking_reference}</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {emailStatus && (
                <div className={`p-3 rounded-lg border ${
                  emailStatus.type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  {emailStatus.message}
                </div>
              )}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Customer Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Name</label>
                    <p className="text-sm font-medium text-gray-900">{selectedBooking.customer_first_name} {selectedBooking.customer_last_name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Email</label>
                    <p className="text-sm font-medium text-gray-900">{selectedBooking.customer_email}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Phone</label>
                    <p className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                      <span>{selectedBooking.customer_phone || 'N/A'}</span>
                      {selectedBooking.customer_phone && (
                        <>
                          <a
                            href={`tel:${selectedBooking.customer_phone}`}
                            className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call
                          </a>
                          <button
                            onClick={() => { navigator.clipboard.writeText(selectedBooking.customer_phone); }}
                            className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                            title="Copy number"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            Copy
                          </button>
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Guests</label>
                    <p className="text-sm font-medium text-gray-900">{selectedBooking.num_passengers} persons</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Service Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500">Service</label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{selectedBooking.services?.title_en || 'N/A'}</p>
                      {selectedBooking.services?.category === 'transfer' && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                          ✈️ Airport Transfer
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Date</label>
                    <p className="text-sm font-medium text-gray-900">{selectedBooking.service_date}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Time</label>
                    <p className="text-sm font-medium text-gray-900">{selectedBooking.service_time}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Booking Status & Amount</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Amount (paid on arrival)</label>
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(Number(selectedBooking.total_amount))}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Booking Status</label>
                    <p className="text-sm">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedBooking.booking_status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : selectedBooking.booking_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedBooking.booking_status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedBooking.booking_status.charAt(0).toUpperCase() + selectedBooking.booking_status.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {selectedBooking.special_requests && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Special Requests</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedBooking.special_requests}</p>
                </div>
              )}

              {(selectedBooking.flight_number || selectedBooking.airline) && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">✈️ Flight Information</h4>
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg space-y-1">
                    {selectedBooking.airline && (
                      <p className="text-sm text-gray-700"><span className="font-medium">Airline:</span> {selectedBooking.airline}</p>
                    )}
                    {selectedBooking.flight_number && (
                      <p className="text-sm text-gray-700"><span className="font-medium">Flight #:</span> {selectedBooking.flight_number}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-gray-200">
                {selectedBooking.booking_status === 'pending' && (
                  <button
                    onClick={() => { handleConfirm(selectedBooking); setShowDetails(false); }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center"
                  >
                    Confirm Booking
                  </button>
                )}
                {selectedBooking.customer_phone && (
                  <>
                    <a
                      href={`tel:${selectedBooking.customer_phone}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>Call</span>
                    </a>
                    <button
                      onClick={() => { navigator.clipboard.writeText(selectedBooking.customer_phone); }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-center flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      <span>Copy #</span>
                    </button>
                  </>
                )}
                <button
                  onClick={async () => {
                    setSendingEmail(true);
                    setEmailStatus(null);
                    try {
                      const res = await fetch('/api/admin/bookings/send-confirmation', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ bookingId: selectedBooking.id }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        setEmailStatus({ type: 'success', message: 'Confirmation email sent successfully!' });
                      } else {
                        setEmailStatus({ type: 'error', message: data.error || 'Failed to send email' });
                      }
                    } catch {
                      setEmailStatus({ type: 'error', message: 'An error occurred while sending the email' });
                    } finally {
                      setSendingEmail(false);
                    }
                  }}
                  disabled={sendingEmail}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {sendingEmail ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Send Confirmation Email</span>
                    </>
                  )}
                </button>
                <Link
                  href={`/admin/bookings/${selectedBooking.id}/edit`}
                  className="px-4 py-2 bg-caribbean-teal text-white rounded-lg hover:bg-opacity-90 text-center"
                >
                  Edit Booking
                </Link>
                <button
                  onClick={() => { setShowDetails(false); setShowArchiveDialog(selectedBooking); }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-center"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Archive/Delete Confirmation Dialog */}
      {showArchiveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Remove Booking</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                What would you like to do with booking <span className="font-semibold">{showArchiveDialog.booking_reference}</span>?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Archiving keeps the record for future reference. Deleting permanently removes it.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleArchive(showArchiveDialog)}
                  className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span>Archive (Recommended)</span>
                </button>
                <button
                  onClick={() => handlePermanentDelete(showArchiveDialog)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Delete Permanently
                </button>
                <button
                  onClick={() => setShowArchiveDialog(null)}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Booking Modal */}
      {showManualBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h3 className="text-lg font-semibold text-gray-900">New Manual Reservation</h3>
              <button onClick={() => setShowManualBooking(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {manualError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{manualError}</div>
              )}
              {manualSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{manualSuccess}</div>
              )}

              {/* Services - Multi-Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Services *</label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {services.map(service => {
                    const isSelected = manualForm.serviceIds.includes(service.id);
                    return (
                      <label
                        key={service.id}
                        className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setManualForm(f => ({
                                ...f,
                                serviceIds: [...f.serviceIds, service.id]
                              }));
                            } else {
                              setManualForm(f => ({
                                ...f,
                                serviceIds: f.serviceIds.filter(id => id !== service.id)
                              }));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium text-gray-900">{service.title}</div>
                          <div className="text-xs text-gray-500 capitalize">{service.category} • ${service.price}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {manualForm.serviceIds.length > 0 && (
                  <div className="mt-2 text-sm text-blue-600 font-medium">
                    {manualForm.serviceIds.length} service(s) selected
                  </div>
                )}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={manualForm.serviceDate}
                    onChange={(e) => setManualForm(f => ({ ...f, serviceDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <input
                    type="time"
                    value={manualForm.serviceTime}
                    onChange={(e) => setManualForm(f => ({ ...f, serviceTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Passengers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passengers *</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={manualForm.numPassengers}
                  onChange={(e) => setManualForm(f => ({ ...f, numPassengers: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Customer Info */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Customer Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      value={manualForm.customerFirstName}
                      onChange={(e) => setManualForm(f => ({ ...f, customerFirstName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={manualForm.customerLastName}
                      onChange={(e) => setManualForm(f => ({ ...f, customerLastName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={manualForm.customerEmail}
                      onChange={(e) => setManualForm(f => ({ ...f, customerEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={manualForm.customerPhone}
                      onChange={(e) => setManualForm(f => ({ ...f, customerPhone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hotel</label>
                    <input
                      type="text"
                      value={manualForm.customerHotel}
                      onChange={(e) => setManualForm(f => ({ ...f, customerHotel: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Hotel name"
                    />
                  </div>
                </div>
              </div>

              {/* Flight Info (shown when any selected service is a transfer) */}
              {services.some(s => manualForm.serviceIds.includes(s.id) && s.category === 'transfer') && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">✈️ Flight Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Airline</label>
                      <input
                        type="text"
                        value={manualForm.airline}
                        onChange={(e) => setManualForm(f => ({ ...f, airline: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. JetBlue, Delta"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Flight Number</label>
                      <input
                        type="text"
                        value={manualForm.flightNumber}
                        onChange={(e) => setManualForm(f => ({ ...f, flightNumber: e.target.value.toUpperCase() }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. B6 1234"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests / Notes</label>
                <textarea
                  value={manualForm.specialRequests}
                  onChange={(e) => setManualForm(f => ({ ...f, specialRequests: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Any special requirements or internal notes..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowManualBooking(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  disabled={manualLoading}
                  onClick={async () => {
                    setManualError(null);
                    setManualSuccess(null);
                    if (manualForm.serviceIds.length === 0 || !manualForm.serviceDate || !manualForm.serviceTime) {
                      setManualError('Please select at least one service, date, and time.');
                      return;
                    }
                    if (!manualForm.customerFirstName || !manualForm.customerLastName || !manualForm.customerEmail) {
                      setManualError('Please fill in customer first name, last name, and email.');
                      return;
                    }
                    setManualLoading(true);
                    try {
                      // Create booking for first service
                      const res = await fetch('/api/bookings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          ...manualForm,
                          serviceId: manualForm.serviceIds[0], // Use first service for main booking
                        }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        setManualSuccess(`Booking created! Reference: ${data.bookingReference}. Additional services: ${manualForm.serviceIds.length - 1}`);
                        setManualForm({ serviceIds: [], serviceDate: '', serviceTime: '', numPassengers: 1, customerFirstName: '', customerLastName: '', customerEmail: '', customerPhone: '', customerHotel: '', specialRequests: '', flightNumber: '', airline: '' });
                        fetchBookings();
                      } else {
                        setManualError(data.error || 'Failed to create booking.');
                      }
                    } catch {
                      setManualError('An unexpected error occurred.');
                    } finally {
                      setManualLoading(false);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                >
                  {manualLoading ? 'Creating...' : 'Create Reservation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
