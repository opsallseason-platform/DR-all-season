'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/Button';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { uploadImage } from '@/lib/images/service';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  label?: string;
  bucketName?: string;
  customPath?: string;
}

export default function ImageUpload({ 
  onUpload, 
  currentImage, 
  label = 'Upload Image',
  bucketName = 'service-images',
  customPath 
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, GIF, etc.)');
      return;
    }

    // Validate file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }

    setError(null);
    setIsUploading(true);

    // Create preview
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    try {
      const result = await uploadImage(file, bucketName, customPath);
      
      if (result.success && result.url) {
        onUpload(result.url);
      } else {
        setError(result.error || 'Failed to upload image');
        setPreviewUrl(currentImage || null); // Revert to previous image
      }
    } catch (err) {
      setError('Failed to upload image');
      setPreviewUrl(currentImage || null); // Revert to previous image
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      // Clean up the preview URL
      URL.revokeObjectURL(preview);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onUpload(''); // Send empty string to indicate removal
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-gray">{label}</label>
      
      <div className="flex items-center gap-4">
        {previewUrl ? (
          <div className="relative">
            <OptimizedImage
              src={previewUrl}
              alt="Preview"
              width={128}
              height={128}
              className="object-cover rounded-lg border border-slate-200"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 rounded-lg w-32 h-32 flex items-center justify-center bg-slate-50">
            <span className="text-slate-gray text-sm">No image</span>
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            onClick={triggerFileSelect}
            disabled={isUploading}
            className="bg-caribbean-teal hover:bg-teal-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Choose File'}
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
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
        Supported formats: JPG, PNG, GIF. Max size: 5MB
      </p>
    </div>
  );
}