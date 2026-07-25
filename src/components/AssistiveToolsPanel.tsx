import React, { useState } from 'react';
import { Bus, CloudSun, Search, ZoomIn, Volume2, MapPin, Compass, ArrowRight } from 'lucide-react';
import { soundFx, speakText } from '../utils/audio';

interface AssistiveToolsPanelProps {
  onExecuteTool: (toolName: string, query?: string) => void;
  toolResult: any;
  isExecutingTool: boolean;
  speechRate: number;
}

export const AssistiveToolsPanel: React.FC<AssistiveToolsPanelProps> = ({
  onExecuteTool,
  toolResult,
  isExecutingTool,
  speechRate,
}) => {
  const [activeTab, setActiveTab] = useState<'bus' | 'weather' | 'search' | 'magnifier'>('bus');
  const [busQuery, setBusQuery] = useState<string>('Bus 38');
  const [storeQuery, setStoreQuery] = useState<string>('Boulangerie Le Pain Doré');
  const [magnifierText, setMagnifierText] = useState<string>('Boulangerie Le Pain Doré - Ouvert de 07h00 à 19h30. Ligne 38 : Prochain passage à 3 min.');
  const [textSize, setTextSize] = useState<number>(24);

  const handleBusLookup = () => {
    soundFx.playTactileClick();
    onExecuteTool('get_bus_schedule', busQuery);
  };

  const handleWeatherLookup = () => {
    soundFx.playTactileClick();
    onExecuteTool('get_weather');
  };

  const handleStoreSearch = () => {
    soundFx.playTactileClick();
    onExecuteTool('search_local_info', storeQuery);
  };

  const handleReadMagnifierText = () => {
    soundFx.playTactileClick();
    speakText(magnifierText, 'fr-FR', speechRate);
  };

  return (
    <div className="w-full bg-[#1C1C1E] border border-[#333336] rounded-3xl p-5 flex flex-col gap-4 shadow-xl">
      {/* Tool Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => {
            soundFx.playTactileClick();
            setActiveTab('bus');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'bus'
              ? 'bg-[#E6FF00] text-black shadow-md'
              : 'bg-black text-white hover:border-[#E6FF00] border border-[#333336]'
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>Bus & Transports</span>
        </button>

        <button
          onClick={() => {
            soundFx.playTactileClick();
            setActiveTab('weather');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'weather'
              ? 'bg-[#E6FF00] text-black shadow-md'
              : 'bg-black text-white hover:border-[#E6FF00] border border-[#333336]'
          }`}
        >
          <CloudSun className="w-4 h-4" />
          <span>Météo Sortie</span>
        </button>

        <button
          onClick={() => {
            soundFx.playTactileClick();
            setActiveTab('search');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'search'
              ? 'bg-[#E6FF00] text-black shadow-md'
              : 'bg-black text-white hover:border-[#E6FF00] border border-[#333336]'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Horaires Commerces</span>
        </button>

        <button
          onClick={() => {
            soundFx.playTactileClick();
            setActiveTab('magnifier');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'magnifier'
              ? 'bg-[#E6FF00] text-black shadow-md'
              : 'bg-black text-white hover:border-[#E6FF00] border border-[#333336]'
          }`}
        >
          <ZoomIn className="w-4 h-4" />
          <span>Loupe & OCR</span>
        </button>
      </div>

      {/* Tab Content: Bus Transit */}
      {activeTab === 'bus' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={busQuery}
              onChange={(e) => setBusQuery(e.target.value)}
              placeholder="Ex: Bus 38, Tram 1, Arrêt République"
              className="flex-1 bg-black border border-[#333336] rounded-2xl px-4 py-2.5 text-sm text-white font-bold placeholder:text-[#A1A1A6]"
            />
            <button
              onClick={handleBusLookup}
              disabled={isExecutingTool}
              className="px-4 py-2.5 bg-[#E6FF00] hover:bg-[#d8f000] text-black font-black text-xs rounded-2xl flex items-center gap-1.5 shadow"
            >
              <span>Vérifier</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab Content: Weather */}
      {activeTab === 'weather' && (
        <div className="flex items-center justify-between gap-3 bg-black p-4 rounded-2xl border border-[#333336]">
          <div>
            <p className="font-extrabold text-sm text-[#E6FF00]">Prévisions Météo pour Piéton</p>
            <p className="text-xs text-[#A1A1A6]">Température, pluie et visibilité extérieure</p>
          </div>
          <button
            onClick={handleWeatherLookup}
            disabled={isExecutingTool}
            className="px-4 py-2 bg-[#E6FF00] hover:bg-[#d8f000] text-black font-black text-xs rounded-2xl shadow"
          >
            Obtenir la Météo
          </button>
        </div>
      )}

      {/* Tab Content: Local Store Search */}
      {activeTab === 'search' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={storeQuery}
              onChange={(e) => setStoreQuery(e.target.value)}
              placeholder="Ex: Boulangerie Le Pain Doré, Pharmacie"
              className="flex-1 bg-black border border-[#333336] rounded-2xl px-4 py-2.5 text-sm text-white font-bold placeholder:text-[#A1A1A6]"
            />
            <button
              onClick={handleStoreSearch}
              disabled={isExecutingTool}
              className="px-4 py-2.5 bg-[#E6FF00] hover:bg-[#d8f000] text-black font-black text-xs rounded-2xl shadow"
            >
              Rechercher
            </button>
          </div>
        </div>
      )}

      {/* Tab Content: High Contrast Magnifier */}
      {activeTab === 'magnifier' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 border-b border-[#333336] pb-2">
            <span className="text-xs font-bold text-[#A1A1A6]">Taille du Texte : {textSize}px</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTextSize((prev) => Math.max(16, prev - 4))}
                className="px-3 py-1.5 bg-black text-[#E6FF00] border border-[#333336] font-black rounded-xl text-xs"
              >
                A-
              </button>
              <button
                onClick={() => setTextSize((prev) => Math.min(48, prev + 4))}
                className="px-3 py-1.5 bg-black text-[#E6FF00] border border-[#333336] font-black rounded-xl text-xs"
              >
                A+
              </button>
              <button
                onClick={handleReadMagnifierText}
                className="px-3.5 py-1.5 bg-[#E6FF00] text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Lire</span>
              </button>
            </div>
          </div>

          <div className="bg-black border-2 border-[#E6FF00] p-4 rounded-2xl text-[#E6FF00] font-black tracking-wide leading-relaxed shadow-inner overflow-x-auto">
            <p style={{ fontSize: `${textSize}px` }}>{magnifierText}</p>
          </div>
        </div>
      )}

      {/* Display Tool Execution Result */}
      {isExecutingTool ? (
        <div className="p-3 bg-black border border-[#333336] rounded-2xl text-[#E6FF00] font-bold text-xs animate-pulse">
          Interrogation des services en direct...
        </div>
      ) : toolResult ? (
        <div className="p-3 bg-black border border-[#E6FF00]/50 rounded-2xl flex flex-col gap-1 text-white">
          <p className="text-xs font-bold text-[#E6FF00] uppercase tracking-wider">Résultat du Service :</p>
          <p className="text-sm font-semibold leading-relaxed">
            {toolResult.data?.result || toolResult.data?.message || JSON.stringify(toolResult.data)}
          </p>

          {toolResult.data?.arrivals && (
            <div className="mt-2 grid grid-cols-1 gap-1.5">
              {toolResult.data.arrivals.map((arr: any, i: number) => (
                <div key={i} className="flex items-center justify-between bg-[#1C1C1E] p-2.5 rounded-xl border border-[#333336] text-xs">
                  <span className="font-bold text-white">{arr.destination}</span>
                  <span className="font-black text-[#E6FF00]">{arr.minutes} min ({arr.status})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
