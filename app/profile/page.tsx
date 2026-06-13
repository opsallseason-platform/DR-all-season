'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    hotel: '',
    language: 'en',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch user data from localStorage (set after login/booking)
    const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('user_email') : null;
    const storedName = typeof window !== 'undefined' ? localStorage.getItem('user_name') : null;
    const storedPhone = typeof window !== 'undefined' ? localStorage.getItem('user_phone') : null;
    
    const userData = {
      id: '',
      name: storedName || '',
      email: storedEmail || '',
      phone: storedPhone || '',
      hotel: '',
      language: 'en',
    };
    
    setUser(userData);
    setFormData(userData);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real implementation, you would update user data in Supabase
      // const { error } = await supabase.auth.updateUser({
      //   data: {
      //     full_name: formData.name,
      //     phone: formData.phone,
      //     hotel: formData.hotel,
      //     language: formData.language
      //   }
      // });
      
      // For now, simulate update
      console.log('Update profile attempt:', formData);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Reset message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error updating profile');
      console.error('Update error:', err);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-deep-navy">Your Profile</h1>
          <p className="mt-2 text-slate-gray">Manage your account information</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white p-8 rounded-xl shadow-md">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-gray mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-caribbean-teal"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-gray mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
                <p className="mt-1 text-sm text-slate-gray">Email cannot be changed</p>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-gray mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-caribbean-teal"
                />
              </div>

              <div>
                <label htmlFor="hotel" className="block text-sm font-medium text-slate-gray mb-1">
                  Hotel Name
                </label>
                <input
                  type="text"
                  id="hotel"
                  name="hotel"
                  value={formData.hotel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-caribbean-teal"
                />
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-slate-gray mb-1">
                  Preferred Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-caribbean-teal"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <Button type="submit">Save Changes</Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(user);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-gray">Full Name</p>
                  <p className="font-medium">{formData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-gray">Email Address</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-gray">Phone Number</p>
                  <p className="font-medium">{formData.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-gray">Hotel</p>
                  <p className="font-medium">{formData.hotel || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-gray">Preferred Language</p>
                  <p className="font-medium">
                    {formData.language === 'es' ? 'Spanish' : 'English'}
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-deep-navy mb-4">Account Security</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-medium text-deep-navy">Change Password</h3>
                <p className="text-sm text-slate-gray">Update your account password</p>
              </div>
              <Button variant="outline">Change</Button>
            </div>
            
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-medium text-deep-navy">Two-Factor Authentication</h3>
                <p className="text-sm text-slate-gray">Add an extra layer of security</p>
              </div>
              <Button variant="outline">Set up</Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-deep-navy">Delete Account</h3>
                <p className="text-sm text-slate-gray">Permanently remove your account</p>
              </div>
              <Button variant="outline" className="text-red-600 hover:text-red-700">Delete</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}