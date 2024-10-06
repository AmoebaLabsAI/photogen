"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const StaticImageGrid = () => {
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const imageList: string[] = await response.json();
        setImages(imageList);
      } catch (err: any) {
        console.error('Error fetching images:', err);
        setError('Failed to load images.');
      }
    };

    fetchImages();
  }, []);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="static-image-grid container mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold mb-8 text-center text-black">
        Explore Our Gallery
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map((src, index) => (
          <div key={index} className="relative aspect-square overflow-hidden">
            <Image
              src={src}
              alt={`Gallery image ${index + 1}`}
              fill
              objectFit="cover"
              className="transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaticImageGrid;