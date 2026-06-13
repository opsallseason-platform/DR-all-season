import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

export default function BookingCancelPage() {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-caribbean-teal/5 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Booking Cancelled
              </h1>
              
              <p className="text-gray-600 mb-8">
                Your booking process was cancelled. No payment was processed.
              </p>
              
              <div className="bg-yellow-50 rounded-lg p-4 text-left mb-8">
                <h3 className="font-medium text-yellow-800 mb-2">What happened:</h3>
                <ul className="list-disc pl-5 space-y-1 text-yellow-700">
                  <li>Your payment was not processed</li>
                  <li>No amount was charged to your card</li>
                  <li>Your booking was not confirmed</li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg">
                  Try Booking Again
                </Button>
                <a href="/">
                  <Button variant="outline" size="lg">
                    Return Home
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}