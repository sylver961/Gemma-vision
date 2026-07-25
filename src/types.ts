export type SafetyLevel = 'SAFE' | 'WARNING' | 'CRITICAL';

export interface Obstacle {
  id: string;
  name: string;
  category: 'obstacle' | 'step' | 'crossing' | 'overhead' | 'vehicle' | 'person' | 'sign' | 'text';
  distanceMeters: number;
  position: 'left' | 'center' | 'right' | 'overhead';
  hazardLevel: SafetyLevel;
  description: string;
  box2d?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] relative 0..1000
}

export interface DocumentAnalysis {
  documentType: 'letter' | 'menu' | 'invoice' | 'notice' | 'book' | 'other';
  title: string;
  keyInfo: string[];
  fullText: string;
  wordCount: number;
  confirmationRequired: boolean;
  sections?: { header: string; text: string }[];
}

export interface ProductAnalysis {
  productName: string;
  brand: string;
  category: string;
  barcode?: string;
  price?: string;
  packagingDescription: string;
  ingredients?: string[];
  allergens?: string[];
  expirationDate?: string;
  shelfLocation?: string;
}

export interface VisionAnalysisResult {
  thoughtProcess: string; // Chain-of-Thought (Pensée interne)
  publicResponse: string; // First person calm speech response
  safetyLevel: SafetyLevel;
  summary: string;
  obstacles: Obstacle[];
  ocrTextDetected?: string[];
  documentAnalysis?: DocumentAnalysis;
  productAnalysis?: ProductAnalysis;
  suggestedAction?: {
    actionType: 'check_schedule' | 'check_weather' | 'read_text' | 'call_volunteer' | 'search_web' | 'read_full_document' | 'scan_barcode';
    prompt: string;
    details?: string;
  };
  functionCallTriggered?: {
    name: string;
    args: Record<string, any>;
    result?: any;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'gemma';
  text: string;
  timestamp: string;
}

export interface SampleScenario {
  id: string;
  title: string;
  category: 'street' | 'indoor' | 'transit' | 'store' | 'document';
  imageUrl: string;
  userPrompt: string;
  description: string;
  simulatedData: VisionAnalysisResult;
}

export interface BeMyEyesVolunteer {
  id: string;
  name: string;
  language: string;
  rating: number;
  location: string;
  avatarUrl: string;
}

export interface AccessibilitySettings {
  highContrastMode: 'dark-neon' | 'light-contrast' | 'amber-charcoal';
  speechRate: number; // 0.8 to 1.5
  speechPitch: number; // 0.8 to 1.2
  voiceLanguage: 'fr-FR' | 'en-US';
  autoScanIntervalSeconds: number; // 3, 5, 10, or 0 (disabled)
  soundEffectsVolume: number; // 0 to 1
  hapticFeedbackEnabled: boolean;
  smartphoneShellEnabled: boolean;
  fontSizeMultiplier: number; // 1.0 to 1.5
}

export interface ToolExecutionResult {
  toolName: string;
  timestamp: string;
  data: any;
}
