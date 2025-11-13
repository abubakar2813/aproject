import React, { useState, useEffect } from 'react';

// The main application component
const App = () => {
  // --- State Management ---
  const [isLoading, setIsLoading] = useState(true); // 5 seconds initial load
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(10); // 10 seconds countdown
  const [isCardOpen, setIsCardOpen] = useState(false); // Greeting card modal state
  const [showBurst, setShowBurst] = useState(false); // Burst animation state

  // --- Custom CSS Animations ---
  const animationStyle = `
    /* Initial Loading Screen Balloon Float */
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-25px); }
    }
    .float-animation {
      animation: float 2.5s ease-in-out infinite;
    }

    /* Countdown Screen Box Pop-out/Bounce */
    @keyframes popIn {
      0% { transform: scale(0.5); opacity: 0; }
      80% { transform: scale(1.05); opacity: 1; }
      100% { transform: scale(1); }
    }
    .pop-in-animation {
      animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    /* Floating Background Emojis */
    @keyframes float-bg {
      0% { transform: translate(0, 0) rotate(0deg); opacity: 0.8; }
      33% { transform: translate(15vw, 15vh) rotate(10deg); opacity: 1; }
      66% { transform: translate(-10vw, -10vh) rotate(-10deg); opacity: 0.8; }
      100% { transform: translate(0, 0) rotate(0deg); opacity: 0.8; }
    }
    .floating-emoji-1 { animation: float-bg 15s ease-in-out infinite alternate; }
    .floating-emoji-2 { animation: float-bg 18s ease-in-out infinite alternate-reverse; }
    .floating-emoji-3 { animation: float-bg 12s linear infinite alternate; }

    /* Modal Pop-up Burst (Floats up and disappears) */
    @keyframes burst-up {
      0% { transform: translateY(0) scale(1); opacity: 1; }
      100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
    }
    .burst-animation {
      animation: burst-up 1.5s ease-out forwards;
      pointer-events: none; /* Ensure it doesn't block interaction */
    }
  `;

  // --- Phase Control (5s Loading -> 10s Countdown) ---

  // 1. Initial 5-second loader setup
  useEffect(() => {
    // Check for development bypass
    if (window.location.search.includes('skipLoading=true')) {
        setIsLoading(false);
        setIsCountingDown(true);
        return;
    }

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setIsCountingDown(true);
    }, 5000);

    return () => clearTimeout(loadingTimer);
  }, []);

  // 2. 10-second countdown timer logic
  useEffect(() => {
    if (!isCountingDown) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsCountingDown(false);
    }
  }, [isCountingDown, countdown]);

  // 3. Burst animation trigger when card opens
  useEffect(() => {
      if (isCardOpen) {
          setShowBurst(true);
          // Remove burst elements after animation duration (1.5s + small buffer)
          const burstTimer = setTimeout(() => {
              setShowBurst(false);
          }, 1800);
          return () => clearTimeout(burstTimer);
      }
  }, [isCardOpen]);


  // --- Helper Components & Styles ---

  // Inject the custom CSS animation styles
  const RenderStyles = () => (
    <style dangerouslySetInnerHTML={{ __html: animationStyle }} />
  );

  // Reusable component for the floating background emojis
  const FloatingBackground = () => (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 left-1/4 text-6xl floating-emoji-1">⭐</div>
        <div className="absolute top-3/4 right-1/4 text-7xl floating-emoji-2">🎁</div>
        <div className="absolute top-1/5 right-10 text-5xl floating-emoji-3">🎉</div>
        <div className="absolute bottom-10 left-5 text-4xl floating-emoji-1">✨</div>
        <div className="absolute top-1/2 left-10 text-5xl floating-emoji-2">🥳</div>
    </div>
  );

  // Burst Emojis that float up when the modal opens
  const BurstEmojis = () => {
    if (!showBurst) return null;

    // These elements are fixed to the center of the screen where the modal appears
    // and float up over the modal.
    return (
        <div className="fixed inset-0 flex justify-center items-center z-40 pointer-events-none">
            {/* The translateY(40px) offset places the bottom of the emoji near the center of the card */}
            <div className="absolute text-8xl burst-animation" style={{ transform: 'translateY(40px)' }}>🎈</div>
            <div className="absolute text-8xl burst-animation" style={{ animationDelay: '0.2s', transform: 'translateY(40px)' }}>🥳</div>
        </div>
    );
  };

  // --- MODAL Component ---
  const GreetingCardModal = () => (
    <div 
      // Ensure the modal covers the full viewport (h-screen/w-screen) and centers content
      className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50 transition-opacity duration-300 ${isCardOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-modal="true"
      role="dialog"
      onClick={() => setIsCardOpen(false)} // Close when clicking backdrop
    >
      <div 
        // Card content ensures full width on mobile with max width set for desktop
        className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl max-w-sm w-full text-center modal-pop border-4 border-pink-500 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the card
      >
        <button 
          onClick={() => setIsCardOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors duration-200 text-xl font-bold"
          aria-label="Close card"
        >
          &times;
        </button>
        <div className="text-4xl mb-4">💌</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-4">Happy Birthday Dear Naimal🎂🥳</h2>
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed italic">
          Wishing the happiest of birthdays to the woman with the most beautiful heart. May Allah grant you health, endless happiness, and success in everything you pursue this year and always. I ask the Allah Almighty to bless you abundantly and keep you safe and shining.
        </p>
        <p className="text-lg sm:text-xl mt-4 font-semibold text-yellow-500">
          Hope your day is as beautiful as your smile ✨<br /><br />
          Love you always.
        </p>
      </div>
    </div>
  );


  // --- Render Logic ---

  // --- 5-Second Loading Screen ---
  if (isLoading) {
    return (
      <div 
        className="flex flex-col justify-center items-center min-h-screen bg-pink-50 p-4 font-sans relative overflow-hidden"
        aria-live="polite"
        aria-busy="true"
      >
        <RenderStyles />
        <FloatingBackground /> 
        
        <div className="relative z-10 p-8 sm:p-10 border-4 border-pink-500 rounded-3xl shadow-2xl bg-white max-w-sm w-full text-center mobile-layout">
          
          {/* Pink Balloon Floating Animation (front-facing) */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-6xl float-animation">
            <span role="img" aria-label="pink balloon">🎈</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold text-pink-600 mb-6 mt-4 tracking-tight">
            Loading positivity for your special day
          </h1>
          
          {/* Icons/Emojis */}
          <div className="flex justify-center space-x-6 text-4xl sm:text-5xl">
            <span className="hover:scale-110 transition-transform duration-300" role="img" aria-label="Heart">❤️</span>
            <span className="hover:scale-110 transition-transform duration-300" role="img" aria-label="Surprise">🎉</span>
            <span className="hover:scale-110 transition-transform duration-300" role="img" aria-label="Cake">🎂</span>
          </div>

          {/* Simple Loading Bar Placeholder */}
          <div className="mt-8 h-2 bg-pink-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-pink-500 animate-pulse" 
              style={{ width: '100%', animationDuration: '5s' }}
            />
          </div>

        </div>
      </div>
    );
  }

  // --- 10-Second Countdown Screen ---
  if (isCountingDown) {
    return (
      <div 
        className="flex flex-col justify-center items-center min-h-screen bg-purple-50 p-4 font-sans relative overflow-hidden"
        aria-live="polite"
      >
        <RenderStyles />
        <FloatingBackground />
        
        <div className="relative z-10 p-8 sm:p-12 border-4 border-purple-600 rounded-3xl shadow-2xl bg-white max-w-sm w-full text-center pop-in-animation">
          
          <h1 className="text-xl sm:text-2xl font-semibold text-purple-700 mb-6 tracking-tight">
            Loading your birthday surprise in
          </h1>
          
          {/* Timer Display with Clock Icon */}
          <div className="flex items-center justify-center space-x-4">
            <span className="text-4xl sm:text-5xl" role="img" aria-label="Clock">⏰</span>
            <span className="text-6xl sm:text-8xl font-black text-purple-900 transition-colors duration-500 tabular-nums">
              {countdown}
            </span>
            <span className="text-3xl text-purple-600">s</span>
          </div>

          <p className="mt-4 text-sm text-gray-500">Get ready!</p>

        </div>
      </div>
    );
  }

  // --- Main Birthday Content (after countdown) ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 to-purple-400 p-4 sm:p-8 flex flex-col items-center justify-center font-sans relative overflow-hidden min-w-0">
      <RenderStyles />
      <FloatingBackground /> 
      <BurstEmojis />
      <GreetingCardModal />

      <div className="relative z-10 w-full max-w-xl bg-white p-6 sm:p-10 rounded-3xl shadow-2xl text-center border-4 border-pink-500">
        
        <h1 className="text-5xl sm:text-7xl font-extrabold text-pink-600 mb-4 tracking-tight">
          Happy Birthday Dear Naimal🥳
        </h1>
        
        {/* Large Cake Emoji */}
        <div className="text-8xl sm:text-9xl my-8">
          🎂
        </div>

        <button 
          onClick={() => setIsCardOpen(true)}
          className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full hover:bg-purple-700 transition duration-300 shadow-xl active:scale-95 transform hover:scale-105 mt-4"
        >
          Open Your Birthday Greeting Card
        </button>
      </div>
      
      <footer className="mt-8 text-white text-sm opacity-80 z-10">
        Created with love.
      </footer>
    </div>
  );
};

export default App;