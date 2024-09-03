import React, { useState, useMemo } from 'react';
import Image from 'next/image';
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
        '/images/out-0 (29).webp',
        '/images/out-0 (30).webp',
        '/images/out-0 (31).webp',
    ];

    const numberOfColumns = 4;

    const columns = useMemo(() => {
        const usedDurations = new Set();
        return Array(numberOfColumns).fill().map(() => {
            const columnImages = [];
            for (let i = 0; i < 1000; i++) {
                const randomIndex = Math.floor(Math.random() * images.length);
                columnImages.push(images[randomIndex]);
            }

            let randomDuration;
            do {
                // Increase the duration range by 75% to slow down the carousel
                // Now it's between 78.75 to 118.125 minutes (4,725,000 to 7,087,500 milliseconds)
                randomDuration = Math.floor(Math.random() * (7087500 - 4725000 + 1) + 4725000);
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
                        <div className="column-content" style={{ animationDuration: `${column.duration}ms` }}>
                            {column.images.map((image, rowIndex) => (
                                <div
                                    key={rowIndex}
                                    className={`carousel-item ${highlightedCell === `${colIndex}-${rowIndex}` ? 'highlighted' : ''}`}
                                    onMouseEnter={() => setHighlightedCell(`${colIndex}-${rowIndex}`)}
                                    onMouseLeave={() => setHighlightedCell(null)}
                                >
                                    <Image
                                        src={image}
                                        alt={`Slide ${colIndex}-${rowIndex}`}
                                        layout="fill"
                                        objectFit="cover"
                                    />
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