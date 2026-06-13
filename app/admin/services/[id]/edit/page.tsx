'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import ImageUpload from '@/components/admin/ImageUpload';
import GalleryUpload from '@/components/admin/GalleryUpload';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { updateServiceImages, getServiceImages } from '@/lib/images/service';

interface ServiceEditPageProps {
  params: {
    id: string;
  };
}

export default function ServiceEditPage({ params }: ServiceEditPageProps) {
  const { id: serviceId } = params;
  const router = useRouter();
  
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServiceImages();
  }, [serviceId]);

  const loadServiceImages = async () => {
    try {
      setIsLoading(true);
      const images = await getServiceImages(serviceId);
      
      if (images) {
        setFeaturedImage(images.featuredImage || '');
        setGalleryImages(images.galleryImages || []);
      }
    } catch (err) {
      setError('Failed to load service images');
      console.error('Error loading service images:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      const result = await updateServiceImages(
        serviceId,
        featuredImage || undefined,
        galleryImages.length > 0 ? galleryImages : undefined
      );
      
      if (result.success) {
        alert('Service images updated successfully!');
        router.push('/admin/services');
      } else {
        setError(result.error || 'Failed to update service images');
      }
    } catch (err) {
      setError('Failed to save changes');
      console.error('Error saving service images:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/services');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-caribbean-teal"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-deep-navy">Edit Service Images</h1>
        <p className="text-slate-gray mt-2">Service ID: {serviceId}</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-8">
        {/* Featured Image Section */}
        <div>
          <h2 className="text-lg font-semibold text-deep-navy mb-4">Featured Image</h2>
          <ImageUpload
            onUpload={setFeaturedImage}
            currentImage={featuredImage}
            label="Main Service Image"
            bucketName="service-images"
            customPath={`services/${serviceId}/featured`}
          />
          <p className="text-sm text-slate-gray mt-2">
            This image will be displayed as the main image for your service listing.
          </p>
        </div>

        {/* Gallery Images Section */}
        <div>
          <h2 className="text-lg font-semibold text-deep-navy mb-4">Gallery Images</h2>
          <GalleryUpload
            onUpload={setGalleryImages}
            currentImages={galleryImages}
            label="Additional Photos"
            bucketName="service-images"
            customPath={`services/${serviceId}/gallery`}
          />
          <p className="text-sm text-slate-gray mt-2">
            Add multiple images to showcase different aspects of your service.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-caribbean-teal hover:bg-teal-600 text-white"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-deep-navy mb-4">Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured Image Preview */}
          <div>
            <h3 className="font-medium text-slate-gray mb-2">Featured Image Preview</h3>
            {featuredImage ? (
              <OptimizedImage
                src={featuredImage}
                alt="Featured preview"
                width={400}
                height={192}
                className="w-full h-48 object-cover rounded-lg border border-slate-200"
              />
            ) : (
              <div className="w-full h-48 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-center">
                <span className="text-slate-gray">No featured image selected</span>
              </div>
            )}
          </div>
          
          {/* Gallery Preview */}
          <div>
            <h3 className="font-medium text-slate-gray mb-2">Gallery Preview</h3>
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {galleryImages.slice(0, 4).map((url, index) => (
                  <OptimizedImage
                    key={index}
                    src={url}
                    alt={`Gallery preview ${index + 1}`}
                    width={128}
                    height={96}
                    className="w-full h-24 object-cover rounded-lg border border-slate-200"
                  />
                ))}
                {galleryImages.length > 4 && (
                  <div className="w-full h-24 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-center">
                    <span className="text-slate-gray text-sm">+{galleryImages.length - 4} more</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-24 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-center">
                <span className="text-slate-gray">No gallery images selected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}