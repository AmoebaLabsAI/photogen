import React, { useEffect, useState, useRef } from 'react';
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

    // Create an 8x8 grid by repeating and slicing the images
    const gridImages = Array(128).fill().map((_, i) => images[i % images.length]);

    const [highlightedIndex, setHighlightedIndex] = useState(null);
    const carouselRef = useRef(null);

    useEffect(() => {
        const carousel = carouselRef.current;
        let animationId;

        const animate = () => {
            carousel.scrollTop += 1;
            if (carousel.scrollTop >= carousel.scrollHeight / 2) {
                carousel.scrollTop = 0;
            }
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div className="hero">
            <div className="carousel" ref={carouselRef}>
                <div className="carousel-content">
                    {gridImages.map((image, index) => (
                        <div
                            key={index}
                            className={`carousel-item ${index === highlightedIndex ? 'highlighted' : ''}`}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            onMouseLeave={() => setHighlightedIndex(null)}
                        >
                            <img src={image} alt={`Slide ${index}`} />
                        </div>
                    ))}
                </div>
                <div className="carousel-content">
                    {gridImages.map((image, index) => (
                        <div
                            key={index + gridImages.length}
                            className={`carousel-item ${index + gridImages.length === highlightedIndex ? 'highlighted' : ''}`}
                            onMouseEnter={() => setHighlightedIndex(index + gridImages.length)}
                            onMouseLeave={() => setHighlightedIndex(null)}
                        >
                            <img src={image} alt={`Slide ${index}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;