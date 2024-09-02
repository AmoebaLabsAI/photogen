import dynamic from 'next/dynamic';
import Link from 'next/link';

const Background3D = dynamic(() => import('./components/Background3D'), { ssr: false });

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Background3D />
      <div className="flex-grow flex items-center relative z-10">
        <div className="container mx-auto px-5 flex flex-col md:flex-row">
          <div className="w-full md:w-[70%] pr-0 md:pr-8 flex flex-col justify-center items-center text-center">
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
          <div className="w-full md:w-[30%] flex items-center justify-center">
            <form className="space-y-4 w-full max-w-sm bg-white bg-opacity-20 p-6 rounded-lg shadow-md backdrop-blur-md">
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
    </div>
  );
}
