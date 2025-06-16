// utils/cropImage.js
export default function getCroppedImg(imageSrc, crop, size) {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
  
        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          size,
          size
        );
  
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg');
      };
    });
  }
  