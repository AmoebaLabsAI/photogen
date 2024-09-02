import React, { useEffect, useState } from 'react';
import '../styles/Hero.css'; // Corrected import path

const Hero = () => {
    const images = [
        '/images/out-0 (0).webp',
        '/images/out-0 (1).webp',
        '/images/out-0 (2).webp',
        '/images/out-0 (3).webp',
        '/images/out-0 (4).webp',
        '/images/out-0 (5).webp',
        '/images/out-0 (6).webp',
        '/images/out-0 (7).webp',
        '/images/out-0 (8).webp',
        '/images/out-0 (9).webp',
        '/images/out-0 (10).webp',
        '/images/out-0 (11).webp',
        '/images/out-0 (12).webp',
        '/images/out-0 (13).webp',
        '/images/out-0 (14).webp',
        '/images/out-0 (15).webp',
        '/images/out-0 (16).webp',
        '/images/out-0 (17).webp',
        '/images/out-0 (18).webp',
        '/images/out-0 (19).webp',
        '/images/out-0 (20).webp',
        '/images/out-0 (21).webp',
        '/images/out-0 (22).webp',
        '/images/out-0 (23).webp',
        '/images/out-0 (24).webp',
        '/images/out-0 (25).webp',
        '/images/out-0 (26).webp',
        '/images/out-0 (27).webp',
        '/images/out-0 (28).webp',
    ];

    // Duplicate images to create an infinite scroll effect
    const infiniteImages = Array(10).fill(images).flat();

    const [highlightedIndex, setHighlightedIndex] = useState(null);

    useEffect(() => {
        const items = document.querySelectorAll('.carousel-item');
        items.forEach((item, index) => {
            item.style.height = `${100 / 5}vh`; // Staggered heights to fit 5 rows in viewport height
            item.addEventListener('mouseenter', () => setHighlightedIndex(index));
            item.addEventListener('mouseleave', () => setHighlightedIndex(null));
        });

        return () => {
            items.forEach((item) => {
                item.removeEventListener('mouseenter', () => setHighlightedIndex(index));
                item.removeEventListener('mouseleave', () => setHighlightedIndex(null));
            });
        };
    }, [infiniteImages.length]);

    return (
        <div className="hero">
            <div className="carousel">
                {infiniteImages.map((image, index) => (
                    <div key={index} className={`carousel-item ${index === highlightedIndex ? 'highlighted' : ''}`}>
                        <img src={image} alt={`Slide ${index}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hero;