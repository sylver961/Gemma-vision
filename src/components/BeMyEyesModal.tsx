import React, { useState } from 'react';
import { Users, PhoneCall, PhoneOff, Video, Mic, Volume2, ShieldCheck, Heart, Sparkles, Globe, X, FileText, ShoppingBag, Eye, Bot } from 'lucide-react';
import { BE_MY_EYES_INFO, MOCK_VOLUNTEERS } from '../data/beMyEyesInfo';
import { BeMyEyesVolunteer } from '../types';
import { soundFx, speakText } from '../utils/audio';

interface BeMyEyesModalProps {
  isOpen: boolean;
  onClose: () => void;
  speechRate: number;
}

export const BeMyEyesModal: React.FC<BeMyEyesModalProps> = ({ isOpen, onClose, speechRate }) => {
  const [activeTab, setActiveTab] = useState<'volunteers' | 'ai'>('ai');
  const [activeCallVolunteer, setActiveCallVolunteer] = useState<BeMyEyesVolunteer | null>(null);
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');

  if (!isOpen) return null;

  const handleStartCall = (volunteer: BeMyEyesVolunteer) => {
    soundFx.playTactileClick();
    setActiveCallVolunteer(volunteer);
    setCallStatus('connecting');
    speakText(`Connexion à Be My Eyes avec ${volunteer.name}...`, 'fr-FR', speechRate);

    setTimeout(() => {
      setCallStatus('connected');
      soundFx.playCautionBeep();
      speakText(`Appel connecté avec ${volunteer.name}. Bonjour !`, 'fr-FR', speechRate);
    }, 2500);
  };

  const handleEndCall = () => {
    soundFx.playTactileClick();
    setCallStatus('idle');
    setActiveCallVolunteer(null);
    speakText("Appel Be My Eyes terminé.", 'fr-FR', speechRate);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#1C1C1E] border-2 border-[#333336] rounded-3xl shadow-2xl p-6 text-white flex flex-col gap-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#333336] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#E6FF00] text-black rounded-2xl shadow-lg">
              <Eye className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#E6FF00] flex items-center gap-2">
                Be My Eyes API
                <span className="text-xs bg-black text-[#E6FF00] px-2.5 py-0.5 rounded-full border border-[#333336] font-mono">
                  Gemma-Eyes Powered
                </span>
              </h2>
              <p className="text-xs text-[#A1A1A6]">Réseau mondial d'assistance humaine & Agent IA Multimodal</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playTactileClick();
              onClose();
            }}
            aria-label="Fermer la fenêtre Be My Eyes"
            className="p-2.5 bg-black hover:bg-neutral-900 text-white rounded-2xl border border-[#333336]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 bg-black rounded-2xl border border-[#333336]">
          <button
            onClick={() => {
              soundFx.playTactileClick();
              setActiveTab('ai');
            }}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'ai'
                ? 'bg-[#E6FF00] text-black shadow-md'
                : 'text-[#A1A1A6] hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Be My Eyes AI (Gemma Vision)</span>
          </button>

          <button
            onClick={() => {
              soundFx.playTactileClick();
              setActiveTab('volunteers');
            }}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'volunteers'
                ? 'bg-[#E6FF00] text-black shadow-md'
                : 'text-[#A1A1A6] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Bénévoles Voyants 24/7</span>
          </button>
        </div>

        {/* TAB 1: GEMMA VISION AI ASSISTANT */}
        {activeTab === 'ai' && (
          <div className="flex flex-col gap-4">
            <div className="bg-black border border-[#333336] rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#E6FF00]">
                <Sparkles className="w-5 h-5 fill-[#E6FF00]" />
                <h3 className="font-black text-sm uppercase tracking-wide">
                  Fonctionnalités Avancées Be My Eyes AI
                </h3>
              </div>
              <p className="text-xs text-[#A1A1A6] leading-relaxed">
                Connecté via l'API Be My Eyes à Gemma-Eyes. Analyse visuelle rapide, raisonnement spatial à voix haute (CoT) et interaction naturelle en direct.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* OCR Full Document Card */}
              <div className="bg-black p-4 rounded-2xl border border-[#333336] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[#E6FF00]">
                  <FileText className="w-5 h-5" />
                  <p className="font-black text-sm text-white">Lecture de Documents OCR</p>
                </div>
                <p className="text-xs text-[#A1A1A6] leading-relaxed">
                  Transcription intégrale de courriers administratifs, cartes et menus. Rapporte les points clés et demande confirmation avant de lire les textes longs (&gt; 40 mots).
                </p>
              </div>

              {/* Product & Barcode Identification Card */}
              <div className="bg-black p-4 rounded-2xl border border-[#333336] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[#E6FF00]">
                  <ShoppingBag className="w-5 h-5" />
                  <p className="font-black text-sm text-white">Identification Produits Magasin</p>
                </div>
                <p className="text-xs text-[#A1A1A6] leading-relaxed">
                  Scanne les emballages et codes-barres EAN en magasin. Indique la marque, la contenance, le prix, la date de péremption et signale les allergènes dangereux.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE VOLUNTEER CALL */}
        {activeTab === 'volunteers' && (
          <>
            {callStatus !== 'idle' && activeCallVolunteer ? (
              <div className="bg-black border-2 border-[#E6FF00] rounded-3xl p-6 flex flex-col items-center text-center gap-4 shadow-2xl">
                <div className="relative">
                  <img
                    src={activeCallVolunteer.avatarUrl}
                    alt={activeCallVolunteer.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#E6FF00] shadow-xl"
                  />
                  <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-black rounded-full animate-ping" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-white">{activeCallVolunteer.name}</h3>
                  <p className="text-xs text-[#E6FF00] font-bold">{activeCallVolunteer.location} • {activeCallVolunteer.language}</p>
                </div>

                {callStatus === 'connecting' ? (
                  <div className="flex flex-col items-center gap-2 py-3">
                    <div className="w-8 h-8 border-4 border-[#E6FF00] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-bold text-[#E6FF00] animate-pulse">
                      Recherche d'un bénévole voyant disponible...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <span className="px-3.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      APPEL EN COURS • 00:24
                    </span>
                    <p className="text-xs text-[#A1A1A6] max-w-sm">
                      Le bénévole voit votre flux vidéo en direct et vous guide à la voix.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={handleEndCall}
                    className="px-6 py-3 bg-[#FF3B30] hover:bg-rose-600 text-white font-black rounded-2xl flex items-center gap-2 shadow-xl active:scale-95 text-base"
                  >
                    <PhoneOff className="w-5 h-5" />
                    <span>Raccrocher</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="bg-black border border-[#333336] rounded-2xl p-4 flex flex-col gap-3">
                  <p className="text-sm text-white leading-relaxed font-medium">
                    {BE_MY_EYES_INFO.mission}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#333336] text-center">
                    <div className="p-2.5 bg-[#1C1C1E] rounded-xl border border-[#333336]">
                      <p className="text-sm font-black text-[#E6FF00]">{BE_MY_EYES_INFO.stats.volunteers}</p>
                      <p className="text-[10px] text-[#A1A1A6] font-bold">Bénévoles</p>
                    </div>
                    <div className="p-2.5 bg-[#1C1C1E] rounded-xl border border-[#333336]">
                      <p className="text-sm font-black text-white">{BE_MY_EYES_INFO.stats.blindUsers}</p>
                      <p className="text-[10px] text-[#A1A1A6] font-bold">Utilisateurs</p>
                    </div>
                    <div className="p-2.5 bg-[#1C1C1E] rounded-xl border border-[#333336]">
                      <p className="text-sm font-black text-emerald-400">{BE_MY_EYES_INFO.stats.languages}</p>
                      <p className="text-[10px] text-[#A1A1A6] font-bold">Langues</p>
                    </div>
                    <div className="p-2.5 bg-[#1C1C1E] rounded-xl border border-[#333336]">
                      <p className="text-sm font-black text-amber-400">{BE_MY_EYES_INFO.stats.countries}</p>
                      <p className="text-[10px] text-[#A1A1A6] font-bold">Pays</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black text-[#E6FF00] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    Bénévoles Francophones Prêts à Vous Aider :
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {MOCK_VOLUNTEERS.map((vol) => (
                      <div
                        key={vol.id}
                        className="p-4 bg-black border border-[#333336] hover:border-[#E6FF00] rounded-2xl flex flex-col items-center text-center gap-2.5 transition-all"
                      >
                        <img
                          src={vol.avatarUrl}
                          alt={vol.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#E6FF00]"
                        />
                        <div>
                          <p className="font-extrabold text-sm text-white">{vol.name}</p>
                          <p className="text-[11px] text-[#A1A1A6]">{vol.location}</p>
                        </div>

                        <button
                          onClick={() => handleStartCall(vol)}
                          aria-label={`Appeler le bénévole ${vol.name}`}
                          className="w-full py-2 bg-[#E6FF00] hover:bg-[#d8f000] text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Appeler</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

