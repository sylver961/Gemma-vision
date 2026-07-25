import React, { useEffect } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Navigation, ShieldCheck } from 'lucide-react';
import { Obstacle, SafetyLevel } from '../types';
import { soundFx, triggerHaptic, speakText } from '../utils/audio';

interface ObstacleAlertBannerProps {
  safetyLevel: SafetyLevel;
  obstacles: Obstacle[];
  onAcknowledge: () => void;
  speechRate: number;
}

export const ObstacleAlertBanner: React.FC<ObstacleAlertBannerProps> = ({
  safetyLevel,
  obstacles,
  onAcknowledge,
  speechRate,
}) => {
  useEffect(() => {
    if (safetyLevel === 'CRITICAL') {
      soundFx.playCriticalObstacleAlert();
      triggerHaptic([200, 100, 200, 100, 300]);

      // Announce critical warning automatically
      const topHazard = obstacles.find((o) => o.hazardLevel === 'CRITICAL') || obstacles[0];
      if (topHazard) {
        speakText(`ALERTE ! ${topHazard.name} à ${topHazard.distanceMeters} mètres !`, 'fr-FR', speechRate * 1.1, 1.1);
      }
    } else if (safetyLevel === 'WARNING') {
      soundFx.playCautionBeep();
      triggerHaptic([150, 100]);
    }
  }, [safetyLevel, obstacles, speechRate]);

  if (safetyLevel === 'SAFE' && obstacles.length === 0) {
    return (
      <div className="w-full bg-[#1C1C1E] border-2 border-emerald-500/80 rounded-2xl p-4 text-white flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="font-extrabold text-sm sm:text-base text-emerald-400">Aucun obstacle immédiat détecté</p>
            <p className="text-xs text-[#A1A1A6] font-medium">Voie dégagée devant vous. Avancez en toute sécurité.</p>
          </div>
        </div>
      </div>
    );
  }

  const isCritical = safetyLevel === 'CRITICAL';

  return (
    <div
      className={`w-full rounded-2xl p-4 sm:p-5 shadow-2xl transition-all ${
        isCritical
          ? 'bg-[#FF3B30] text-white animate-[pulse_1.5s_infinite]'
          : 'bg-[#E6FF00] text-black'
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-black/20">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full border-3 flex items-center justify-center font-black text-xl flex-shrink-0 ${
            isCritical ? 'border-white text-white' : 'border-black text-black'
          }`}>
            !
          </div>
          <div>
            <h3 className="font-black text-lg sm:text-xl uppercase tracking-tight">
              {isCritical ? 'OBSTACLE DROIT DEVANT !' : 'ATTENTION - OBSTACLES DÉTECTÉS'}
            </h3>
            <p className={`text-xs font-bold ${isCritical ? 'text-white/90' : 'text-black/80'}`}>
              {obstacles.length} obstacle(s) identifié(s) sur votre trajectoire
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundFx.playTactileClick();
            onAcknowledge();
          }}
          aria-label="Acquitter l'alerte de sécurité"
          className={`px-4 py-2 font-black text-xs rounded-xl flex items-center gap-1.5 shadow transition-all ${
            isCritical ? 'bg-black text-white hover:bg-neutral-900' : 'bg-black text-[#E6FF00] hover:bg-neutral-900'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>Compris</span>
        </button>
      </div>

      {/* Obstacles List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {obstacles.map((obs) => {
          return (
            <div
              key={obs.id}
              className={`p-3 rounded-xl flex items-start gap-3 ${
                isCritical
                  ? 'bg-black/40 text-white border border-white/20'
                  : 'bg-black/90 text-white border border-black'
              }`}
            >
              <div className="p-2 bg-black rounded-lg text-[#E6FF00] flex-shrink-0">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-extrabold text-sm truncate">{obs.name}</p>
                  <span className="text-xs font-black bg-[#E6FF00] text-black px-2 py-0.5 rounded">
                    {obs.distanceMeters} m
                  </span>
                </div>
                <p className="text-xs opacity-90 mt-0.5 leading-snug">
                  {obs.description} (Côté: <strong className="uppercase">{obs.position}</strong>)
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
