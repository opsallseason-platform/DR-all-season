'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews?limit=20');
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews.map((r: any) => ({
          id: r.id,
          customer: { firstName: r.customers?.first_name || 'Anonymous', lastName: r.customers?.last_name || '' },
          service: { titleEn: r.services?.title_en || 'Service' },
          rating: r.rating,
          title: r.title || '',
          comment: r.comment || '',
          createdAt: r.created_at?.split('T')[0] || '',
        })));
      }
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-caribbean-teal/5 to-white py-12">
        <p className="text-lg text-slate-gray">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-caribbean-teal/5 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-deep-navy">Customer Reviews</h1>
          <p className="mt-2 text-slate-gray">Read what our customers are saying</p>
        </div>

        <div className="mb-8 flex justify-between items-center">
          <div className="flex space-x-2">
            <Button 
              variant={filter === 'all' ? 'primary' : 'outline'} 
              onClick={() => setFilter('all')}
            >
              All Reviews
            </Button>
            <Button 
              variant={filter === 'recent' ? 'primary' : 'outline'} 
              onClick={() => setFilter('recent')}
            >
              Recent
            </Button>
            <Button 
              variant={filter === 'highest' ? 'primary' : 'outline'} 
              onClick={() => setFilter('highest')}
            >
              Highest Rated
            </Button>
            <Button 
              variant={filter === 'lowest' ? 'primary' : 'outline'} 
              onClick={() => setFilter('lowest')}
            >
              Lowest Rated
            </Button>
          </div>
          
          <Button onClick={() => router.push('/reviews/submit')}>
            Write a Review
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-deep-navy">{review.customer.firstName} {review.customer.lastName}</h3>
                  <p className="text-sm text-slate-gray">{review.service.titleEn}</p>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461c.969 0 1.371-1.24.588-1.81L9.049 2.927z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <h4 className="mt-3 font-medium text-deep-navy">{review.title}</h4>
              <p className="mt-2 text-slate-gray">{review.comment}</p>
              
              <div className="mt-4 text-sm text-slate-gray">
                {new Date(review.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-slate-gray">No reviews yet. Be the first to leave a review!</p>
            <Button className="mt-4" onClick={() => router.push('/reviews/submit')}>
              Write a Review
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}