import React from "react";
import Image from "next/image";

const BackgroundImageGrid = () => {
  const images = [
    "/images/1.webp",
    "/images/2.webp",
    "/images/3.webp",
    "/images/4.webp",
    "/images/5.webp",
    "/images/6.webp",
  ];

  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-4 w-full h-full p-4">
      {images.map((src, index) => (
        <div key={index} className="relative w-full h-full bg-red-500">
          {" "}
          {/* Added bg-red-500 */}
          <Image
            src={src}
            alt={`Background ${index + 1}`}
            fill
            sizes="(max-width: 768px) 33vw, 25vw"
            style={{ objectFit: "cover" }}
            className="opacity-50"
          />
        </div>
      ))}
    </div>
  );
};

export default BackgroundImageGrid;
