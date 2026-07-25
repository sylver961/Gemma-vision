import React from 'react';
import { Settings, Volume2, Sliders, Smartphone, X, Check } from 'lucide-react';
import { AccessibilitySettings } from '../types';
import { soundFx } from '../utils/audio';

interface AccessibilitySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  setSettings: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
}

export const AccessibilitySettingsModal: React.FC<AccessibilitySettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  setSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#1C1C1E] border-2 border-[#333336] rounded-3xl shadow-2xl p-6 text-white flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#333336] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#E6FF00] text-black rounded-2xl font-black">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#E6FF00]">Paramètres d'Accessibilité</h2>
              <p className="text-xs text-[#A1A1A6]">Personnalisation de l'assistance visuelle</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playTactileClick();
              onClose();
            }}
            className="p-2.5 bg-black hover:bg-neutral-900 text-white rounded-2xl border border-[#333336]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Contrast Theme Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-[#E6FF00] uppercase tracking-wider">Thème Visuel</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'dark-neon', label: 'Clean Minimalism', color: 'bg-black border-[#E6FF00] text-[#E6FF00]' },
                { id: 'light-contrast', label: 'Clair Élevé', color: 'bg-white border-black text-black' },
                { id: 'amber-charcoal', label: 'Ambre Chaud', color: 'bg-neutral-900 border-amber-500 text-amber-400' },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    soundFx.playTactileClick();
                    setSettings((prev) => ({ ...prev, highContrastMode: theme.id as any }));
                  }}
                  className={`p-3 rounded-2xl border-2 text-xs font-black transition-all flex flex-col items-center gap-1 ${theme.color} ${
                    settings.highContrastMode === theme.id ? 'ring-4 ring-[#E6FF00]/40' : 'opacity-70'
                  }`}
                >
                  <span>{theme.label}</span>
                  {settings.highContrastMode === theme.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Speech Rate Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-black text-[#E6FF00] uppercase tracking-wider">
              <span>Vitesse de la Voix Synthèse:</span>
              <span className="font-mono text-white">{settings.speechRate.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.5"
              step="0.1"
              value={settings.speechRate}
              onChange={(e) => {
                setSettings((prev) => ({ ...prev, speechRate: parseFloat(e.target.value) }));
              }}
              className="w-full accent-[#E6FF00] h-2 bg-black rounded-lg cursor-pointer"
            />
          </div>

          {/* Auto Safety Radar Scan Interval */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-[#E6FF00] uppercase tracking-wider">Fréquence du Radar d'Obstacles Auto</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { sec: 3, label: '3 sec' },
                { sec: 5, label: '5 sec' },
                { sec: 10, label: '10 sec' },
                { sec: 0, label: 'Désactivé' },
              ].map((item) => (
                <button
                  key={item.sec}
                  onClick={() => {
                    soundFx.playTactileClick();
                    setSettings((prev) => ({ ...prev, autoScanIntervalSeconds: item.sec }));
                  }}
                  className={`py-2.5 rounded-2xl border text-xs font-black transition-all ${
                    settings.autoScanIntervalSeconds === item.sec
                      ? 'bg-[#E6FF00] text-black border-[#E6FF00]'
                      : 'bg-black text-white border-[#333336]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Smartphone Frame Toggle */}
          <div className="flex items-center justify-between p-4 bg-black rounded-2xl border border-[#333336]">
            <div>
              <p className="font-bold text-sm text-white">Coque Smartphone Virtuel</p>
              <p className="text-xs text-[#A1A1A6]">Encadrer l'application dans un écran mobile de téléphone</p>
            </div>
            <button
              onClick={() => {
                soundFx.playTactileClick();
                setSettings((prev) => ({
                  ...prev,
                  smartphoneShellEnabled: !prev.smartphoneShellEnabled,
                }));
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                settings.smartphoneShellEnabled ? 'bg-[#E6FF00] text-black' : 'bg-[#1C1C1E] text-[#A1A1A6] border border-[#333336]'
              }`}
            >
              {settings.smartphoneShellEnabled ? 'Activé' : 'Désactivé'}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <button
          onClick={() => {
            soundFx.playTactileClick();
            onClose();
          }}
          className="w-full py-3.5 bg-[#E6FF00] hover:bg-[#d8f000] text-black font-black rounded-2xl shadow-lg text-sm uppercase tracking-wide transition-all"
        >
          Enregistrer & Fermer
        </button>
      </div>
    </div>
  );
};
