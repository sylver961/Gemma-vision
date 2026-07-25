import React, { useState } from 'react';
import { Brain, Volume2, Square, FileText, Compass, ExternalLink, Sparkles, ShoppingBag, CheckCircle2, MessageSquare, Send, Barcode, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { VisionAnalysisResult, ChatMessage } from '../types';
import { soundFx, speakText, stopSpeaking } from '../utils/audio';

interface CoTPanelProps {
  analysis: VisionAnalysisResult | null;
  isAnalyzing: boolean;
  onExecuteTool: (toolName: string, query?: string) => void;
  isSpeaking: boolean;
  setIsSpeaking: (speaking: boolean) => void;
  speechRate: number;
  activeScenarioImageBase64?: string;
}

export const CoTPanel: React.FC<CoTPanelProps> = ({
  analysis,
  isAnalyzing,
  onExecuteTool,
  isSpeaking,
  setIsSpeaking,
  speechRate,
  activeScenarioImageBase64,
}) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);
  const [showSections, setShowSections] = useState<boolean>(false);

  if (isAnalyzing) {
    return (
      <div className="w-full bg-[#1C1C1E] border-2 border-[#E6FF00]/40 rounded-3xl p-6 text-white animate-pulse flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[#E6FF00] font-bold">
          <Brain className="w-6 h-6 animate-spin" />
          <span>Raisonnement Multimodal Gemma-Eyes en cours...</span>
        </div>
        <div className="h-4 bg-black rounded-lg w-3/4" />
        <div className="h-4 bg-black rounded-lg w-5/6" />
        <div className="h-4 bg-black rounded-lg w-2/3" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="w-full bg-[#1C1C1E] border border-[#333336] rounded-3xl p-8 text-center text-[#A1A1A6] flex flex-col items-center gap-3">
        <Brain className="w-12 h-12 text-[#E6FF00] mb-1" />
        <p className="font-extrabold text-white text-lg">Prêt pour l'analyse visuelle</p>
        <p className="text-xs text-[#A1A1A6] max-w-md leading-relaxed">
          Appuyez sur "SCANNER LA SCÈNE" ou choisissez un scénario (Document, Magasin, Rue, Transport). Gemma Vision analysera le texte, la sécurité et les produits.
        </p>
      </div>
    );
  }

  const handlePlayAudio = (textToSpeak?: string) => {
    soundFx.playTactileClick();
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const text = textToSpeak || analysis.publicResponse;
      speakText(text, 'fr-FR', speechRate, 1.0, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleReadText = (text: string) => {
    soundFx.playTactileClick();
    setIsSpeaking(true);
    speakText(`Texte lu : ${text}`, 'fr-FR', speechRate, 1.0, () => {
      setIsSpeaking(false);
    });
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    soundFx.playTactileClick();

    const userText = chatInput.trim();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsSendingChat(true);

    try {
      const res = await fetch('/api/chat-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userText,
          imageBase64: activeScenarioImageBase64,
        }),
      });
      const data = await res.json();
      const gemmaReply = data.reply || "Désolé, je n'ai pas pu analyser votre question.";

      const gemmaMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'gemma',
        text: gemmaReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, gemmaMsg]);
      speakText(gemmaReply, 'fr-FR', speechRate);
    } catch (err) {
      console.error('Error chatting with Gemma Vision:', err);
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Reasoning & Verbal Answer Box */}
      <div className="bg-[#1C1C1E] border-2 border-[#1C1C1E] rounded-3xl p-6 shadow-2xl relative flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 border-b border-[#333336] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#E6FF00] text-black rounded-xl font-bold">
              <Sparkles className="w-5 h-5 fill-black" />
            </span>
            <div>
              <h2 className="text-lg font-black text-[#E6FF00] uppercase tracking-tight">
                Raisonnement Gemma Vision
              </h2>
              <p className="text-xs text-[#A1A1A6] font-medium">Be My Eyes AI • Assistant vocal pour malvoyants</p>
            </div>
          </div>

          <button
            onClick={() => handlePlayAudio()}
            aria-label={isSpeaking ? "Arrêter la lecture vocale" : "Écouter la réponse vocale"}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md ${
              isSpeaking
                ? 'bg-[#FF3B30] text-white animate-pulse'
                : 'bg-[#E6FF00] hover:bg-[#d8f000] text-black'
            }`}
          >
            {isSpeaking ? (
              <>
                <Square className="w-4 h-4 fill-white" />
                <span>Stopper</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 stroke-[2.5]" />
                <span>Écouter</span>
              </>
            )}
          </button>
        </div>

        {/* Public Answer Text */}
        <div className="bg-black/60 p-4 rounded-2xl border border-[#333336]">
          <p className="text-lg sm:text-xl text-white font-bold leading-relaxed">
            "{analysis.publicResponse}"
          </p>
        </div>

        {/* Summary Chip */}
        <div className="bg-black border border-[#333336] rounded-xl p-3 text-xs text-[#E6FF00] font-mono flex items-center gap-2">
          <span className="font-bold text-[#A1A1A6]">RÉSUMÉ :</span>
          <span>{analysis.summary}</span>
        </div>
      </div>

      {/* DOCUMENT ANALYSIS CARD (If Present) */}
      {analysis.documentAnalysis && (
        <div className="bg-black border-2 border-[#E6FF00] rounded-3xl p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#333336] pb-3">
            <div className="flex items-center gap-2 text-[#E6FF00]">
              <FileText className="w-6 h-6" />
              <h3 className="font-black text-base uppercase tracking-wide">
                Document Détecté : {analysis.documentAnalysis.title}
              </h3>
            </div>
            <span className="px-3 py-1 bg-[#1C1C1E] text-xs font-mono font-bold text-[#E6FF00] border border-[#333336] rounded-full">
              {analysis.documentAnalysis.wordCount} mots
            </span>
          </div>

          {/* Key Info Bullet points */}
          <div className="flex flex-col gap-2 bg-[#1C1C1E] p-4 rounded-2xl border border-[#333336]">
            <p className="text-xs font-bold text-[#A1A1A6] uppercase">Points Clés du Document :</p>
            <ul className="list-disc list-inside text-sm text-white space-y-1 font-medium">
              {analysis.documentAnalysis.keyInfo.map((info, i) => (
                <li key={i}>{info}</li>
              ))}
            </ul>
          </div>

          {/* Confirmation Prompt for Long Document */}
          {analysis.documentAnalysis.confirmationRequired && (
            <div className="p-4 bg-amber-950/40 border border-amber-500/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-300 uppercase">Confirmation demandée</p>
                  <p className="text-xs text-amber-100">
                    Ce document contient plus de 40 mots. Voulez-vous une lecture mot à mot intégrale ?
                  </p>
                </div>
              </div>

              <button
                onClick={() => handlePlayAudio(analysis.documentAnalysis?.fullText)}
                className="px-4 py-2.5 bg-[#E6FF00] text-black font-black text-xs rounded-xl flex items-center gap-2 shadow hover:bg-[#d8f000] self-end sm:self-auto"
              >
                <Volume2 className="w-4 h-4" />
                <span>Lire le texte intégral</span>
              </button>
            </div>
          )}

          {/* Sections Viewer Toggle */}
          {analysis.documentAnalysis.sections && analysis.documentAnalysis.sections.length > 0 && (
            <div>
              <button
                onClick={() => setShowSections(!showSections)}
                className="text-xs font-bold text-[#E6FF00] flex items-center gap-1 hover:underline"
              >
                {showSections ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>{showSections ? "Masquer les sections" : "Afficher la structure par section"}</span>
              </button>

              {showSections && (
                <div className="mt-3 flex flex-col gap-2">
                  {analysis.documentAnalysis.sections.map((sec, i) => (
                    <div key={i} className="bg-[#1C1C1E] p-3 rounded-xl border border-[#333336]">
                      <p className="text-xs font-bold text-[#E6FF00]">{sec.header}</p>
                      <p className="text-xs text-white mt-1">{sec.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* PRODUCT & PACKAGING ANALYSIS CARD (If Present) */}
      {analysis.productAnalysis && (
        <div className="bg-black border-2 border-[#E6FF00] rounded-3xl p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#333336] pb-3">
            <div className="flex items-center gap-2 text-[#E6FF00]">
              <ShoppingBag className="w-6 h-6" />
              <div>
                <h3 className="font-black text-base text-white">
                  {analysis.productAnalysis.productName}
                </h3>
                <p className="text-xs text-[#E6FF00] font-bold">
                  {analysis.productAnalysis.brand} • {analysis.productAnalysis.category}
                </p>
              </div>
            </div>

            {analysis.productAnalysis.price && (
              <span className="px-3 py-1 bg-[#E6FF00] text-black text-sm font-black rounded-xl">
                {analysis.productAnalysis.price}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Barcode & Packaging */}
            <div className="bg-[#1C1C1E] p-3.5 rounded-2xl border border-[#333336] flex flex-col gap-1.5">
              <p className="text-xs font-bold text-[#A1A1A6] uppercase flex items-center gap-1.5">
                <Barcode className="w-4 h-4 text-[#E6FF00]" />
                Code-Barres & Emballage :
              </p>
              <p className="text-sm font-mono font-bold text-[#E6FF00]">
                {analysis.productAnalysis.barcode || "Code-barres EAN scanné"}
              </p>
              <p className="text-xs text-white leading-relaxed">
                {analysis.productAnalysis.packagingDescription}
              </p>
            </div>

            {/* Allergens & Ingredients */}
            <div className="bg-[#1C1C1E] p-3.5 rounded-2xl border border-[#333336] flex flex-col gap-1.5">
              <p className="text-xs font-bold text-[#A1A1A6] uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Allergènes & Composition :
              </p>
              {analysis.productAnalysis.allergens && (
                <p className="text-xs font-bold text-amber-400">
                  {analysis.productAnalysis.allergens.join(', ')}
                </p>
              )}
              {analysis.productAnalysis.ingredients && (
                <p className="text-xs text-[#A1A1A6]">
                  {analysis.productAnalysis.ingredients.join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DISCUSS WITH GEMMA VISION CHAT BOX */}
      <div className="bg-[#1C1C1E] border border-[#333336] rounded-3xl p-5 flex flex-col gap-3 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-[#E6FF00] uppercase tracking-wider">
          <MessageSquare className="w-4 h-4" />
          <span>Discuter avec Gemma Vision (Questions en direct)</span>
        </div>

        {chatMessages.length > 0 && (
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-2xl text-xs sm:text-sm font-medium ${
                  msg.sender === 'user'
                    ? 'bg-[#E6FF00] text-black self-end max-w-[85%] font-bold'
                    : 'bg-black text-white border border-[#333336] self-start max-w-[85%]'
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-[10px] opacity-70 block text-right mt-1">{msg.timestamp}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
            placeholder="Posez une question à Gemma Vision sur le document ou la scène..."
            className="flex-1 bg-black border border-[#333336] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white font-medium placeholder:text-[#A1A1A6]"
          />
          <button
            onClick={handleSendChat}
            disabled={isSendingChat || !chatInput.trim()}
            className="p-3 bg-[#E6FF00] hover:bg-[#d8f000] text-black rounded-2xl font-black transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Shared Chain-of-Thought Reasoning Detail Box (Pensée Interne) */}
      <div className="bg-black border border-[#333336] rounded-3xl p-5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#A1A1A6] uppercase tracking-wider mb-2">
          <Brain className="w-4 h-4 text-[#E6FF00]" />
          <span>Pensée Interne Détaillée (Chain-of-Thought)</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 italic bg-[#1C1C1E] p-4 rounded-2xl border border-[#333336] leading-relaxed font-mono">
          {analysis.thoughtProcess}
        </p>
      </div>

      {/* Detected OCR Texts Section */}
      {analysis.ocrTextDetected && analysis.ocrTextDetected.length > 0 && (
        <div className="bg-[#1C1C1E] border border-[#333336] rounded-3xl p-5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#E6FF00] uppercase tracking-wider mb-3">
            <FileText className="w-4 h-4" />
            <span>Inscriptions & Textes Détectés (OCR)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.ocrTextDetected.map((text, idx) => (
              <button
                key={idx}
                onClick={() => handleReadText(text)}
                aria-label={`Lire le texte : ${text}`}
                className="px-3.5 py-2 bg-black hover:bg-neutral-900 text-white border border-[#333336] hover:border-[#E6FF00] rounded-xl text-xs font-bold flex items-center gap-2 transition-all group"
              >
                <span>{text}</span>
                <Volume2 className="w-3.5 h-3.5 text-[#E6FF00] group-hover:scale-110" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

