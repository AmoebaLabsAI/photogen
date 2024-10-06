"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const ImageCarousel = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const getRandomImages = async () => {
      try {
        const response = await fetch('/api/images');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const imageList = await response.json();
        const shuffled = imageList.sort(() => 0.5 - Math.random());
        setImages(shuffled);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    getRandomImages();
  }, []);

  // Create 5 columns of images
  const columns = Array.from({ length: 5 }, (_, i) =>
    images.filter((_, index) => index % 5 === i)
  );

  const handleImageError = (e) => {
    e.target.style.display = 'none'; // Hide the image if it fails to load
  };

  return (
    <div className="image-grid-container grid grid-cols-5 gap-0 w-full h-full">
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className={`image-column relative w-full ${
            columnIndex % 2 === 0 ? "animate-scroll-down" : "animate-scroll-up"
          }`}
        >
          {column.map((src, imageIndex) => (
            <div
              key={imageIndex}
              className="relative w-full aspect-square overflow-hidden group"
            >
              <Image
                src={src}
                alt={`Grid image ${columnIndex}-${imageIndex}`}
                fill
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-110 group-hover:brightness-125 group-hover:shadow-glow group-hover:z-30"
                onError={handleImageError}
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-transparent to-white/30"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ImageCarousel;