import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Background3D = () => {
    const groupRef = useRef();
    const [supernovas, setSupernovas] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setSupernovas((prevSupernovas) => {
                const newSupernovas = [...prevSupernovas];
                if (newSupernovas.length < 5) {
                    newSupernovas.push({
                        id: Math.random(),
                        position: [
                            (Math.random() - 0.5) * 30,
                            (Math.random() - 0.5) * 30,
                            (Math.random() - 0.5) * 30,
                        ],
                        intensity: Math.random() * 2 + 1,
                    });
                }
                return newSupernovas;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            {supernovas.map((supernova) => (
                <pointLight
                    key={supernova.id}
                    position={supernova.position}
                    intensity={supernova.intensity}
                    decay={2}
                    distance={50}
                    color="white"
                />
            ))}
        </group>
    );
};

export default Background3D;