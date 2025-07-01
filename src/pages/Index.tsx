
import React, { useState, useRef, useCallback } from 'react';
import Avatar from '../components/Avatar';

const Index = () => {
  const [text, setText] = useState("Hello! I'm your AI avatar assistant. Type something for me to say!");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mouthAnimationRef = useRef<NodeJS.Timeout | null>(null);

  const handleSpeak = useCallback(() => {
    if (!text.trim() || isSpeaking) return;

    // Cancel any existing speech
    window.speechSynthesis.cancel();

    // Clear any existing mouth animation
    if (mouthAnimationRef.current) {
      clearTimeout(mouthAnimationRef.current);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    speechRef.current = utterance;

    // Configure speech settings for natural sound
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    // Try to use a more natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(voice => 
      voice.name.includes('Natural') || 
      voice.name.includes('Enhanced') ||
      voice.name.includes('Premium') ||
      voice.lang.includes('en-US')
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      console.log('Speech started');
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log('Speech ended');
      setIsSpeaking(false);
      speechRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event.error);
      setIsSpeaking(false);
      speechRef.current = null;
    };

    // Start speaking
    window.speechSynthesis.speak(utterance);
  }, [text, isSpeaking]);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (mouthAnimationRef.current) {
      clearTimeout(mouthAnimationRef.current);
    }
  }, []);

  // Load voices when component mounts
  React.useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log('Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
    };

    // Load voices immediately if available
    loadVoices();

    // Also load when voices change (some browsers load them asynchronously)
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Avatar Speaker
          </h1>
          <p className="text-xl text-gray-600">
            Watch the avatar come to life as it speaks your words
          </p>
        </div>

        {/* Avatar Component */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm bg-white/90">
          <Avatar
            text={text}
            onTextChange={setText}
            onSpeak={handleSpeak}
            isSpeaking={isSpeaking}
          />
          
          {/* Stop Button (when speaking) */}
          {isSpeaking && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleStop}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-300 shadow-lg hover:scale-105"
              >
                Stop Speaking
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            💡 Tip: The avatar's mouth will animate and sync with the speech. Try different phrases to see the expressions!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
