import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, HelpCircle, Volume2 } from 'lucide-react';
import { soundFx, speakText } from '../utils/audio';

interface VoiceAssistantControllerProps {
  onSendVoiceQuery: (query: string) => void;
  isAnalyzing: boolean;
  speechRate: number;
}

export const VoiceAssistantController: React.FC<VoiceAssistantControllerProps> = ({
  onSendVoiceQuery,
  isAnalyzing,
  speechRate,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [recognition, setRecognition] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = true;
        reco.lang = 'fr-FR';

        reco.onresult = (event: any) => {
          let currentText = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentText += event.results[i][0].transcript;
          }
          setTranscript(currentText);

          if (event.results[0].isFinal) {
            setIsListening(false);
            if (currentText.trim()) {
              onSendVoiceQuery(currentText.trim());
            }
          }
        };

        reco.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
        };

        reco.onend = () => {
          setIsListening(false);
        };

        setRecognition(reco);
      }
    }
  }, [onSendVoiceQuery]);

  const toggleListening = () => {
    soundFx.playTactileClick();
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else if (recognition) {
      try {
        setTranscript('');
        recognition.start();
        setIsListening(true);
        speakText("Je vous écoute...", "fr-FR", speechRate);
      } catch (e) {
        console.warn("Recognition start error:", e);
      }
    } else {
      alert("La reconnaissance vocale n'est pas supportée par ce navigateur. Utilisez les boutons de questions rapides.");
    }
  };

  const QUICK_PROMPTS = [
    "Gemma, qu'est-ce qu'il y a devant moi ?",
    "Y a-t-il des escaliers ou obstacles ?",
    "Lis tous les textes et panneaux",
    "Quel temps fait-il dehors ?",
    "Appelle un bénévole Be My Eyes",
  ];

  const handleQuickPrompt = (promptText: string) => {
    soundFx.playTactileClick();
    setTranscript(promptText);
    onSendVoiceQuery(promptText);
  };

  return (
    <div className="w-full bg-[#1C1C1E] border border-[#333336] rounded-3xl p-5 flex flex-col gap-4 shadow-xl">
      <div className="flex items-center justify-between gap-2 border-b border-[#333336] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#E6FF00] text-black rounded-xl font-black">
            <Mic className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-black text-base text-[#E6FF00] uppercase tracking-tight">
              Commande Vocale Main-Libre
            </h3>
            <p className="text-xs text-[#A1A1A6]">
              {isListening ? 'Écoute active...' : 'Appuyez pour parler à Gemma'}
            </p>
          </div>
        </div>

        {recognition && (
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
            isListening ? 'bg-[#FF3B30]/20 text-[#FF3B30] border-[#FF3B30]/50 animate-pulse' : 'bg-black text-[#A1A1A6] border-[#333336]'
          }`}>
            {isListening ? 'MICRO ACTIF' : 'MICRO PRÊT'}
          </span>
        )}
      </div>

      {/* Primary Big Tactile Microphone Button */}
      <div className="flex items-center justify-center py-2">
        <button
          onClick={toggleListening}
          disabled={isAnalyzing}
          aria-label={isListening ? "Arrêter la reconnaissance vocale" : "Démarrer la reconnaissance vocale"}
          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl font-black text-white flex flex-col items-center justify-center gap-1 transition-all shadow-2xl active:scale-95 ${
            isListening
              ? 'bg-[#FF3B30] ring-8 ring-[#FF3B30]/30 animate-pulse'
              : 'bg-[#E6FF00] text-black hover:bg-[#d8f000] border-none shadow-[0_0_20px_rgba(230,255,0,0.3)]'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-8 h-8 text-white animate-bounce" />
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-white">Écoute...</span>
            </>
          ) : (
            <>
              <Mic className="w-9 h-9 stroke-[2.5]" />
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-black">PARLER</span>
            </>
          )}
        </button>
      </div>

      {/* Live Transcript Box */}
      {transcript && (
        <div className="bg-black border border-[#333336] rounded-2xl p-3 text-center">
          <p className="text-xs font-bold text-[#A1A1A6] uppercase mb-1">Votre question :</p>
          <p className="text-sm font-bold text-[#E6FF00] font-mono">"{transcript}"</p>
        </div>
      )}

      {/* Quick Tactile Questions */}
      <div className="flex flex-col gap-2 mt-1">
        <p className="text-xs font-bold text-[#A1A1A6] flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#E6FF00]" />
          <span>Questions Rapides Tactiles :</span>
        </p>

        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(promptText)}
              disabled={isAnalyzing}
              className="px-3.5 py-2 bg-black hover:bg-neutral-900 text-white border border-[#333336] hover:border-[#E6FF00] rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 text-left"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E6FF00] flex-shrink-0" />
              <span>{promptText}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
