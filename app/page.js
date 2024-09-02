"use client";

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Background3D = dynamic(() => import('../src/components/Background3D'), { ssr: false });
const Hero = dynamic(() => import('../src/components/Hero'), { ssr: false });

export default function LandingPage() {
  const topics = [
    { name: 'Portrait Studio', img1: 'https://via.placeholder.com/300', img2: 'https://via.placeholder.com/300' },
    { name: 'Virtual Fashion', img1: 'https://via.placeholder.com/300', img2: 'https://via.placeholder.com/300' },
    { name: 'Social Media Influencer', img1: 'https://via.placeholder.com/300', img2: 'https://via.placeholder.com/300' },
    { name: 'Retro Aesthetics', img1: 'https://via.placeholder.com/300', img2: 'https://via.placeholder.com/300' },
    { name: 'Professional Headshots', img1: 'https://via.placeholder.com/300', img2: 'https://via.placeholder.com/300' },
    { name: 'Artistic Expressions', img1: 'https://via.placeholder.com/300', img2: 'https://via.placeholder.com/300' },
    { name: 'Travel Memories', img1: 'https://via.placeholder.com/300', img2: 'https://via.placeholder.com/300' },
    { name: 'Futuristic Concepts', img1: 'https://via.placeholder.com/300', img2: 'https://via.placeholder.com/300' },
    { name: 'Fitness and Wellness', img1: 'https://via.placeholder.com/300', img2: 'https://via.placeholder.com/300' },
    { name: 'Nature and Wildlife', img1: 'https://via.placeholder.com/300', img2: 'https://via.placeholder.com/300' },
    { name: 'Urban Exploration', img1: 'https://via.placeholder.com/300', img2: 'https://via.placeholder.com/300' },
    { name: 'Culinary Delights', img1: 'https://via.placeholder.com/300', img2: 'https://via.placeholder.com/300' },
    { name: 'Seasonal Celebrations', img1: 'https://via.placeholder.com/300', img2: 'https://via.placeholder.com/300' },
    { name: 'Vintage Nostalgia', img1: 'https://via.placeholder.com/300', img2: 'https://via.placeholder.com/300' },
    { name: 'Tech Innovations', img1: 'https://via.placeholder.com/300', img2: 'https://via.placeholder.com/300' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black relative">
      <Canvas className="absolute inset-0 z-0">
        <Background3D />
        <OrbitControls enableZoom={false} />
      </Canvas>
      <Hero />
      <div className="flex-grow flex items-center relative z-10 pointer-events-none">
        <div className="container mx-auto px-5 flex flex-col md:flex-row">
          <div className="w-full md:w-[70%] pr-0 md:pr-8 flex flex-col justify-center items-center text-center pointer-events-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white shadow-text">Welcome to Flux AI</h1>
            <p className="text-lg md:text-xl mb-6 text-gray-200 shadow-text">
              Flux AI is your gateway to creating stunning photos using artificial intelligence.
              Choose from our various models to turn your ideas into visual reality.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/flux_schnell" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                Try Flux Schnell
              </Link>
              <Link href="/flux_pro" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                Try Flux Pro
              </Link>
              <Link href="/lightning" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                Try Lightning
              </Link>
              <Link href="/africa" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                Try Africa
              </Link>
            </div>
          </div>
          <div className="w-full md:w-[30%] flex items-center justify-center pointer-events-auto">
            <form className="space-y-4 w-full max-w-sm bg-white bg-opacity-20 p-6 rounded-lg shadow-md">
              <input
                type="text"
                placeholder="Username"
                className="w-full p-2 border rounded bg-gray-800 text-white"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border rounded bg-gray-800 text-white"
              />
              <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="relative z-10 bg-white text-black py-20">
        <div className="container mx-auto px-5">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Why Choose Flux AI?</h2>
          <p className="text-lg md:text-xl mb-6">
            Flux AI offers state-of-the-art AI models to help you create stunning photos effortlessly. Our models are trained on diverse datasets to ensure high-quality results for any type of image you want to create.
          </p>
          <p className="text-lg md:text-xl mb-6">
            Whether you're a professional photographer or just someone who loves taking pictures, Flux AI has the tools you need to bring your vision to life.
          </p>
        </div>
      </div>
      <div className="relative z-10 bg-black text-white py-20">
        <div className="container mx-auto px-5 grid grid-cols-3 gap-8">
          {topics.map((topic, index) => (
            <div key={index} className="bg-white text-black p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">{topic.name}</h3>
              <div className="flex justify-between space-x-4">
                <img src={topic.img1} alt={`${topic.name} 1`} className="w-1/2 h-auto rounded-lg" />
                <img src={topic.img2} alt={`${topic.name} 2`} className="w-1/2 h-auto rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Static Footer */}
      <footer className="bg-gray-900 text-white py-6 relative z-10">
        <div className="container mx-auto px-5 flex flex-col md:flex-row justify-between items-center">
          <p className="mb-4 md:mb-0">An Amoeba Labs Experiment</p>
          <p className="text-sm italic max-w-md text-center md:text-right">
            "Knowledge is knowing that Frankenstein is not the monster. Wisdom is knowing that he is."
          </p>
        </div>
      </footer>
    </div>
  );
}
