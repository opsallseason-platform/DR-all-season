'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch user session from Supabase
      const res = await fetch('/api/bookings?reference=');
      // For now, try to get user from localStorage or show login prompt
      const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('user_email') : null;
      if (storedEmail) {
        setUser({ name: storedEmail.split('@')[0], email: storedEmail });
        // Fetch user bookings
        const bookingsRes = await fetch(`/api/admin/bookings?search=${encodeURIComponent(storedEmail)}&limit=10`);
        const bookingsData = await bookingsRes.json();
        if (bookingsData.success) {
          setBookings(bookingsData.bookings.map((b: any) => ({
            id: b.booking_reference,
            service: b.services?.title_en || 'Service',
            date: b.service_date,
            time: b.service_time,
            status: b.booking_status === 'pending' ? 'upcoming' : b.booking_status,
            price: Number(b.total_amount),
          })));
        }
      } else {
        setUser({ name: 'Guest', email: '' });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser({ name: 'Guest', email: '' });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-caribbean-teal/5 to-white py-12">
        <p className="text-lg text-slate-gray">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-caribbean-teal/5 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-deep-navy">Welcome, {user.name}</h1>
          <p className="mt-2 text-slate-gray">Manage your bookings and account details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-deep-navy mb-4">Account Information</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-gray">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-gray">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-gray">Total Bookings</p>
                  <p className="font-medium">{user.totalBookings}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-gray">Last Booking</p>
                  <p className="font-medium">{user.lastBooking}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  <Link href="/profile">Edit Profile</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Bookings Card */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-deep-navy">Your Bookings</h2>
                <Button variant="outline" size="sm">
                  <Link href="/tours">Book New</Link>
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-gray uppercase tracking-wider">Service</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-gray uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-gray uppercase tracking-wider">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-gray uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-gray uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-deep-navy">{booking.service}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-gray">{booking.date}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-gray">{booking.time}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : booking.status === 'upcoming' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <Button variant="outline" size="sm">
                            <Link href={`/booking/${booking.id}`}>View</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-deep-navy mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col items-center justify-center p-6">
              <Link href="/profile">Update Profile</Link>
            </Button>
            <Button variant="outline" className="flex flex-col items-center justify-center p-6">
              <Link href="/booking/history">Booking History</Link>
            </Button>
            <Button variant="outline" className="flex flex-col items-center justify-center p-6">
              <Link href="/reviews">Leave Review</Link>
            </Button>
            <Button variant="outline" className="flex flex-col items-center justify-center p-6">
              <Link href="/support">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}