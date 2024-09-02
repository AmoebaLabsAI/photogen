import React, { useState, useMemo } from 'react';
import '../styles/Hero.css';

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

    const imagesPerColumn = 1000; // Increased to 1000 images per column

    const columns = useMemo(() => {
        const usedDurations = new Set();

        return Array(8).fill().map((_, colIndex) => {
            const columnImages = [];
            for (let i = 0; i < imagesPerColumn; i++) {
                columnImages.push(images[(colIndex + i) % images.length]);
            }

            let randomDuration;
            do {
                // Adjusted duration range: 900 to 1800 seconds (15 to 30 minutes)
                randomDuration = Math.floor(Math.random() * (1800 - 900 + 1) + 900);
            } while (usedDurations.has(randomDuration));

            usedDurations.add(randomDuration);
            return { images: columnImages, duration: randomDuration };
        });
    }, []);

    const [highlightedCell, setHighlightedCell] = useState(null);

    return (
        <div className="hero">
            <div className="carousel">
                {columns.map((column, colIndex) => (
                    <div key={colIndex} className={`carousel-column ${colIndex % 2 === 0 ? 'down' : 'up'}`}>
                        <div className="column-content" style={{ animationDuration: `${column.duration}s` }}>
                            {column.images.map((image, rowIndex) => (
                                <div
                                    key={rowIndex}
                                    className={`carousel-item ${highlightedCell === `${colIndex}-${rowIndex}` ? 'highlighted' : ''}`}
                                    onMouseEnter={() => setHighlightedCell(`${colIndex}-${rowIndex}`)}
                                    onMouseLeave={() => setHighlightedCell(null)}
                                >
                                    <img src={image} alt={`Slide ${colIndex}-${rowIndex}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hero;