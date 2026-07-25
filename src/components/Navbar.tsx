import React from 'react';
import { Eye, ShieldAlert, Volume2, VolumeX, Settings, Smartphone, Users, Zap } from 'lucide-react';
import { AccessibilitySettings } from '../types';

interface NavbarProps {
  settings: AccessibilitySettings;
  setSettings: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  onOpenSettings: () => void;
  onOpenBeMyEyes: () => void;
  isAutoScanning: boolean;
  onToggleAutoScan: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onEmergencyAlarm: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  setSettings,
  onOpenSettings,
  onOpenBeMyEyes,
  isAutoScanning,
  onToggleAutoScan,
  isMuted,
  onToggleMute,
  onEmergencyAlarm,
}) => {
  return (
    <header className="w-full bg-[#050505] border-b-2 border-[#1C1C1E] px-4 sm:px-8 py-4 text-white flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40">
      {/* App Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded-full bg-[#E6FF00] shadow-[0_0_12px_#E6FF00]" />
        <div className="p-2 bg-[#E6FF00] text-black rounded-xl font-black flex items-center justify-center shadow-lg">
          <Eye className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            GEMMA-EYES
            <span className="text-[10px] bg-[#E6FF00]/10 text-[#E6FF00] px-2 py-0.5 rounded-full border border-[#E6FF00]/30 font-mono tracking-widest font-bold">
              VISION IA
            </span>
          </h1>
          <p className="text-xs text-[#A1A1A6] font-medium hidden sm:block">
            Moteur de raisonnement multimodal pour l'assistance visuelle
          </p>
        </div>
      </div>

      {/* Quick Tactile Actions */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Auto Safety Radar Scanner Button */}
        <button
          onClick={onToggleAutoScan}
          aria-label={isAutoScanning ? "Désactiver le radar de sécurité" : "Activer le radar de sécurité automatique"}
          className={`px-3.5 py-2 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all border ${
            isAutoScanning
              ? 'bg-[#E6FF00] text-black border-[#E6FF00] shadow-[0_0_12px_rgba(230,255,0,0.4)] animate-pulse'
              : 'bg-[#1C1C1E] text-white hover:bg-[#2C2C2E] border-[#333336]'
          }`}
        >
          <Zap className={`w-4 h-4 ${isAutoScanning ? 'fill-black' : 'text-[#E6FF00]'}`} />
          <span className="hidden xs:inline">
            {isAutoScanning ? 'Radar Actif' : 'Radar Auto'}
          </span>
        </button>

        {/* Be My Eyes Connection */}
        <button
          onClick={onOpenBeMyEyes}
          aria-label="Ouvrir l'assistance bénévole Be My Eyes"
          className="px-3.5 py-2 bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center gap-2 border border-[#333336] hover:border-[#E6FF00] transition-all"
        >
          <Users className="w-4 h-4 text-[#E6FF00]" />
          <span className="hidden sm:inline">Be My Eyes</span>
        </button>

        {/* Mute/Unmute Voice Audio */}
        <button
          onClick={onToggleMute}
          aria-label={isMuted ? "Activer le son de la voix" : "Couper le son de la voix"}
          className={`p-2.5 rounded-2xl font-bold transition-all border ${
            isMuted
              ? 'bg-[#FF3B30]/20 text-[#FF3B30] border-[#FF3B30]/50'
              : 'bg-[#1C1C1E] text-[#E6FF00] border-[#333336] hover:bg-[#2C2C2E]'
          }`}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* Emergency SOS Alarm Button */}
        <button
          onClick={onEmergencyAlarm}
          aria-label="Alarme de détresse SOS"
          className="px-4 py-2 bg-[#FF3B30] hover:bg-[#E02D22] text-white font-black text-xs sm:text-sm rounded-2xl flex items-center gap-1.5 shadow-lg shadow-[#FF3B30]/30 active:scale-95 border border-white/20"
        >
          <ShieldAlert className="w-4 h-4 animate-bounce" />
          <span>SOS</span>
        </button>

        {/* Toggle Smartphone Bezel Shell */}
        <button
          onClick={() =>
            setSettings((prev) => ({
              ...prev,
              smartphoneShellEnabled: !prev.smartphoneShellEnabled,
            }))
          }
          aria-label="Basculer le mode smartphone"
          className={`p-2.5 rounded-2xl border font-bold hidden md:flex items-center justify-center transition-all ${
            settings.smartphoneShellEnabled
              ? 'bg-[#E6FF00] text-black border-[#E6FF00]'
              : 'bg-[#1C1C1E] text-white border-[#333336] hover:bg-[#2C2C2E]'
          }`}
          title="Mode Écran Smartphone"
        >
          <Smartphone className="w-5 h-5" />
        </button>

        {/* Settings Modal Toggle */}
        <button
          onClick={onOpenSettings}
          aria-label="Paramètres d'accessibilité"
          className="p-2.5 bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white border border-[#333336] hover:border-[#E6FF00] rounded-2xl transition-all"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
