
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Volume2 } from 'lucide-react';

interface AvatarProps {
  text: string;
  onTextChange: (text: string) => void;
  onSpeak: () => void;
  isSpeaking: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ text, onTextChange, onSpeak, isSpeaking }) => {
  const [mouthShape, setMouthShape] = useState<'closed' | 'small' | 'medium' | 'wide' | 'oh'>('closed');
  const mouthAnimationRef = useRef<NodeJS.Timeout | null>(null);

  // Only animate mouth when speaking
  useEffect(() => {
    if (isSpeaking) {
      const animateMouth = () => {
        const mouthShapes: Array<'closed' | 'small' | 'medium' | 'wide' | 'oh'> = ['small', 'medium', 'wide', 'oh', 'medium', 'small'];
        let currentIndex = 0;
        
        const interval = setInterval(() => {
          setMouthShape(mouthShapes[currentIndex]);
          currentIndex = (currentIndex + 1) % mouthShapes.length;
        }, 120 + Math.random() * 80); // Vary timing for more natural feel
        
        mouthAnimationRef.current = interval;
      };
      
      animateMouth();
    } else {
      setMouthShape('closed');
      if (mouthAnimationRef.current) {
        clearInterval(mouthAnimationRef.current);
      }
    }

    return () => {
      if (mouthAnimationRef.current) {
        clearInterval(mouthAnimationRef.current);
      }
    };
  }, [isSpeaking]);

  const getMouthComponent = () => {
    const baseClasses = "relative transition-all duration-100 transform";
    
    switch (mouthShape) {
      case 'small':
        return (
          <div className={`${baseClasses} w-16 h-8`}>
            <div className="w-full h-full bg-gradient-to-b from-red-500 to-red-700 rounded-full shadow-2xl border-2 border-red-800">
              <div className="w-8 h-2 bg-white rounded-sm mx-auto mt-2 opacity-80"></div>
            </div>
          </div>
        );
      case 'medium':
        return (
          <div className={`${baseClasses} w-20 h-12`}>
            <div className="w-full h-full bg-gradient-to-b from-red-500 to-red-800 rounded-full shadow-2xl border-2 border-red-900">
              <div className="w-10 h-3 bg-white rounded-sm mx-auto mt-3 opacity-90"></div>
              <div className="w-6 h-2 bg-pink-300 rounded-full mx-auto mt-1"></div>
            </div>
          </div>
        );
      case 'wide':
        return (
          <div className={`${baseClasses} w-24 h-10`}>
            <div className="w-full h-full bg-gradient-to-b from-red-500 to-red-800 rounded-full shadow-2xl border-2 border-red-900">
              <div className="w-14 h-3 bg-white rounded-sm mx-auto mt-2 opacity-90"></div>
              <div className="w-8 h-2 bg-pink-300 rounded-full mx-auto mt-1"></div>
            </div>
          </div>
        );
      case 'oh':
        return (
          <div className={`${baseClasses} w-18 h-20`}>
            <div className="w-full h-full bg-gradient-to-b from-red-600 to-red-900 rounded-full shadow-2xl border-2 border-red-900">
              <div className="w-8 h-4 bg-white rounded-sm mx-auto mt-4 opacity-80"></div>
              <div className="w-10 h-6 bg-pink-400 rounded-full mx-auto mt-2"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className={`${baseClasses} w-12 h-3`}>
            <div className="w-full h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-lg border border-red-700"></div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Cool Animated Mouth - Only Element */}
      <div className="relative flex items-center justify-center min-h-[120px]">
        {/* Glow effect behind mouth */}
        <div className={`absolute inset-0 bg-gradient-to-r from-red-400/30 to-pink-400/30 rounded-full blur-xl transition-all duration-300 ${
          isSpeaking ? 'scale-150 opacity-70' : 'scale-100 opacity-30'
        }`}></div>
        
        {/* Main mouth component */}
        {getMouthComponent()}
        
        {/* Sparkle effects when speaking */}
        {isSpeaking && (
          <>
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-pink-400 rounded-full animate-ping delay-100"></div>
            <div className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full animate-pulse delay-200"></div>
          </>
        )}
      </div>
      
      {/* Text Input */}
      <div className="w-full max-w-md">
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Enter text for the mouth to speak..."
          className="w-full h-24 p-4 border-2 border-gray-300 rounded-lg resize-none focus:border-red-500 focus:outline-none text-gray-700"
          disabled={isSpeaking}
        />
      </div>
      
      {/* Speak Button */}
      <button
        onClick={onSpeak}
        disabled={!text.trim() || isSpeaking}
        className={`flex items-center space-x-2 px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 shadow-lg ${
          isSpeaking
            ? 'bg-red-500 hover:bg-red-600'
            : text.trim()
            ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 hover:scale-105'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {isSpeaking ? (
          <>
            <Volume2 className="w-5 h-5" />
            <span>Speaking...</span>
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            <span>Speak</span>
          </>
        )}
      </button>
    </div>
  );
};

export default Avatar;
