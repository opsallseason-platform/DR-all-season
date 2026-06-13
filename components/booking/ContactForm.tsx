'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { useTranslations } from 'next-intl';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hotelName: string;
  specialRequests: string;
  flightNumber: string;
  airline: string;
  companyName: string; // Honeypot field - should remain empty
}

interface ContactFormProps {
  formData: ContactFormData;
  onFormDataChange: (data: ContactFormData) => void;
  className?: string;
  isTransfer?: boolean;
}

export function ContactForm({ 
  formData, 
  onFormDataChange, 
  className = '',
  isTransfer = false
}: ContactFormProps) {
  const t = useTranslations('Booking');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof ContactFormData, value: string) => {
    const updatedData = { ...formData, [field]: value };
    onFormDataChange(updatedData);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('firstNameRequired');
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('lastNameRequired');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('emailInvalid');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: keyof ContactFormData) => {
    if (!formData[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: `${field === 'firstName' ? 'First name' : 
                  field === 'lastName' ? 'Last name' : 
                  field === 'email' ? 'Email' : 
                  field === 'phone' ? 'Phone' : 
                  field === 'hotelName' ? 'Hotel name' : 
                  'Field'} is required`
      }));
    }
  };

  return (
    <div className={className}>
      <h3 className="text-lg font-light text-white mb-6 tracking-wide">{t('contactInfo')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-light text-white/80 mb-3 tracking-wide uppercase">
            {t('firstName')} *
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
            className={`w-full px-4 py-3 bg-white/5 border rounded-2xl text-white placeholder-white/40 font-light focus:outline-none focus:ring-2 transition-all ${
              errors.firstName ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/20 focus:ring-blue-500/50 focus:border-blue-500/50'
            }`}
            placeholder="John"
          />
          {errors.firstName && (
            <p className="mt-2 text-sm text-red-400 font-light">{errors.firstName}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-light text-white/80 mb-3 tracking-wide uppercase">
            {t('lastName')} *
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
            className={`w-full px-4 py-3 bg-white/5 border rounded-2xl text-white placeholder-white/40 font-light focus:outline-none focus:ring-2 transition-all ${
              errors.lastName ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/20 focus:ring-blue-500/50 focus:border-blue-500/50'
            }`}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="mt-2 text-sm text-red-400 font-light">{errors.lastName}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-light text-white/80 mb-3 tracking-wide uppercase">
            {t('emailLabel')} *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            className={`w-full px-4 py-3 bg-white/5 border rounded-2xl text-white placeholder-white/40 font-light focus:outline-none focus:ring-2 transition-all ${
              errors.email ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/20 focus:ring-blue-500/50 focus:border-blue-500/50'
            }`}
            placeholder="john.doe@example.com"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-400 font-light">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-light text-white/80 mb-3 tracking-wide uppercase">
            {t('phoneNumber')}
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/40 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="hotelName" className="block text-sm font-light text-white/80 mb-3 tracking-wide uppercase">
            {t('hotelName')}
          </label>
          <input
            type="text"
            id="hotelName"
            value={formData.hotelName}
            onChange={(e) => handleChange('hotelName', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/40 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            placeholder={t('hotelPlaceholder')}
          />
        </div>
        
        {isTransfer && (
          <>
            <div>
              <label htmlFor="airline" className="block text-sm font-light text-white/80 mb-3 tracking-wide uppercase">
                Airline
              </label>
              <input
                type="text"
                id="airline"
                value={formData.airline}
                onChange={(e) => handleChange('airline', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/40 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="e.g. JetBlue, Delta, United"
              />
            </div>

            <div>
              <label htmlFor="flightNumber" className="block text-sm font-light text-white/80 mb-3 tracking-wide uppercase">
                Flight Number
              </label>
              <input
                type="text"
                id="flightNumber"
                value={formData.flightNumber}
                onChange={(e) => handleChange('flightNumber', e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/40 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="e.g. B6 1234"
              />
            </div>
          </>
        )}

        <div className="md:col-span-2">
          <label htmlFor="specialRequests" className="block text-sm font-light text-white/80 mb-3 tracking-wide uppercase">
            {t('specialRequests')}
          </label>
          <textarea
            id="specialRequests"
            value={formData.specialRequests}
            onChange={(e) => handleChange('specialRequests', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/40 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
            placeholder={t('specialRequestsPlaceholder')}
          />
        </div>

        {/* Honeypot field - hidden from real users, catches bots */}
        <div className="md:col-span-2" style={{ display: 'none' }} aria-hidden="true">
          <label htmlFor="companyName" tabIndex={-1}>
            <input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>
      </div>
    </div>
  );
}