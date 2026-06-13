import { supabaseDb } from '@/lib/supabase/db';

interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

interface ImageDeleteResult {
  success: boolean;
  error?: string;
}

/**
 * Uploads an image to Supabase Storage
 */
export async function uploadImage(
  file: File,
  bucketName: string = 'service-images',
  customPath?: string
): Promise<ImageUploadResult> {
  try {
    const supabase = supabaseDb;
    
    // Generate a unique filename
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = customPath 
      ? `${customPath}/${Date.now()}_${file.name}` 
      : `${Date.now()}_${file.name}`;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    // Get the public URL for the uploaded image
    const { data: publicData } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(data.path);
    
    return {
      success: true,
      url: publicData.publicUrl,
      path: data.path
    };
  } catch (error) {
    console.error('Error in uploadImage:', error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

/**
 * Deletes an image from Supabase Storage
 */
export async function deleteImage(
  imagePath: string,
  bucketName: string = 'service-images'
): Promise<ImageDeleteResult> {
  try {
    const supabase = supabaseDb;
    
    const { error } = await supabase
      .storage
      .from(bucketName)
      .remove([imagePath]);
    
    if (error) {
      console.error('Error deleting image:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error in deleteImage:', error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

/**
 * Updates service images in the database
 */
export async function updateServiceImages(
  serviceId: string,
  featuredImage?: string,
  galleryImages?: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = supabaseDb;
    
    const updateData: any = {};
    if (featuredImage !== undefined) {
      updateData.featured_image = featuredImage;
    }
    if (galleryImages !== undefined) {
      updateData.gallery_images = galleryImages;
    }
    
    const { error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', serviceId);
    
    if (error) {
      console.error('Error updating service images:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error in updateServiceImages:', error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

/**
 * Gets service images from the database
 */
export async function getServiceImages(serviceId: string) {
  try {
    const supabase = supabaseDb;
    
    const { data, error } = await supabase
      .from('services')
      .select('featured_image, gallery_images')
      .eq('id', serviceId)
      .single();
    
    if (error) {
      console.error('Error fetching service images:', error);
      return null;
    }
    
    return {
      featuredImage: data.featured_image,
      galleryImages: data.gallery_images
    };
  } catch (error) {
    console.error('Error in getServiceImages:', error);
    return null;
  }
}