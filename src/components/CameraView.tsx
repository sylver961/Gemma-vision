import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, RefreshCw, Upload, Sun, ShieldAlert, Sparkles, CheckCircle2, AlertTriangle, Layers, Eye } from 'lucide-react';
import { Obstacle, SampleScenario } from '../types';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios';
import { soundFx } from '../utils/audio';

interface CameraViewProps {
  onAnalyzeImage: (base64Image: string, customPrompt?: string) => void;
  isAnalyzing: boolean;
  activeScenario: SampleScenario | null;
  setActiveScenario: (scenario: SampleScenario | null) => void;
  detectedObstacles: Obstacle[];
  isAutoScanning: boolean;
}

export const CameraView: React.FC<CameraViewProps> = ({
  onAnalyzeImage,
  isAnalyzing,
  activeScenario,
  setActiveScenario,
  detectedObstacles,
  isAutoScanning,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [useLiveCamera, setUseLiveCamera] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Initialize or restart camera stream
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("L'accès à la caméra n'est pas supporté par ce navigateur.");
      }

      // Stop previous stream tracks
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setUseLiveCamera(true);
      }
    } catch (err: any) {
      console.warn("Camera start failed, falling back to scenario mode:", err);
      setCameraError("Caméra non disponible. Utilisation des scénarios virtuels d'environnement.");
      setUseLiveCamera(false);
      if (!activeScenario) {
        setActiveScenario(SAMPLE_SCENARIOS[0]);
      }
    }
  }, [facingMode, activeScenario, setActiveScenario]);

  useEffect(() => {
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode, startCamera]);

  // Toggle Camera Facing Mode (Front / Rear)
  const toggleFacingMode = () => {
    soundFx.playTactileClick();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Toggle Torch/Flashlight if available
  const toggleTorch = async () => {
    soundFx.playTactileClick();
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const track = stream.getVideoTracks()[0];
      if (track) {
        try {
          const capabilities = track.getCapabilities() as any;
          if (capabilities.torch) {
            await track.applyConstraints({
              advanced: [{ torch: !torchOn } as any],
            });
            setTorchOn(!torchOn);
          } else {
            alert("Le flash/lampe n'est pas disponible sur cet appareil.");
          }
        } catch (e) {
          console.warn("Torch failed:", e);
        }
      }
    }
  };

  // Capture image frame from live camera or scenario
  const captureFrame = useCallback((): string | null => {
    if (useLiveCamera && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video.videoWidth === 0 || video.videoHeight === 0) return null;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);
        return dataUrl;
      }
    } else if (activeScenario) {
      setCapturedImage(activeScenario.imageUrl);
      return activeScenario.imageUrl;
    } else if (capturedImage) {
      return capturedImage;
    }
    return null;
  }, [useLiveCamera, activeScenario, capturedImage]);

  // Trigger manual analysis
  const handleTriggerAnalysis = () => {
    soundFx.playTactileClick();
    const frame = captureFrame();
    if (frame) {
      onAnalyzeImage(frame);
    } else {
      alert("Veuillez sélectionner un scénario ou autoriser la caméra.");
    }
  };

  // Upload custom photo from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const base64 = evt.target?.result as string;
        setCapturedImage(base64);
        setUseLiveCamera(false);
        setActiveScenario(null);
        onAnalyzeImage(base64, "Analyse cette photo importée et décris les obstacles et textes.");
      };
      reader.readAsDataURL(file);
    }
  };

  // Draw overlay bounding boxes for detected obstacles
  useEffect(() => {
    if (!overlayCanvasRef.current) return;
    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!detectedObstacles || detectedObstacles.length === 0) return;

    detectedObstacles.forEach((obs) => {
      if (!obs.box2d || obs.box2d.length < 4) return;
      const [ymin, xmin, ymax, xmax] = obs.box2d;

      // Convert 0..1000 scale to canvas width/height
      const x = (xmin / 1000) * canvas.width;
      const y = (ymin / 1000) * canvas.height;
      const width = ((xmax - xmin) / 1000) * canvas.width;
      const height = ((ymax - ymin) / 1000) * canvas.height;

      let strokeColor = '#22c55e'; // Green SAFE
      let bgColor = 'rgba(34, 197, 94, 0.2)';
      if (obs.hazardLevel === 'WARNING') {
        strokeColor = '#eab308'; // Yellow WARNING
        bgColor = 'rgba(234, 179, 8, 0.25)';
      } else if (obs.hazardLevel === 'CRITICAL') {
        strokeColor = '#ef4444'; // Red CRITICAL
        bgColor = 'rgba(239, 68, 68, 0.35)';
      }

      ctx.save();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 4;
      ctx.fillStyle = bgColor;
      ctx.fillRect(x, y, width, height);
      ctx.strokeRect(x, y, width, height);

      // Label background
      const labelText = `${obs.name} (${obs.distanceMeters}m)`;
      ctx.font = 'bold 14px sans-serif';
      const textWidth = ctx.measureText(labelText).width;

      ctx.fillStyle = strokeColor;
      ctx.fillRect(x, Math.max(0, y - 26), textWidth + 12, 26);

      ctx.fillStyle = '#000000';
      ctx.fillText(labelText, x + 6, Math.max(18, y - 8));
      ctx.restore();
    });
  }, [detectedObstacles]);

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Main Camera Viewport Card */}
      <div className="relative w-full aspect-video sm:aspect-[16/10] max-h-[480px] bg-black rounded-3xl border-4 border-[#1C1C1E] overflow-hidden shadow-2xl flex items-center justify-center">
        {/* Hidden internal canvas for snapshot taking */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Live Camera Video Stream */}
        {useLiveCamera ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          /* Scenario / Captured Image Preview */
          <img
            src={activeScenario ? activeScenario.imageUrl : capturedImage || SAMPLE_SCENARIOS[0].imageUrl}
            alt="Vue synthétique caméra"
            className="w-full h-full object-cover"
          />
        )}

        {/* Canvas Bounding Boxes Overlay */}
        <canvas
          ref={overlayCanvasRef}
          width={800}
          height={500}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Auto Radar Sweep Line Animation */}
        {isAutoScanning && (
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-[#E6FF00] to-transparent shadow-[0_0_15px_#E6FF00] animate-[bounce_2s_infinite]" />
            <div className="absolute top-3 left-3 bg-[#E6FF00] text-black font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg border border-black/20">
              <span className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
              RADAR DE SÉCURITÉ ACTIF
            </div>
          </div>
        )}

        {/* FPS Indicator Badge on Vision Viewport */}
        <div className="absolute bottom-14 left-4 z-20 bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#333336] flex flex-col pointer-events-none">
          <p className="text-[10px] text-[#A1A1A6] font-bold uppercase tracking-wider">VITESSE D'ANALYSE</p>
          <p className="text-lg font-black text-[#E6FF00]">12 FPS</p>
        </div>

        {/* Analyzing Overlay Spinner */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-30 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-16 h-16 border-4 border-[#E6FF00] border-t-transparent rounded-full animate-spin mb-3 shadow-[0_0_20px_rgba(230,255,0,0.5)]" />
            <p className="text-[#E6FF00] font-black text-lg sm:text-xl tracking-wide flex items-center gap-2 uppercase">
              <Eye className="w-6 h-6 animate-pulse" />
              Analyse visuelle Gemma-Eyes...
            </p>
            <p className="text-[#A1A1A6] text-xs sm:text-sm mt-1 max-w-sm">
              Raisonnement spatial, détection d'obstacles et lecture OCR en cours...
            </p>
          </div>
        )}

        {/* Camera Top HUD Controls */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          {useLiveCamera && (
            <>
              <button
                onClick={toggleFacingMode}
                className="p-2.5 bg-[#1C1C1E]/90 hover:bg-[#2C2C2E] text-[#E6FF00] rounded-2xl border border-[#333336] shadow-lg backdrop-blur-md"
                title="Changer de caméra (Avant / Arrière)"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={toggleTorch}
                className={`p-2.5 rounded-2xl border shadow-lg backdrop-blur-md transition-all ${
                  torchOn
                    ? 'bg-[#E6FF00] text-black border-[#E6FF00]'
                    : 'bg-[#1C1C1E]/90 hover:bg-[#2C2C2E] text-[#E6FF00] border-[#333336]'
                }`}
                title="Lampe / Flash"
              >
                <Sun className="w-5 h-5" />
              </button>
            </>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 bg-[#1C1C1E]/90 hover:bg-[#2C2C2E] text-[#E6FF00] rounded-2xl border border-[#333336] shadow-lg backdrop-blur-md flex items-center gap-1.5 text-xs font-black"
            title="Importer une photo"
          >
            <Upload className="w-5 h-5" />
            <span className="hidden sm:inline">Photo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Bottom Safety Status Banner inside Viewport */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-2 bg-[#1C1C1E]/90 border border-[#333336] p-2.5 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider hidden xs:inline">
              Source:
            </span>
            <span className="text-xs font-extrabold text-[#E6FF00] bg-black px-2.5 py-1 rounded-xl border border-[#333336]">
              {useLiveCamera ? 'Caméra Réelle' : activeScenario ? activeScenario.title : 'Image Importée'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold">
            {detectedObstacles.some((o) => o.hazardLevel === 'CRITICAL') ? (
              <span className="text-white flex items-center gap-1.5 bg-[#FF3B30] px-3 py-1 rounded-xl font-black">
                <ShieldAlert className="w-4 h-4 text-white" />
                DANGER DÉTECTÉ
              </span>
            ) : detectedObstacles.some((o) => o.hazardLevel === 'WARNING') ? (
              <span className="text-black flex items-center gap-1.5 bg-[#E6FF00] px-3 py-1 rounded-xl font-black">
                <AlertTriangle className="w-4 h-4 text-black" />
                ATTENTION REQUIS
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1.5 bg-black px-3 py-1 rounded-xl border border-emerald-500/50 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                VOIE DÉGAGÉE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Primary Action Button: "Scanner la scène en direct" */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleTriggerAnalysis}
          disabled={isAnalyzing}
          aria-label="Scanner la scène actuelle avec Gemma-Eyes"
          className="flex-1 py-4 px-6 bg-[#E6FF00] hover:bg-[#d8f000] active:scale-[0.98] text-black font-black text-lg sm:text-xl rounded-2xl shadow-xl shadow-[#E6FF00]/10 border-none flex items-center justify-center gap-3 transition-all disabled:opacity-50"
        >
          <Camera className="w-7 h-7 stroke-[2.5]" />
          <span>SCANNER LA SCÈNE</span>
          <Sparkles className="w-6 h-6 fill-black" />
        </button>
      </div>

      {/* Interactive Scenario Selector Tabs (for testing different environments) */}
      <div className="bg-[#1C1C1E] border border-[#333336] rounded-3xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-[#A1A1A6] font-bold px-1">
          <span className="flex items-center gap-1.5 text-[#E6FF00]">
            <Layers className="w-4 h-4" />
            Environnements virtuels de démonstration :
          </span>
          {!useLiveCamera && (
            <button
              onClick={() => {
                soundFx.playTactileClick();
                setUseLiveCamera(true);
                startCamera();
              }}
              className="text-[#E6FF00] hover:underline font-bold text-xs"
            >
              Basculer vers la caméra réelle
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-4 gap-2">
          {SAMPLE_SCENARIOS.map((scenario) => {
            const isSelected = !useLiveCamera && activeScenario?.id === scenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() => {
                  soundFx.playTactileClick();
                  setUseLiveCamera(false);
                  setActiveScenario(scenario);
                  onAnalyzeImage(scenario.imageUrl, scenario.userPrompt);
                }}
                className={`p-2.5 rounded-2xl text-left border transition-all flex flex-col gap-1 ${
                  isSelected
                    ? 'bg-[#E6FF00] text-black border-[#E6FF00] font-extrabold shadow-md'
                    : 'bg-black text-white border-[#333336] hover:border-[#E6FF00]'
                }`}
              >
                <span className="text-xs truncate font-bold">{scenario.title}</span>
                <span className={`text-[10px] truncate ${isSelected ? 'text-black/80 font-bold' : 'text-[#A1A1A6]'}`}>
                  {scenario.category.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
