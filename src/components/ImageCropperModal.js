// components/ImageCropperModal.js
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
// import './ImageCropperModal.css';

export default function ImageCropperModal({ imageSrc, onClose, onCropDone }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleDone = async () => {
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, 280);
    onCropDone(croppedBlob);
  };

  return (
    <div className="modal-backdrop">
      <div className="cropper-container">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropSize={{ width: 280, height: 280 }}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
        <div className="crop-controls">
          <button className='btn btn-primary' onClick={handleDone}>Crop & Upload</button>
          <button className='btn btn-danger' onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
