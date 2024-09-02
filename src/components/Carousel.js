import React, { useEffect } from 'react';
import '../styles/Carousel.css'; // Corrected import path

const Carousel = ({ images }) => {
    useEffect(() => {
        const items = document.querySelectorAll('.carousel-item');
        items.forEach((item, index) => {
            item.style.height = `${100 / 3}vh`; // Staggered heights to fit 3 rows in viewport height
        });
    }, []);

    return (
        <div className="carousel">
            {images.map((image, index) => (
                <div key={index} className="carousel-item">
                    <img src={image} alt={`Slide ${index}`} />
                </div>
            ))}
        </div>
    );
};

export default Carousel;