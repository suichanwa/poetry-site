import { Area } from 'react-easy-crop';

export const getCroppedImg = (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous"; // Ensure cross-origin images are handled correctly
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Failed to get canvas context'));
      }

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          return reject(new Error('Canvas is empty'));
        }
        resolve(blob);
      }, 'image/jpeg');
    };
    image.onerror = (error) => reject(error);
  });
};