import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { notFound } from 'next/navigation';
import { supabaseDb } from '@/lib/supabase/db';

interface SuccessPageProps {
  searchParams: {
    bookingReference?: string;
  };
}

export default async function BookingSuccessPage({ searchParams }: SuccessPageProps) {
  const { bookingReference } = searchParams;

  if (!bookingReference) {
    notFound();
  }

  // Fetch booking details from the database
  const { data: booking } = await supabaseDb
    .from('bookings')
    .select('*, services(title_en, title_es, category)')
    .eq('booking_reference', bookingReference)
    .maybeSingle();

  if (!booking) {
    notFound();
  }

  // Convert Decimal values to numbers for display
  const totalAmount = Number(booking.total_amount);
  const pricePerPerson = Number(booking.price_per_person);

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-caribbean-teal/5 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Booking Confirmed!
              </h1>
              
              <p className="text-gray-600 mb-8">
                Your payment has been processed successfully. Here are your booking details:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 text-left mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Reference:</span>
                    <span className="font-medium">{booking.booking_reference}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{booking.services?.title_en}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date(booking.service_date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{booking.service_time}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passengers:</span>
                    <span className="font-medium">{booking.num_passengers}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per person:</span>
                    <span className="font-medium">${pricePerPerson.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="text-gray-900 font-semibold">Total Paid:</span>
                    <span className="text-lg font-bold text-caribbean-teal">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 text-left mb-8">
                <h3 className="font-medium text-blue-800 mb-2">Next Steps:</h3>
                <ul className="list-disc pl-5 space-y-1 text-blue-700">
                  <li>You will receive a confirmation email shortly</li>
                  <li>Our team will contact you 24 hours before the service</li>
                  <li>Have your booking reference ready for check-in</li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg">
                  View Booking Details
                </Button>
                <Button variant="outline" size="lg">
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}