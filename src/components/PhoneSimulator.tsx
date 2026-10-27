import React, { useState, useRef, useMemo } from 'react';
import {
  ScreenScenario,
  TranslatorSettings,
  DetectedTextBlock,
} from '../types';
import { MOCK_SCENARIOS } from '../data/mockScreens';
import { fastLocalTranslate } from '../utils/translator-logic';
import { AppHomeScreen } from './AppHomeScreen';
import { SimulatedAppView } from './SimulatedAppView';
import { FloatingBubble } from './FloatingBubble';
import { InPlaceOverlay } from './InPlaceOverlay';
import { TranslationModal } from './TranslationModal';
import { processImageWithOcr } from '../services/translationService';
import {
  Wifi,
  Battery,
  Signal,
  ArrowLeft,
  Smartphone,
  Sparkles,
  Gamepad2,
  BookOpen,
  Newspaper,
  ShieldAlert,
  Upload,
  RefreshCw,
  Sliders,
} from 'lucide-react';

interface PhoneSimulatorProps {
  settings: TranslatorSettings;
  onUpdateSettings: (newSettings: Partial<TranslatorSettings>) => void;
  onOpenSettings: () => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  settings,
  onUpdateSettings,
  onOpenSettings,
}) => {
  const [currentView, setCurrentView] = useState<'app' | 'screen'>('app');
  const [isServiceRunning, setIsServiceRunning] = useState(true);
  const [activeScenario, setActiveScenario] = useState<ScreenScenario>(MOCK_SCENARIOS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<DetectedTextBlock | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customBlocks, setCustomBlocks] = useState<DetectedTextBlock[]>([]);
  const phoneScreenRef = useRef<HTMLDivElement>(null);

  // Dynamically compute translated text for active blocks based on selected target language
  const activeBlocks = useMemo(() => {
    const rawBlocks = customImage ? customBlocks : activeScenario.blocks;
    return rawBlocks.map((b) => {
      const translated = fastLocalTranslate(b.originalText, settings.targetLang);
      const isMatch = translated !== b.originalText;
      return {
        ...b,
        translatedText: isMatch
          ? translated
          : settings.targetLang === 'ar'
          ? b.translatedText
          : `${translated} (${settings.targetLang.toUpperCase()})`,
      };
    });
  }, [customImage, customBlocks, activeScenario, settings.targetLang]);

  const handleToggleService = () => {
    setIsServiceRunning((prev) => {
      const next = !prev;
      if (!next) {
        setIsOverlayVisible(false);
        setSelectedBlock(null);
      }
      return next;
    });
  };

  const handleTriggerTranslate = async () => {
    if (!isServiceRunning) return;

    setIsScanning(true);
    setSelectedBlock(null);

    // Simulate OCR scan delay (Google ML Kit runs in ~100-300ms on Android)
    setTimeout(() => {
      setIsScanning(false);
      setIsOverlayVisible(true);

      // If user chose popup mode, also open first block in popup card
      if (settings.displayMode === 'popup' && activeBlocks.length > 0) {
        setSelectedBlock(activeBlocks[0]);
      }
    }, 600);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setCustomImage(base64);
      setCurrentView('screen');
      setIsScanning(true);

      const detected = await processImageWithOcr(base64, settings.sourceLang, settings.targetLang);
      setCustomBlocks(detected);
      setIsScanning(false);
      setIsOverlayVisible(true);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col xl:flex-row items-center justify-center gap-8 py-6 w-full max-w-6xl mx-auto px-4">
      {/* Left / Control Panel */}
      <div className="w-full xl:w-84 flex flex-col gap-4 text-slate-200" dir="rtl">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Smartphone size={16} className="text-indigo-400" />
              <span>محاكي أندرويد التفاعلي</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Android 14
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4 text-right">
            تطبيق تفاعلي يحاكي سلوك أندرويد الحقيقي: شغّل الخدمة، ثم انقر على الزر العائم فوق شاشات الألعاب والصور للترجمة الفورية.
          </p>

          {/* View Mode Switcher */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800 mb-4 text-xs font-semibold">
            <button
              onClick={() => setCurrentView('app')}
              className={`py-2 px-3 rounded-lg transition-all ${
                currentView === 'app'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              داخل التطبيق
            </button>
            <button
              onClick={() => setCurrentView('screen')}
              className={`py-2 px-3 rounded-lg transition-all ${
                currentView === 'screen'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              فوق الألعاب (الزر العائم)
            </button>
          </div>

          {/* Quick Scenario Picker */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2 text-right">
              اختر شاشة لاختبار الترجمة عليها:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setCustomImage(null);
                    setActiveScenario(sc);
                    setCurrentView('screen');
                    setIsOverlayVisible(false);
                    setSelectedBlock(null);
                  }}
                  className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                    !customImage && activeScenario.id === sc.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/30'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {sc.id === 'game-rpg' && <Gamepad2 size={14} className="text-amber-400 shrink-0" />}
                    {sc.id === 'manga-comic' && <BookOpen size={14} className="text-pink-400 shrink-0" />}
                    {sc.id === 'social-news' && <Newspaper size={14} className="text-blue-400 shrink-0" />}
                    {sc.id === 'system-error' && <ShieldAlert size={14} className="text-rose-400 shrink-0" />}
                    <span className="text-xs font-bold leading-tight">{sc.nameAr}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 leading-tight">{sc.name}</span>
                </button>
              ))}
            </div>

            {/* Upload Custom Image Button */}
            <div className="mt-3">
              <label className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer border border-slate-700 transition-colors shadow-sm">
                <Upload size={14} className="text-indigo-400" />
                <span>رفع لقطة شاشة خاصة بك (OCR)</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadImage}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Quick Simulator Instructions */}
        <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-900/50 text-xs space-y-2 text-indigo-200/90 text-right">
          <p className="font-bold flex items-center gap-1.5 text-indigo-300">
            <Sparkles size={14} />
            <span>طريقة التجربة السريعة:</span>
          </p>
          <p className="text-[11px] leading-relaxed text-slate-300">
            1. انقر على «فوق الألعاب» لرؤية الزر العائم يطفو على الشاشة.
          </p>
          <p className="text-[11px] leading-relaxed text-slate-300">
            2. يمكنك سحب الزر العائم بحرية أو النقر عليه لتشغيل المسح الفوري.
          </p>
          <p className="text-[11px] leading-relaxed text-slate-300">
            3. ستظهر الترجمة العربية مباشرة فوق النصوص الإنجليزية، أو بنافذة عائمة.
          </p>
        </div>
      </div>

      {/* Center / Android Phone Frame */}
      <div className="relative flex flex-col items-center">
        {/* Device Outer Chassis */}
        <div className="w-[340px] h-[680px] sm:w-[360px] sm:h-[720px] rounded-[48px] p-3.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-slate-600/50 relative">
          {/* Side Buttons (Volume & Power) */}
          <div className="absolute -left-1.5 top-28 w-1 h-12 bg-slate-600 rounded-l-md" />
          <div className="absolute -left-1.5 top-44 w-1 h-12 bg-slate-600 rounded-l-md" />
          <div className="absolute -right-1.5 top-36 w-1 h-16 bg-slate-600 rounded-r-md" />

          {/* Device Inner Screen Container */}
          <div
            ref={phoneScreenRef}
            className="w-full h-full rounded-[38px] overflow-hidden bg-slate-950 relative flex flex-col justify-between select-none shadow-inner"
          >
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-8 z-50 px-6 flex items-center justify-between text-[11px] text-white font-medium bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
              <span>10:45</span>

              {/* Dynamic Island / Front Camera Punch Hole */}
              <div className="w-20 h-4 bg-black rounded-full flex items-center justify-center gap-1 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-900/50" />
              </div>

              <div className="flex items-center gap-1.5">
                <Signal size={12} />
                <Wifi size={12} />
                <Battery size={13} />
              </div>
            </div>

            {/* Screen Content View */}
            <div className="w-full h-full pt-8 pb-7 relative overflow-hidden">
              {currentView === 'app' ? (
                <AppHomeScreen
                  isServiceRunning={isServiceRunning}
                  onToggleService={handleToggleService}
                  settings={settings}
                  onUpdateSettings={onUpdateSettings}
                  onGoToScreen={() => setCurrentView('screen')}
                  onOpenSettings={onOpenSettings}
                />
              ) : (
                <SimulatedAppView
                  scenario={activeScenario}
                  customImage={customImage}
                  onUploadImage={handleUploadImage}
                />
              )}

              {/* Scanline laser animation during capture */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                  <div className="w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-pulse absolute top-0 left-0 right-0 animate-bounce transition-all" />
                  <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[0.5px]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="px-4 py-2 rounded-xl bg-slate-900/90 text-cyan-300 text-xs font-bold border border-cyan-500/40 shadow-2xl flex items-center gap-2">
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Google ML Kit OCR جاري التعرف والترجمة...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* In-Place Text Overlay */}
              {currentView === 'screen' && isOverlayVisible && settings.displayMode !== 'popup' && (
                <InPlaceOverlay
                  blocks={activeBlocks}
                  onClose={() => setIsOverlayVisible(false)}
                  onSelectBlock={(b) => setSelectedBlock(b)}
                />
              )}

              {/* Popup / Floating Card Overlay */}
              {currentView === 'screen' && (isOverlayVisible || selectedBlock) && (
                <TranslationModal
                  block={selectedBlock || (activeBlocks.length > 0 ? activeBlocks[0] : null)}
                  onClose={() => setSelectedBlock(null)}
                  targetLang={settings.targetLang}
                />
              )}

              {/* Floating Bubble Widget (Over other apps) */}
              {currentView === 'screen' && isServiceRunning && (
                <FloatingBubble
                  parentRef={phoneScreenRef}
                  onTriggerTranslate={handleTriggerTranslate}
                  isScanning={isScanning}
                  opacity={settings.bubbleOpacity}
                  size={settings.bubbleSize}
                />
              )}
            </div>

            {/* Android Navigation Bar */}
            <div className="absolute bottom-1 left-0 right-0 h-6 flex items-center justify-center gap-8 z-50 pointer-events-auto">
              <button
                onClick={() => setCurrentView('app')}
                className="w-12 h-1 bg-white/40 rounded-full hover:bg-white/80 transition-colors"
                title="الرجوع للتطبيق"
                aria-label="الرجوع للتطبيق"
              />
            </div>
          </div>
        </div>

        {/* Quick Phone Bottom Controls */}
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
          <button
            onClick={() => setCurrentView(currentView === 'app' ? 'screen' : 'app')}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <RefreshCw size={13} />
            <span>تبديل الشاشة ({currentView === 'app' ? 'إلى اللعبة' : 'إلى التطبيق'})</span>
          </button>
          <span>•</span>
          <button
            onClick={handleTriggerTranslate}
            disabled={!isServiceRunning}
            className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-40"
          >
            <Sparkles size={13} />
            <span>تجربة الترجمة الفورية الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
};
