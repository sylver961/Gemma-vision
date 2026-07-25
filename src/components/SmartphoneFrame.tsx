import React from 'react';
import { Smartphone, BatteryCharging, Wifi, Signal } from 'lucide-react';

interface SmartphoneFrameProps {
  children: React.ReactNode;
  enabled: boolean;
}

export const SmartphoneFrame: React.FC<SmartphoneFrameProps> = ({ children, enabled }) => {
  if (!enabled) {
    return <div className="w-full min-h-screen bg-[#050505] text-white flex flex-col">{children}</div>;
  }

  const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-2 sm:p-6 overflow-x-hidden">
      {/* Smartphone Outer Physical Frame */}
      <div className="relative w-full max-w-[440px] h-[92vh] max-h-[920px] bg-[#1C1C1E] border-[8px] border-[#333336] rounded-[48px] shadow-[0_25px_60px_-15px_rgba(230,255,0,0.15)] flex flex-col overflow-hidden ring-2 ring-[#E6FF00]/50">
        
        {/* Top Status Bar & Camera Notch */}
        <div className="w-full bg-[#050505] px-6 py-2 flex items-center justify-between text-[11px] font-mono text-[#A1A1A6] z-30 select-none border-b border-[#1C1C1E]">
          <span className="font-bold text-white">{currentTimeStr}</span>

          {/* Notch Pill */}
          <div className="w-24 h-4 bg-[#1C1C1E] rounded-full flex items-center justify-center gap-2 px-2 border border-[#333336]">
            <span className="w-2.5 h-2.5 rounded-full bg-black ring-1 ring-[#333336]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#E6FF00]" />
          </div>

          <div className="flex items-center gap-1.5 text-[#A1A1A6]">
            <Signal className="w-3 h-3 text-[#E6FF00]" />
            <Wifi className="w-3 h-3 text-[#E6FF00]" />
            <BatteryCharging className="w-3.5 h-3.5 text-[#E6FF00]" />
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto bg-[#050505] flex flex-col">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="w-full bg-[#050505] py-2 flex justify-center items-center select-none z-30 border-t border-[#1C1C1E]">
          <div className="w-32 h-1 bg-[#333336] rounded-full" />
        </div>
      </div>
    </div>
  );
};
