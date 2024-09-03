import React from 'react';
import Image from 'next/image';

const BackgroundImageGrid = () => {
    const images = [
        '/images/out-0 (0).webp',
        '/images/out-0 (1).webp',
        '/images/out-0 (2).webp',
        '/images/out-0 (3).webp',
        '/images/out-0 (4).webp',
        '/images/out-0 (5).webp',
    ];

    return (
        <div className="grid grid-cols-3 grid-rows-2 gap-4 w-full h-full p-4">
            {images.map((src, index) => (
                <div key={index} className="relative w-full h-full bg-red-500"> {/* Added bg-red-500 */}
                    <Image
                        src={src}
                        alt={`Background ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 33vw, 25vw"
                        style={{ objectFit: 'cover' }}
                        className="opacity-50"
                    />
                </div>
            ))}
        </div>
    );
};

export default BackgroundImageGrid;