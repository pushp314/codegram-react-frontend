// =============== src/hooks/useUpload.ts ===============
import { useState } from 'react';
import { apiClient } from '../lib/apiClient';

type UploadType = 'profile' | 'media';

interface UploadResult {
  url: string;
  filename: string;
}

export const useUpload = (type: UploadType) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<UploadResult | null> => {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('files', file);

    try {
      const { data } = await apiClient.post(`/upload/${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsUploading(false);
      // Assuming the API returns the URL of the first uploaded file
      return data.files[0];
    } catch (err) {
      console.error('File upload failed:', err);
      setError('File upload failed. Please try again.');
      setIsUploading(false);
      return null;
    }
  };

  return { uploadFile, isUploading, error };
};
