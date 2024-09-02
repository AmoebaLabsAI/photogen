'use client'

import * as THREE from 'three'
import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'

function Stars({ count = 5000 }) {
    const [positions, colors] = useMemo(() => {
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100

            const brightness = Math.random() * 0.3 + 0.7
            colors[i * 3] = colors[i * 3 + 1] = colors[i * 3 + 2] = brightness
        }
        return [positions, colors]
    }, [count])

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attachObject={['attributes', 'position']}
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attachObject={['attributes', 'color']}
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.1} vertexColors />
        </points>
    )
}

function Supernova({ position, maxScale }) {
    const ref = useRef()
    const [scale, setScale] = useState(0)

    useFrame(() => {
        if (scale < maxScale) {
            setScale(s => Math.min(s + 0.05, maxScale))
        } else {
            setScale(s => Math.max(s - 0.05, 0))
        }
    })

    if (scale <= 0) return null

    return (
        <mesh ref={ref} position={position}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshBasicMaterial color="yellow" transparent opacity={1 - scale / maxScale} />
            <group scale={scale}>
                <mesh>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshBasicMaterial color="orange" transparent opacity={0.3} />
                </mesh>
            </group>
        </mesh>
    )
}

function AnimatedStars() {
    const ref = useRef()
    const [supernovas, setSupernovas] = useState([])

    useFrame((state) => {
        ref.current.rotation.y = state.clock.getElapsedTime() * 0.05
    })

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                setSupernovas(prev => [
                    ...prev,
                    {
                        id: Date.now(),
                        position: [
                            (Math.random() - 0.5) * 100,
                            (Math.random() - 0.5) * 100,
                            (Math.random() - 0.5) * 100
                        ],
                        maxScale: Math.random() * 1.5 + 0.5
                    }
                ])
            }
        }, 2000)

        return () => clearInterval(interval)
    }, [])

    return (
        <group ref={ref}>
            <Stars />
            {supernovas.map(supernova => (
                <Supernova key={supernova.id} {...supernova} />
            ))}
        </group>
    )
}

export default function Background3D() {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />
                <AnimatedStars />
            </Canvas>
        </div>
    )
}