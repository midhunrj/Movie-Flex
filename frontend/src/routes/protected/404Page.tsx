// src/components/NotFound404.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound404: React.FC = () => {
  const navigate = useNavigate();
  const [ticketHover, setTicketHover] = useState(false);
  const [popcorn, setPopcorn] = useState<{ x: number; y: number; id: number }[]>([]);


  useEffect(() => {
    const interval = setInterval(() => {
      const newPopcorn = {
        x: Math.random() * 100,
        y: -10,
        id: Date.now(),
      };
      setPopcorn((prev) => [...prev, newPopcorn].slice(-10));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleGoHome = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center overflow-hidden relative">
      {/* Popcorn falling animation */}
      {popcorn.map((kernel) => (
        <div
          key={kernel.id}
          className="absolute text-2xl animate-fall"
          style={{
            left: `${kernel.x}%`,
            top: `${kernel.y}vh`,
          }}
        >
          🍿
        </div>
      ))}

      {/* Main content */}
      <div className="text-center z-10 p-8 bg-slate-800 rounded-xl shadow-2xl">
        <h1 className="text-9xl font-bold text-yellow-400 animate-bounce">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl text-white mt-4 font-cinzel">
          This Screening Doesn't Exist!
        </h2>
        <p className="text-gray-300 mt-4 text-lg max-w-md mx-auto">
          Looks like we've hit a plot twist. The page you're looking for has vanished like a movie reel in an editing room!
        </p>

        <div
          className="mt-8 relative inline-block"
          onMouseEnter={() => setTicketHover(true)}
          onMouseLeave={() => setTicketHover(false)}
        >
          <button
            onClick={handleGoHome}
            className="group relative px-8 py-4 w-fit h-fit bg-red-600 text-white rounded-lg overflow-hidden transition-all duration-300 hover:bg-red-700"
          >
            <span className="relative z-10 font-semibold">
              Return to Box Office
            </span>
            
            
            <div
              className={`absolute inset-0 bg-yellow-400 transform transition-all duration-300 ${
                ticketHover ? 'translate-x-0' : '-translate-x-full'
              }`}
              style={{
                clipPath: 'polygon(0 0, 85% 0, 100% 30%, 100% 70%, 85% 100%, 0 100%)',
              }}
            />
          </button>
          
          {/* Spotlight effect */}
          {/* <div
            className={`absolute -top-20 -left-20 w-20 h-20 bg-white/20 rounded-full transition-opacity duration-300 ${
              ticketHover ? 'opacity-100' : 'opacity-0'
            }`}
          /> */}
        </div>

        {/* Movie clapboard */}
        <div className="mt-12 flex justify-center">
          <div className="w-64 h-32 bg-black border-4 border-white rotate-6 animate-pulse">
            <div className="flex items-center justify-between p-2">
              <div className="w-16 h-16 bg-white transform -skew-x-12" />
              <div className="w-16 h-16 bg-white transform skew-x-12" />
            </div>
            <p className="text-white text-center mt-2 font-mono">Scene Missing</p>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0.3;
          }
        }
        .animate-fall {
          animation: fall 5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound404;