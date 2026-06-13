'use client';

import { useState, useEffect } from 'react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  customer_first_name?: string;
  customer_last_name?: string;
  customer_name?: string;
  created_at: string;
}

interface GoogleReviewInput {
  name: string;
  rating: number;
  comment: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImportForm, setShowImportForm] = useState(false);
  const [newReviews, setNewReviews] = useState<GoogleReviewInput[]>([
    { name: '', rating: 5, comment: '' }
  ]);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reviews');
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReviewRow = () => {
    setNewReviews([...newReviews, { name: '', rating: 5, comment: '' }]);
  };

  const handleRemoveReviewRow = (index: number) => {
    if (newReviews.length > 1) {
      setNewReviews(newReviews.filter((_, i) => i !== index));
    }
  };

  const handleReviewChange = (index: number, field: keyof GoogleReviewInput, value: string | number) => {
    const updated = [...newReviews];
    updated[index] = { ...updated[index], [field]: value };
    setNewReviews(updated);
  };

  const handleImport = async () => {
    console.log('handleImport called');
    console.log('Reviews to import:', newReviews);
    
    // Validate
    const valid = newReviews.every(r => {
      const isValid = r.name.trim() && r.comment.trim();
      console.log(`Review valid: name="${r.name}", comment="${r.comment}", isValid=${isValid}`);
      return isValid;
    });
    
    console.log('Form valid:', valid);
    
    if (!valid) {
      setMessage({ type: 'error', text: 'Please fill in all fields for each review' });
      return;
    }

    console.log('Sending import request...');
    setImporting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/admin/reviews/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews: newReviews }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: `Successfully imported ${data.count} review(s)!` });
        setNewReviews([{ name: '', rating: 5, comment: '' }]);
        setShowImportForm(false);
        fetchReviews();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to import reviews' });
      }
    } catch (error) {
      console.error('Error importing reviews:', error);
      setMessage({ type: 'error', text: 'Failed to import reviews' });
    } finally {
      setImporting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reviewId }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Review deleted successfully' });
        fetchReviews();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete review' });
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      setMessage({ type: 'error', text: 'Failed to delete review' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reviews Management</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Manage customer reviews and import from Google</p>
        </div>
        <button
          onClick={() => setShowImportForm(!showImportForm)}
          className="px-4 py-2 bg-caribbean-teal text-white rounded-lg hover:bg-opacity-90 flex items-center space-x-2 self-start sm:self-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>{showImportForm ? 'Cancel' : 'Import Google Reviews'}</span>
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Import Form */}
      {showImportForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Import Google Reviews</h2>
          <p className="text-sm text-gray-600 mb-4">
            Copy reviews from your Google Business Profiles and paste them here.
          </p>

          <div className="space-y-4">
            {newReviews.map((review, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Review #{index + 1}</span>
                  {newReviews.length > 1 && (
                    <button
                      onClick={() => handleRemoveReviewRow(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    value={review.name}
                    onChange={(e) => handleReviewChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-caribbean-teal"
                    placeholder="e.g., John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
                  <select
                    value={review.rating}
                    onChange={(e) => handleReviewChange(index, 'rating', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-caribbean-teal"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 stars)</option>
                    <option value={3}>⭐⭐⭐ (3 stars)</option>
                    <option value={2}>⭐⭐ (2 stars)</option>
                    <option value={1}>⭐ (1 star)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Review Text *</label>
                  <textarea
                    value={review.comment}
                    onChange={(e) => handleReviewChange(index, 'comment', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-caribbean-teal"
                    placeholder="Paste the review text here..."
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddReviewRow}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              + Add Another Review
            </button>
            <button
              onClick={handleImport}
              disabled={importing}
              className="px-4 py-2 bg-caribbean-teal text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            >
              {importing ? 'Importing...' : `Import ${newReviews.length} Review(s)`}
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Reviews ({reviews.length})</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-3 text-gray-600">Loading reviews...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <p className="font-medium">No reviews yet</p>
            <p className="text-sm mt-1">Import your first Google reviews to get started!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-caribbean-teal to-caribbean-teal/70 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {((review.customer_first_name || review.customer_name || 'G').charAt(0).toUpperCase())}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {review.customer_first_name || review.customer_name || 'Guest'} {review.customer_last_name || ''}
                        </p>
                        <div className="flex items-center gap-1 text-sm">
                          {'⭐'.repeat(review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
