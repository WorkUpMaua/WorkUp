import { useState } from 'react';

interface PhotoGalleryProps {
  photos: string[];
}

export default function PhotoGallery(props: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string>(props.photos[0]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6">
        <img
          src={selectedPhoto}
          alt="Selected"
          className="w-full max-w-[350px] h-48 object-cover rounded-lg shadow-md"
        />
      </div>

      <div className="flex gap-4 justify-center flex-wrap">
        {props.photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Thumbnail ${index}`}
            onClick={() => setSelectedPhoto(photo)}
            className={`w-24 h-auto cursor-pointer rounded-md shadow-sm transition-transform transform hover:scale-105 ${
              photo === selectedPhoto ? 'ring-4 ring-[#34495e]' : 'ring-2 ring-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};