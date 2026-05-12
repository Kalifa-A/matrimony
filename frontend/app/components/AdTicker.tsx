"use client";
import React from 'react';

const ads = [
  { id: 1, src: '/ad3.mp4', alt: 'Ad 1' },
  { id: 2, src: '/ad2.jpeg', alt: 'Ad 2' },
  { id: 3, src: '/ad1.jpeg', alt: 'Ad 3' },
  // Duplicate for seamless loop
  {id: 1, src: '/ad4.mp4', alt: 'Ad 1' },
  {id: 2, src: '/ad2.jpeg', alt: 'Ad 2' },
  {id: 3, src: '/ad1.jpeg', alt: 'Ad 3' },
  {id: 1, src: '/ad3.mp4', alt: 'Ad 1' },
  {id: 2, src: '/ad2.jpeg', alt: 'Ad 2' },
  {id: 3, src: '/ad1.jpeg', alt: 'Ad 3' },
];

export default function AdTicker() {
  return (
    <div className="bg-white border-b border-gray-100 relative group/ticker flex flex-col">
      {/* Ticker Section */}
      <div className="overflow-hidden relative h-16 sm:h-20 py-2 w-full">
        {/* Floating Sponsored Label */}
        <div className="absolute top-0 left-4 z-20">
          <span className="bg-gray-900/5 backdrop-blur-sm text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 px-2 py-0.5 rounded-b-lg">
            our other services
          </span>
        </div>
        
        <div className="flex items-center gap-12 animate-marquee whitespace-nowrap min-w-full h-full">
          {ads.map((ad, index) => {
            const isVideo = ad.src.match(/\.(mp4|webm|ogg)$/i);
            return (
              <div key={index} className="flex-shrink-0 h-10 sm:h-14 px-2">
                {isVideo ? (
                  <video 
                    src={ad.src} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="h-full object-contain rounded-xl hover:scale-105 transition-transform duration-300 shadow-sm"
                  />
                ) : (
                  <img 
                    src={ad.src} 
                    alt={ad.alt} 
                    className="h-full object-contain rounded-xl hover:scale-105 transition-transform duration-300 shadow-sm"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Contact Details Bar */}
      <div className="bg-[#9AD872]/10 py-1.5 px-4 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-bold text-[#1a2e1a] border-t border-[#9AD872]/20">
        <span className="tracking-wide">102-k ஜமாலி நகர் பென்னங்கோணம் ரோடு லப்பைகுடிக்காடு பெரம்பலூர் 621108</span>
        <span className="text-[#9AD872] px-1">|</span>
        <span className="text-[#7db55a]">தொடர்புக்கு: 8220121113</span>
      </div>
    </div>
  );
}
