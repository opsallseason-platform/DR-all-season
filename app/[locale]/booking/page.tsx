'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Service } from '@/types';
import { Button } from '@/components/ui/Button';
import { DatePicker } from '@/components/booking/DatePicker';
import { TimeSlotPicker } from '@/components/booking/TimeSlotPicker';
import { PassengerSelector } from '@/components/booking/PassengerSelector';
import { ContactForm } from '@/components/booking/ContactForm';
import { ExcursionSelector, SelectedExcursion } from '@/components/booking/ExcursionSelector';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';

const INCRUISES_SIGNUP_URL = 'https://alfredocorniel.incruises.com';

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

export default function BookingPage() {
  const searchParams = useSearchParams();
  const serviceSlug = searchParams.get('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('Booking');
  
  useEffect(() => {
    async function loadService() {
      if (!serviceSlug) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/services?slug=${serviceSlug}`);
        const data = await response.json();
        setSelectedService(data);
      } catch (error) {
        console.error('Error loading service:', error);
      } finally {
        setLoading(false);
      }
    }
    loadService();
  }, [serviceSlug]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-white/70 font-light tracking-wide">{t('loading')}</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!serviceSlug || !selectedService) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-light text-white mb-4 tracking-wide">{t('noServiceSelected')}</h1>
            <p className="text-white/70 mb-6 font-light">{t('noServiceDesc')}</p>
            <Button onClick={() => window.location.href = '/tours'} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-4 rounded-2xl font-normal tracking-wide">{t('browseServices')}</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div>
      <Header />
      <BookingPageContent service={selectedService} />
      <Footer />
    </div>
  );
}

function BookingPageContent({ service }: { service: Service }) {
  const t = useTranslations('Booking');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [passengerCounts, setPassengerCounts] = useState({ adults: 1, children: 0 });
  const [contactForm, setContactForm] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    hotelName: '',
    specialRequests: '',
    flightNumber: '',
    airline: '',
    companyName: '' // Honeypot field - should remain empty
  });
  const [selectedExcursions, setSelectedExcursions] = useState<SelectedExcursion[]>([]);
  const [step, setStep] = useState(1); // 1: Details, 2: Confirmation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);

  // Calculate total price
  const adultPrice = service.adultPrice || service.price;
  const isPerPerson = service.isPerPerson ?? service.category !== 'transfer';
  const childPricingAvailable = isPerPerson && (service.childPriceEnabled ?? service.category !== 'transfer') && !!service.childPrice && service.childPrice > 0;
  const childPrice = childPricingAvailable ? service.childPrice || 0 : 0;
  const transferBasePrice = isPerPerson
    ? (adultPrice * passengerCounts.adults) + (childPrice * passengerCounts.children)
    : adultPrice;
  const excursionTotal = selectedExcursions.reduce((sum, exc) => sum + exc.price * passengerCounts.adults, 0);
  const totalPrice = transferBasePrice + excursionTotal;
  const totalPassengers = passengerCounts.adults + passengerCounts.children;

  const handleBookingSubmit = async () => {
    if (!consentChecked) {
      setError('Please agree to the Terms of Service and Privacy Policy before submitting.');
      return;
    }

    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time');
      return;
    }

    if (!contactForm.firstName.trim() || !contactForm.lastName.trim() || !contactForm.email.trim()) {
      setError('Please fill in your name and email');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build special requests with excursion info
      let specialRequests = contactForm.specialRequests;
      if (selectedExcursions.length > 0) {
        const excursionLines = selectedExcursions.map(e => `• ${e.title} ($${e.price}/person × ${passengerCounts.adults} adults = $${e.price * passengerCounts.adults})`).join('\n');
        const excursionNote = `\n\n--- ADD-ON EXCURSIONS ---\n${excursionLines}\nExcursion subtotal: $${excursionTotal}\n---`;
        specialRequests = (specialRequests || '') + excursionNote;
      }

      // Prepare booking data
      const bookingData = {
        serviceId: service.id,
        serviceDate: selectedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        serviceTime: selectedTime,
        numPassengers: totalPassengers,
        numAdults: passengerCounts.adults,
        numChildren: passengerCounts.children,
        adultPrice: adultPrice,
        childPrice: childPrice,
        totalAmount: totalPrice,
        customerEmail: contactForm.email,
        customerPhone: contactForm.phone,
        customerFirstName: contactForm.firstName,
        customerLastName: contactForm.lastName,
        customerHotel: contactForm.hotelName,
        specialRequests,
        flightNumber: contactForm.flightNumber,
        airline: contactForm.airline
      };

      // Submit booking to API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (result.success) {
        setBookingReference(result.bookingReference || null);
        setStep(2); // Move to confirmation
      } else {
        setError(result.error || 'Failed to create booking');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError('An error occurred while creating the booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-light text-center mb-3 text-white tracking-wide">
            {t('completeBooking')}
          </h1>
          <p className="text-center text-white/60 mb-12 font-light tracking-wide text-lg">
            {service.title}
          </p>

          {/* Progress indicator with Animated Van */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-light transition-all ${step >= 1 ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' : 'bg-white/10 text-white/40 border border-white/20'}`}>
                1
              </div>
              
              {/* Line with animated van */}
              <div className="relative w-24">
                <div className={`h-0.5 w-full transition-all ${step >= 2 ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-white/20'}`}></div>
                
                {/* Animated Van */}
                {step === 1 && (
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2"
                    animate={{ 
                      left: ['10%', '90%', '10%'],
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 blur-lg bg-blue-500/30 rounded-full scale-150"></div>
                      <img 
                        src="/images/van-timeline.png"
                        alt="Transfer Vehicle"
                        className="w-8 h-8 object-contain drop-shadow-lg relative z-10"
                      />
                      <motion.div 
                        className="absolute -left-3 top-1/2 -translate-y-1/2 flex gap-0.5"
                        animate={{ 
                          opacity: [0.2, 0.6, 0.2],
                          x: [0, 2, 0]
                        }}
                        transition={{ 
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="w-2 h-0.5 bg-blue-400/50 rounded-full"></div>
                        <div className="w-1.5 h-0.5 bg-blue-400/30 rounded-full"></div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-light transition-all ${step >= 2 ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' : 'bg-white/10 text-white/40 border border-white/20'}`}>
                2
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-2xl text-red-300 font-light">
              {error}
            </div>
          )}

          {/* Step 1: Booking Details */}
          {step === 1 && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-light mb-6 text-white tracking-wide">{t('bookingDetails')}</h2>
              
              <div className="mb-8 p-6 bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-2xl">
                <h3 className="font-normal text-white mb-2 tracking-wide">{service.title}</h3>
                <p className="text-sm text-white/60 font-light">
                  {service.duration} • ${service.price}{isPerPerson ? ' per person' : ' flat price'}
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-light text-white/80 mb-3 tracking-wide uppercase">
                    {t('selectDate')}
                  </label>
                  <DatePicker
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    serviceId={service.id}
                  />
                </div>
                
                {selectedDate && (
                  <div>
                    <TimeSlotPicker
                      selectedTime={selectedTime}
                      onTimeChange={setSelectedTime}
                      serviceId={service.id}
                      selectedDate={selectedDate}
                    />
                  </div>
                )}
                
                <div>
                  <PassengerSelector
                    passengerCounts={passengerCounts}
                    onPassengerChange={setPassengerCounts}
                    maxPassengers={10}
                    showChildPrice={childPricingAvailable}
                  />
                </div>

                {/* Excursion Upsell - only for transfers */}
                {service.category === 'transfer' && (
                  <ExcursionSelector
                    selectedExcursions={selectedExcursions}
                    onExcursionsChange={setSelectedExcursions}
                  />
                )}
                
                {/* Price Summary */}
                <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-2xl p-6">
                  <h3 className="text-sm font-light text-white/80 mb-4 tracking-wide uppercase">Price Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-white/70 font-light">
                      <span>{isPerPerson ? `Adult${(passengerCounts.adults > 1 ? 's' : '')} (13+) × ${passengerCounts.adults}` : 'Transfer price'}</span>
                      <span>{isPerPerson ? `$${adultPrice} × ${passengerCounts.adults} = $${adultPrice * passengerCounts.adults}` : `$${adultPrice}`}</span>
                    </div>
                    {childPricingAvailable && passengerCounts.children > 0 && (
                      <div className="flex justify-between text-white/70 font-light">
                        <span>Child{(passengerCounts.children > 1 ? 'ren' : '')} (up to 12) × {passengerCounts.children}</span>
                        <span>${childPrice} × {passengerCounts.children} = ${childPrice * passengerCounts.children}</span>
                      </div>
                    )}
                    {selectedExcursions.length > 0 && (
                      <>
                        <div className="pt-2 border-t border-white/10">
                          <p className="text-xs text-white/50 font-light uppercase tracking-wide mb-2">Add-on Excursions</p>
                        </div>
                        {selectedExcursions.map(exc => (
                          <div key={exc.id} className="flex justify-between text-white/70 font-light">
                            <span className="truncate mr-2">{exc.title}</span>
                            <span>${exc.price} × {passengerCounts.adults} = ${exc.price * passengerCounts.adults}</span>
                          </div>
                        ))}
                      </>
                    )}
                    <div className="pt-3 border-t border-white/20 flex justify-between text-white font-light">
                      <span>Total ({totalPassengers} passenger{totalPassengers > 1 ? 's' : ''})</span>
                      <span className="text-2xl text-blue-400">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <ContactForm
                  formData={contactForm}
                  onFormDataChange={setContactForm}
                  isTransfer={service.category === 'transfer'}
                />

                <aside className="flex flex-col gap-3 border-l-2 border-blue-400 bg-blue-500/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-light leading-relaxed text-white/70">
                    <span className="font-normal text-white">{t('inCruisesCalloutTitle')}</span>{' '}
                    {t('inCruisesCalloutDescription')}
                  </p>
                  <a
                    href={INCRUISES_SIGNUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-blue-300 transition-colors hover:text-blue-200"
                  >
                    {t('joinInCruises')}
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </aside>
              </div>
              
              <div className="flex justify-end mt-8">
                {/* Terms & Privacy Consent */}
                <div className="w-full mb-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-white/30 bg-white/5 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm text-white/70 font-light leading-relaxed">
                      I agree to the{' '}
                      <a href="/terms-of-service" target="_blank" className="text-blue-400 underline hover:text-blue-300">Terms of Service</a>{' '}
                      and{' '}
                      <a href="/privacy-policy" target="_blank" className="text-blue-400 underline hover:text-blue-300">Privacy Policy</a>.
                      I consent to being contacted via phone, email, or text to confirm my reservation. My data will never be sold to third parties.
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleBookingSubmit}
                  disabled={loading || !selectedDate || !selectedTime || !consentChecked}
                  isLoading={loading}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-4 rounded-2xl font-normal tracking-wide shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('processing') : t('submitBooking')}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Confirmation */}
          {step === 2 && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-light text-white mb-3 tracking-wide">{t('bookingSubmitted')}</h2>
                <p className="text-white/70 mb-8 font-light tracking-wide">
                  {t('bookingSubmittedDesc')}
                </p>
                
                {bookingReference && (
                  <div className="mb-6">
                    <p className="text-white/50 text-sm font-light uppercase tracking-wider mb-1">{t('bookingRef')}</p>
                    <p className="text-2xl font-light text-blue-400 tracking-widest">{bookingReference}</p>
                  </div>
                )}
                
                <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-2xl p-6 text-left max-w-md mx-auto mb-8">
                  <h3 className="font-normal text-white mb-4 tracking-wide">{t('bookingSummary')}</h3>
                  <p className="text-white/70 font-light mb-2"><span className="font-normal text-white">{t('service')}:</span> {service.title}</p>
                  <p className="text-white/70 font-light mb-2"><span className="font-normal text-white">{t('date')}:</span> {selectedDate ? selectedDate.toLocaleDateString() : ''}</p>
                  <p className="text-white/70 font-light mb-2"><span className="font-normal text-white">{t('time')}:</span> {selectedTime}</p>
                  <p className="text-white/70 font-light mb-2"><span className="font-normal text-white">{isPerPerson ? 'Adults (13+)' : 'Passengers'}:</span> {passengerCounts.adults}</p>
                  {childPricingAvailable && passengerCounts.children > 0 && (
                    <p className="text-white/70 font-light mb-2"><span className="font-normal text-white">Children (up to 12):</span> {passengerCounts.children}</p>
                  )}
                  <p className="text-white/70 font-light mb-2"><span className="font-normal text-white">{t('passengers')}:</span> {totalPassengers}</p>
                  <p className="text-white font-light mt-4 pt-4 border-t border-white/20"><span className="font-normal">{t('totalAmount')}:</span> <span className="text-blue-400">${totalPrice.toFixed(2)}</span></p>
                </div>

                <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-500/20 rounded-2xl p-4 max-w-md mx-auto mb-8">
                  <p className="text-amber-200/80 font-light text-sm">
                    {t('confirmationNote')}
                  </p>
                  <p className="text-white/50 font-light text-xs mt-3">
                    {t('privacyConsent')}{' '}
                    <a href="/en/privacy-policy" className="underline hover:text-white/80">{t('privacyLink')}</a>.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="primary"
                    onClick={() => { setStep(1); setBookingReference(null); }}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-4 rounded-2xl font-normal tracking-wide shadow-lg hover:shadow-xl transition-all"
                  >
                    {t('bookAnother')}
                  </Button>
                  <a href="/">
                    <Button
                      variant="outline"
                      className="border-2 border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-light tracking-wide"
                    >
                      {t('returnHome')}
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
