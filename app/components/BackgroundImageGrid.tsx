"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const BackgroundImageGrid = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const imageList: string[] = await response.json();
        setImages(imageList);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="fixed inset-0 z-0 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 w-full h-full">
      {images.map((src, index) => (
        <div key={index} className="relative w-full h-full">
          <Image
            src={src}
            alt={`Background ${index + 1}`}
            fill
            sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      ))}
    </div>
  );
};

export default BackgroundImageGrid;