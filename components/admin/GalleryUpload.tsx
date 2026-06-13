'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/Button';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { uploadImage } from '@/lib/images/service';

interface GalleryUploadProps {
  onUpload: (urls: string[]) => void;
  currentImages?: string[];
  label?: string;
  bucketName?: string;
  customPath?: string;
}

export default function GalleryUpload({ 
  onUpload, 
  currentImages = [], 
  label = 'Upload Gallery Images',
  bucketName = 'service-images',
  customPath 
}: GalleryUploadProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>(currentImages);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select image files (JPEG, PNG, GIF, etc.)');
        return;
      }

      // Validate file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        return;
      }
    }

    setError(null);
    setIsUploading(true);

    try {
      // Create previews for all files
      const newPreviews: string[] = [];
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const preview = URL.createObjectURL(file);
        newPreviews.push(preview);

        const result = await uploadImage(file, bucketName, customPath);
        
        if (result.success && result.url) {
          newUrls.push(result.url);
        } else {
          setError(result.error || `Failed to upload image ${i + 1}`);
          // Clean up previews
          newPreviews.forEach(preview => URL.revokeObjectURL(preview));
          return;
        }
      }

      // Clean up preview URLs
      newPreviews.forEach(preview => URL.revokeObjectURL(preview));

      // Combine with existing images
      const updatedUrls = [...previewUrls, ...newUrls];
      setPreviewUrls(updatedUrls);
      onUpload(updatedUrls);
    } catch (err) {
      setError('Failed to upload images');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    const newUrls = [...previewUrls];
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
    onUpload(newUrls);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-gray">{label}</label>
      
      <div className="space-y-4">
        {/* Image previews */}
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <OptimizedImage
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  width={128}
                  height={128}
                  className="w-full h-32 object-cover rounded-lg border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Upload button */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={triggerFileSelect}
            disabled={isUploading}
            className="bg-caribbean-teal hover:bg-teal-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Add Images'}
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          
          {isUploading && (
            <div className="flex items-center text-sm text-slate-gray">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-caribbean-teal mr-2"></div>
              Uploading...
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
      
      <p className="text-xs text-slate-gray">
        Supported formats: JPG, PNG, GIF. Max size: 5MB each. You can select multiple files.
      </p>
    </div>
  );
}