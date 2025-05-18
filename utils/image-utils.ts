/**
 * Utility functions for handling images
 */

interface ImageResizeOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
}

/**
 * Resizes an image to a 1:1 aspect ratio (square) with specified dimensions
 */
export const resizeImage = (dataUrl: string, options: ImageResizeOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { maxWidth, maxHeight, quality } = options;
    
    // Create an image element
    const img = new Image();
    img.src = dataUrl;
    
    img.onload = () => {
      // Determine the size of the square
      const size = Math.min(maxWidth, maxHeight);
      
      // Calculate crop dimensions to make the image square
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = img.width;
      let sourceHeight = img.height;
      
      if (img.width > img.height) {
        // Landscape image: crop the sides
        sourceX = (img.width - img.height) / 2;
        sourceWidth = img.height;
      } else if (img.height > img.width) {
        // Portrait image: crop the top/bottom
        sourceY = (img.height - img.width) / 2;
        sourceHeight = img.width;
      }
      
      // Create a canvas and draw a square image
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(
        img, 
        sourceX, sourceY, sourceWidth, sourceHeight, // source rectangle
        0, 0, size, size // destination rectangle
      );
      
      // Convert to data URL
      const resizedDataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(resizedDataUrl);
    };
    
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
};

/**
 * Validates that a file is an image of acceptable type and size
 */
export const validateImageFile = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      console.error('Invalid file type. Expected image/jpeg, image/png, image/gif, or image/webp');
      resolve(false);
      return;
    }
    
    // Check file size - max 5MB
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      console.error('File too large. Max size is 5MB');
      resolve(false);
      return;
    }
    
    resolve(true);
  });
};
