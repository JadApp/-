export interface BoundingBox {
  top: number; // percentage (0-100)
  left: number; // percentage (0-100)
  width: number; // percentage (0-100)
  height: number; // percentage (0-100)
}

export interface DetectedTextBlock {
  id: string;
  originalText: string;
  translatedText: string;
  box: BoundingBox;
  confidence?: number;
  bgColor?: string;
  textColor?: string;
}

export interface ScreenScenario {
  id: string;
  name: string;
  nameAr: string;
  category: 'game' | 'manga' | 'social' | 'system';
  description: string;
  descriptionAr: string;
  bgGradient: string;
  image?: string;
  blocks: DetectedTextBlock[];
}

export interface TranslatorSettings {
  sourceLang: string;
  targetLang: string;
  displayMode: 'in-place' | 'popup' | 'both';
  ocrEngine: 'mlkit-offline' | 'cloud-vision';
  bubbleOpacity: number;
  bubbleSize: 'small' | 'medium' | 'large';
  autoTranslateOnTap: boolean;
  hapticFeedback: boolean;
  showOriginalOnLongPress: boolean;
}

export interface CodeFile {
  name: string;
  path: string;
  language: 'kotlin' | 'xml' | 'groovy' | 'dart' | 'yaml' | 'markdown';
  content: string;
  description: string;
  descriptionAr: string;
}

export type ActiveTab = 'simulator' | 'kotlin-code' | 'flutter-code' | 'architecture';

export { SUPPORTED_LANGUAGES } from '../utils/translator-logic';
