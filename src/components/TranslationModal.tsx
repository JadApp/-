import React, { useState } from 'react';
import { DetectedTextBlock, SUPPORTED_LANGUAGES } from '../types';
import { Volume2, Copy, Check, X, Sparkles, ExternalLink } from 'lucide-react';

interface TranslationModalProps {
  block: DetectedTextBlock | null;
  onClose: () => void;
  targetLang: string;
}

export const TranslationModal: React.FC<TranslationModalProps> = ({
  block,
  onClose,
  targetLang,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!block) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(block.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = (text: string, lang: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="absolute bottom-6 left-3 right-3 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 p-4 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
            <Sparkles size={14} />
            <span>نافذة الترجمة الفورية المنبثقة (Overlay Card)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="إغلاق"
          >
            <X size={15} />
          </button>
        </div>

        {/* Original English Section */}
        <div className="mb-3 text-left">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">English (OCR)</span>
            <button
              onClick={() => handleSpeak(block.originalText, 'en-US')}
              className="flex items-center gap-1 text-slate-400 hover:text-indigo-400 transition-colors"
              title="نطق الإنجليزية"
            >
              <Volume2 size={13} className={isPlayingAudio ? 'animate-pulse text-indigo-400' : ''} />
              <span>استماع</span>
            </button>
          </div>
          <p className="text-sm font-medium text-slate-300 bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/80">
            {block.originalText}
          </p>
        </div>

        {/* Translated Section */}
        {(() => {
          const targetLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || {
            name: 'Arabic',
            nativeName: 'العربية',
            flag: '🇸🇦',
            rtl: true,
          };
          const speechCodeMap: Record<string, string> = {
            ar: 'ar-SA',
            en: 'en-US',
            fr: 'fr-FR',
            es: 'es-ES',
            ja: 'ja-JP',
            de: 'de-DE',
            zh: 'zh-CN',
            ko: 'ko-KR',
            it: 'it-IT',
            pt: 'pt-BR',
            ru: 'ru-RU',
            tr: 'tr-TR',
            hi: 'hi-IN',
            fa: 'fa-IR',
            id: 'id-ID',
          };
          const speechCode = speechCodeMap[targetLang] || `${targetLang}-${targetLang.toUpperCase()}`;

          return (
            <div className={targetLangObj.rtl ? 'text-right' : 'text-left'} dir={targetLangObj.rtl ? 'rtl' : 'ltr'}>
              <div className="flex items-center justify-between text-[11px] text-emerald-400 mb-1">
                <span className="font-semibold flex items-center gap-1">
                  <span>{targetLangObj.flag}</span>
                  <span>{targetLangObj.nativeName} ({targetLangObj.name})</span>
                  <span className="text-[10px] text-slate-400">• ML Kit</span>
                </span>
                <button
                  onClick={() => handleSpeak(block.translatedText, speechCode)}
                  className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors"
                  title="نطق الترجمة"
                >
                  <Volume2 size={13} />
                  <span>استماع</span>
                </button>
              </div>
              <p className="text-base font-bold text-white bg-indigo-950/40 rounded-lg p-2.5 border border-indigo-700/50 font-cairo">
                {block.translatedText}
              </p>
            </div>
          );
        })()}

        {/* Action bar */}
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400">تم النسخ بنجاح!</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>نسخ الترجمة</span>
              </>
            )}
          </button>

          <span className="text-[11px] text-slate-500">ML Kit On-Device • &lt;15ms</span>
        </div>
      </div>
    </div>
  );
};
