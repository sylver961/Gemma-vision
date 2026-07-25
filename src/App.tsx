import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { CameraView } from './components/CameraView';
import { CoTPanel } from './components/CoTPanel';
import { ObstacleAlertBanner } from './components/ObstacleAlertBanner';
import { VoiceAssistantController } from './components/VoiceAssistantController';
import { BeMyEyesModal } from './components/BeMyEyesModal';
import { AssistiveToolsPanel } from './components/AssistiveToolsPanel';
import { AccessibilitySettingsModal } from './components/AccessibilitySettingsModal';
import { SmartphoneFrame } from './components/SmartphoneFrame';
import { AccessibilitySettings, VisionAnalysisResult, SampleScenario, SafetyLevel } from './types';
import { SAMPLE_SCENARIOS } from './data/sampleScenarios';
import { soundFx, speakText, stopSpeaking, triggerHaptic } from './utils/audio';

export default function App() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrastMode: 'dark-neon',
    speechRate: 1.0,
    speechPitch: 1.0,
    voiceLanguage: 'fr-FR',
    autoScanIntervalSeconds: 5,
    soundEffectsVolume: 0.8,
    hapticFeedbackEnabled: true,
    smartphoneShellEnabled: false,
    fontSizeMultiplier: 1.0,
  });

  const [activeScenario, setActiveScenario] = useState<SampleScenario | null>(SAMPLE_SCENARIOS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<VisionAnalysisResult | null>(
    SAMPLE_SCENARIOS[0].simulatedData
  );

  const [isAutoScanning, setIsAutoScanning] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const [beMyEyesOpen, setBeMyEyesOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const [toolResult, setToolResult] = useState<any | null>(null);
  const [isExecutingTool, setIsExecutingTool] = useState<boolean>(false);

  const autoScanTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Send Image Frame to Backend for Multimodal Vision & CoT Reasoning
  const handleAnalyzeVision = useCallback(
    async (imageBase64: string, customPrompt?: string, targetMode?: string) => {
      setIsAnalyzing(true);
      soundFx.playRadarPulse();

      const visionMode = targetMode || (activeScenario?.category === 'document' ? 'document' : activeScenario?.category === 'store' ? 'product' : 'general');

      try {
        const response = await fetch('/api/analyze-vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64,
            prompt: customPrompt,
            mode: visionMode,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`);
        }

        const data: VisionAnalysisResult = await response.json();
        setAnalysisResult(data);

        // Speak public response automatically if audio is not muted
        if (!isMuted && data.publicResponse) {
          setIsSpeaking(true);
          speakText(data.publicResponse, settings.voiceLanguage, settings.speechRate, 1.0, () => {
            setIsSpeaking(false);
          });
        }
      } catch (err) {
        console.warn('Backend API error, falling back to simulated scenario:', err);
        // Fallback to active scenario data if network issue occurs
        const fallback = activeScenario ? activeScenario.simulatedData : SAMPLE_SCENARIOS[0].simulatedData;
        setAnalysisResult(fallback);

        if (!isMuted) {
          speakText(fallback.publicResponse, settings.voiceLanguage, settings.speechRate);
        }
      } finally {
        setIsAnalyzing(false);
      }
    },
    [isMuted, settings, activeScenario]
  );

  // Execute external tools (bus schedule, weather, web store info)
  const handleExecuteTool = async (toolName: string, query?: string) => {
    setIsExecutingTool(true);
    setToolResult(null);

    try {
      const response = await fetch('/api/tool-execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName, query, location: 'Paris' }),
      });

      const data = await response.json();
      setToolResult(data);

      const voiceMsg = data.data?.result || data.data?.message;
      if (voiceMsg && !isMuted) {
        speakText(voiceMsg, settings.voiceLanguage, settings.speechRate);
      }
    } catch (err) {
      console.error('Tool execution error:', err);
      setToolResult({
        data: { message: 'Impossible d\'exécuter le service en direct. Veuillez réessayer.' },
      });
    } finally {
      setIsExecutingTool(false);
    }
  };

  // Voice Command Trigger
  const handleVoiceQuery = (queryText: string) => {
    if (activeScenario?.imageUrl) {
      handleAnalyzeVision(activeScenario.imageUrl, queryText);
    } else {
      // Trigger default scenario or camera scan
      handleAnalyzeVision(SAMPLE_SCENARIOS[0].imageUrl, queryText);
    }
  };

  // Emergency SOS Alarm Trigger
  const handleEmergencyAlarm = () => {
    soundFx.playCriticalObstacleAlert();
    triggerHaptic([300, 100, 300, 100, 300]);
    speakText("ALARME DE DÉTRESSE ACTIVÉE ! Assistance requise immédiatement !", 'fr-FR', settings.speechRate * 1.1);
    alert("SOS Alarme de sécurité activée : Signal sonore émis.");
  };

  // Auto Safety Radar Scan Loop
  useEffect(() => {
    if (isAutoScanning && settings.autoScanIntervalSeconds > 0) {
      autoScanTimerRef.current = setInterval(() => {
        if (!isAnalyzing && activeScenario?.imageUrl) {
          handleAnalyzeVision(activeScenario.imageUrl, "Scan automatique de sécurité du radar");
        }
      }, settings.autoScanIntervalSeconds * 1000);
    } else {
      if (autoScanTimerRef.current) {
        clearInterval(autoScanTimerRef.current);
      }
    }

    return () => {
      if (autoScanTimerRef.current) {
        clearInterval(autoScanTimerRef.current);
      }
    };
  }, [isAutoScanning, settings.autoScanIntervalSeconds, isAnalyzing, activeScenario, handleAnalyzeVision]);

  // Handle Mute Toggle
  const handleToggleMute = () => {
    soundFx.playTactileClick();
    if (!isMuted) {
      stopSpeaking();
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };

  // Acknowledge hazard warning
  const handleAcknowledgeHazard = () => {
    stopSpeaking();
    if (analysisResult) {
      setAnalysisResult({
        ...analysisResult,
        safetyLevel: 'SAFE',
      });
    }
  };

  // Determine container styling based on selected high contrast mode
  let themeBgClass = 'bg-[#050505] text-white';
  if (settings.highContrastMode === 'light-contrast') {
    themeBgClass = 'bg-white text-black';
  } else if (settings.highContrastMode === 'amber-charcoal') {
    themeBgClass = 'bg-zinc-950 text-amber-300';
  }

  return (
    <SmartphoneFrame enabled={settings.smartphoneShellEnabled}>
      <div className={`w-full min-h-screen flex flex-col ${themeBgClass}`}>
        {/* Navigation Bar */}
        <Navbar
          settings={settings}
          setSettings={setSettings}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenBeMyEyes={() => setBeMyEyesOpen(true)}
          isAutoScanning={isAutoScanning}
          onToggleAutoScan={() => setIsAutoScanning(!isAutoScanning)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onEmergencyAlarm={handleEmergencyAlarm}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-5xl mx-auto p-3 sm:p-5 flex flex-col gap-5">
          {/* Obstacle Warning Banner (if hazards exist) */}
          <ObstacleAlertBanner
            safetyLevel={analysisResult?.safetyLevel || 'SAFE'}
            obstacles={analysisResult?.obstacles || []}
            onAcknowledge={handleAcknowledgeHazard}
            speechRate={settings.speechRate}
          />

          {/* Core App Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Live Camera / Scenario Feed & Voice Controller */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <CameraView
                onAnalyzeImage={handleAnalyzeVision}
                isAnalyzing={isAnalyzing}
                activeScenario={activeScenario}
                setActiveScenario={setActiveScenario}
                detectedObstacles={analysisResult?.obstacles || []}
                isAutoScanning={isAutoScanning}
              />

              <VoiceAssistantController
                onSendVoiceQuery={handleVoiceQuery}
                isAnalyzing={isAnalyzing}
                speechRate={settings.speechRate}
              />
            </div>

            {/* Right Column: Gemma-Eyes Chain-of-Thought & Assistive Tools */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <CoTPanel
                analysis={analysisResult}
                isAnalyzing={isAnalyzing}
                onExecuteTool={handleExecuteTool}
                isSpeaking={isSpeaking}
                setIsSpeaking={setIsSpeaking}
                speechRate={settings.speechRate}
                activeScenarioImageBase64={activeScenario?.imageUrl}
              />

              <AssistiveToolsPanel
                onExecuteTool={handleExecuteTool}
                toolResult={toolResult}
                isExecutingTool={isExecutingTool}
                speechRate={settings.speechRate}
              />
            </div>
          </div>
        </main>

        {/* Modals */}
        <BeMyEyesModal
          isOpen={beMyEyesOpen}
          onClose={() => setBeMyEyesOpen(false)}
          speechRate={settings.speechRate}
        />

        <AccessibilitySettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          settings={settings}
          setSettings={setSettings}
        />
      </div>
    </SmartphoneFrame>
  );
}
