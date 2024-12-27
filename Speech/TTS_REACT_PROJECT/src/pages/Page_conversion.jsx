import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, AudioLines, FileText, Activity } from 'lucide-react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

const PageConversion = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioUrl]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e) => {
    if (audioRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * audioRef.current.duration;
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleConvert = async () => {
    if (!text.trim()) {
      alert('Please enter some text.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/api/tts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error('Error converting text to speech:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-[Poppins]">
      <div className="max-w-5xl mx-auto pt-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="p-6">
            <textarea
              rows="5"
              placeholder="Our voice generator can deliver high-quality, human-like speech, perfect for audiobooks, video voiceovers, commercials, and more."
              className="w-full h-40 p-4 text-gray-700 bg-gray-50 rounded-xl resize-none border-2 border-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-200"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <select className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-700 focus:border-indigo-500 focus:outline-none hover:border-gray-300 transition-all duration-200">
                  <option>ALICE</option>
                </select>
                <div className="text-sm text-gray-500 italic">* Text will be generated in English</div>
              </div>

              <Button
                onClick={handleConvert}
                disabled={isLoading}
                className="rounded-full bg-black hover:bg-gray-800 text-white px-6 py-2 flex items-center gap-2 transition-all duration-300"
              >
                {isLoading ? (
                  <span>Converting...</span>
                ) : (
                  <>
                    <span>Convert</span>
                    <AudioLines className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {audioUrl && (
            <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
              
              <div className="flex flex-col gap-4">
                {/* Audio visualization */}
                <div className="relative h-12 bg-gray-100 rounded-xl overflow-hidden" ref={progressBarRef} onClick={handleProgressClick}>
                  <div 
                    className="absolute h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-150"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="w-full h-8 text-gray-300" />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <div className="text-sm text-gray-600 font-medium">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-24 accent-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageConversion;