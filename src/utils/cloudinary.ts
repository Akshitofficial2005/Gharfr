// Upload image to Cloudinary
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default');
  formData.append('folder', 'ghar-app');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/doj75kcch/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Get optimized image URL
export const getOptimizedImageUrl = (publicId: string, width?: number, height?: number): string => {
  const baseUrl = `https://res.cloudinary.com/doj75kcch/image/upload`;
  
  let transformations = 'f_auto,q_auto';
  
  if (width && height) {
    transformations += `,w_${width},h_${height},c_fill`;
  }
  
  return `${baseUrl}/${transformations}/${publicId}`;
};

// Get active amenities only
export const getActiveAmenities = async () => {
  try {
    const response = await fetch('/api/amenities');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch active amenities:', error);
    return [];
  }
};