
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

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
        }, 150 + Math.random() * 100); // Vary timing for more natural feel
        
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

  const getMouthStyle = () => {
    const baseClasses = "absolute top-44 left-1/2 transform -translate-x-1/2 transition-all duration-100";
    
    switch (mouthShape) {
      case 'small':
        return `${baseClasses} w-4 h-3 bg-red-400 rounded-full`;
      case 'medium':
        return `${baseClasses} w-6 h-4 bg-red-500 rounded-full`;
      case 'wide':
        return `${baseClasses} w-8 h-3 bg-red-500 rounded-full`;
      case 'oh':
        return `${baseClasses} w-5 h-7 bg-red-600 rounded-full`;
      default:
        return `${baseClasses} w-4 h-1 bg-red-300 rounded-full`;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Avatar Container */}
      <div className="relative">
        {/* Avatar Head - completely static */}
        <div className="relative w-64 h-80 bg-gradient-to-b from-amber-100 to-amber-200 rounded-t-full rounded-b-3xl shadow-2xl border-4 border-amber-300">
          {/* Face Shadow */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-300/20 rounded-t-full rounded-b-3xl"></div>
          
          {/* Static Eyes - no expressions or changes */}
          <div className="absolute top-20 left-12 w-8 h-12 bg-white rounded-full shadow-inner">
            <div className="w-6 h-6 bg-blue-600 rounded-full mt-3 ml-1">
              <div className="w-2 h-2 bg-white rounded-full mt-1 ml-1"></div>
            </div>
          </div>
          <div className="absolute top-20 right-12 w-8 h-12 bg-white rounded-full shadow-inner">
            <div className="w-6 h-6 bg-blue-600 rounded-full mt-3 ml-1">
              <div className="w-2 h-2 bg-white rounded-full mt-1 ml-1"></div>
            </div>
          </div>
          
          {/* Static Eyebrows - no movement */}
          <div className="absolute top-16 left-10 w-12 h-2 bg-amber-600 rounded-full transform -rotate-12"></div>
          <div className="absolute top-16 right-10 w-12 h-2 bg-amber-600 rounded-full transform rotate-12"></div>
          
          {/* Nose */}
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-3 h-6 bg-gradient-to-b from-amber-300 to-amber-400 rounded-full shadow-sm"></div>
          
          {/* Only the mouth animates */}
          <div className={getMouthStyle()}>
            {/* Teeth visible for wider mouth shapes */}
            {(mouthShape === 'wide' || mouthShape === 'oh') && (
              <div className="w-4 h-1 bg-white rounded-sm mx-auto mt-1"></div>
            )}
            {/* Tongue for 'oh' shape */}
            {mouthShape === 'oh' && (
              <div className="w-3 h-2 bg-pink-300 rounded-full mx-auto mt-2"></div>
            )}
          </div>
          
          {/* Static Cheeks - no changes */}
          <div className="absolute top-36 left-6 w-6 h-6 bg-pink-200 rounded-full opacity-40"></div>
          <div className="absolute top-36 right-6 w-6 h-6 bg-pink-200 rounded-full opacity-40"></div>
          
          {/* Hair */}
          <div className="absolute -top-4 left-4 right-4 h-16 bg-gradient-to-b from-amber-800 to-amber-700 rounded-t-full shadow-lg"></div>
          <div className="absolute -top-2 left-2 right-2 h-12 bg-gradient-to-b from-amber-700 to-amber-600 rounded-t-full"></div>
        </div>
        
        {/* Neck */}
        <div className="w-20 h-12 bg-gradient-to-b from-amber-200 to-amber-300 mx-auto rounded-b-lg shadow-lg"></div>
        
        {/* Body */}
        <div className="w-40 h-20 bg-gradient-to-b from-blue-500 to-blue-600 mx-auto rounded-t-3xl shadow-lg mt-2">
          {/* Shirt details */}
          <div className="w-32 h-4 bg-blue-400 mx-auto rounded-t-3xl mt-2"></div>
        </div>
      </div>
      
      {/* Text Input */}
      <div className="w-full max-w-md">
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Enter text for the avatar to speak..."
          className="w-full h-24 p-4 border-2 border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:outline-none text-gray-700"
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
            ? 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
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
