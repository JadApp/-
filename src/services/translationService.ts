import { fastLocalTranslate, normalizeGeminiBox } from '../utils/translator-logic';
import { DetectedTextBlock } from '../types';

/**
 * Translates text into target language using local dictionary and Google Translate API
 */
export async function translateSingleText(
  text: string,
  sourceLang = 'en',
  targetLang = 'ar'
): Promise<string> {
  if (!text || text.trim() === '') return '';

  // 1. Fast local dictionary match
  const offlineMatch = fastLocalTranslate(text, targetLang);
  if (offlineMatch !== text) {
    return offlineMatch;
  }

  // 2. Client-side Google Translate public endpoint (no API key needed, zero latency)
  try {
    const encoded = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encoded}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0].map((item: any) => item[0]).filter(Boolean).join('');
        if (translated) {
          return translated;
        }
      }
    }
  } catch (err) {
    // network or offline fallback
  }

  return offlineMatch || text;
}

/**
 * Processes custom uploaded screenshot and extracts mock text blocks with translations
 */
export async function processImageWithOcr(
  imageBase64: string,
  sourceLang = 'en',
  targetLang = 'ar'
): Promise<DetectedTextBlock[]> {
  // Simulate Google ML Kit OCR scanning delay (approx 350ms)
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Generate realistic text blocks detected from image
  return [
    {
      id: `custom-block-1-${Date.now()}`,
      originalText: 'Screen Translator Active - Ready to process text',
      translatedText: 'مترجم الشاشة نشط - جاهز لقراءة النصوص فوراً',
      box: { top: 20, left: 10, width: 80, height: 8 },
      bgColor: '#0f172a',
      textColor: '#38bdf8',
    },
    {
      id: `custom-block-2-${Date.now()}`,
      originalText: 'Tap any recognized block to hear pronunciation',
      translatedText: 'انقر على أي نص مستخرج للاستماع إلى النطق الصوتي',
      box: { top: 38, left: 8, width: 84, height: 10 },
      bgColor: '#1e1b4b',
      textColor: '#f8fafc',
    },
    {
      id: `custom-block-3-${Date.now()}`,
      originalText: 'Google ML Kit On-Device OCR Engine',
      translatedText: 'محرك Google ML Kit المحلي للتعرف البصري',
      box: { top: 65, left: 15, width: 70, height: 7 },
      bgColor: '#064e3b',
      textColor: '#6ee7b7',
    },
  ];
}
