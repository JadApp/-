import React from 'react';
import { TranslatorSettings, SUPPORTED_LANGUAGES } from '../types';
import {
  Power,
  ShieldCheck,
  Layers,
  Cpu,
  Globe,
  Sliders,
  Sparkles,
  ArrowRight,
  ArrowLeftRight,
  HelpCircle,
} from 'lucide-react';

interface AppHomeScreenProps {
  isServiceRunning: boolean;
  onToggleService: () => void;
  settings: TranslatorSettings;
  onUpdateSettings: (newSettings: Partial<TranslatorSettings>) => void;
  onGoToScreen: () => void;
  onOpenSettings: () => void;
}

export const AppHomeScreen: React.FC<AppHomeScreenProps> = ({
  isServiceRunning,
  onToggleService,
  settings,
  onUpdateSettings,
  onGoToScreen,
  onOpenSettings,
}) => {
  return (
    <div className="h-full flex flex-col justify-between p-5 text-slate-100 overflow-y-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-md">
              <Globe size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">Screen Translator</h1>
              <p className="text-[11px] text-slate-400">مترجم الشاشة الفوري للألعاب والتطبيقات</p>
            </div>
          </div>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            title="الإعدادات المتقدمة"
            aria-label="الإعدادات المتقدمة"
          >
            <Sliders size={16} />
          </button>
        </div>

        {/* Big Start Service Power Switch */}
        <div className="mt-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-b ${
              isServiceRunning
                ? 'from-emerald-500/10 via-transparent to-transparent'
                : 'from-indigo-500/10 via-transparent to-transparent'
            } pointer-events-none`}
          />

          {/* Glowing pulse ring */}
          <div className="relative mb-4">
            {isServiceRunning && (
              <span className="absolute -inset-2 rounded-full border-2 border-emerald-400/40 animate-ping pointer-events-none" />
            )}
            <button
              onClick={onToggleService}
              className={`w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-300 shadow-2xl active:scale-95 ${
                isServiceRunning
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/30 ring-4 ring-emerald-500/20'
                  : 'bg-gradient-to-tr from-slate-800 to-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 ring-4 ring-slate-800/50'
              }`}
              aria-label={isServiceRunning ? 'إيقاف الخدمة' : 'بدء الخدمة'}
            >
              <Power size={32} className={isServiceRunning ? 'animate-pulse' : ''} />
              <span className="text-[11px] font-bold tracking-wider uppercase">
                {isServiceRunning ? 'Active' : 'Start'}
              </span>
            </button>
          </div>

          <h2 className="text-sm font-bold">
            {isServiceRunning ? 'الخدمة قيد التشغيل (Service Running)' : 'الخدمة متوقفة (Service Stopped)'}
          </h2>
          <p className="text-[11px] text-slate-400 mt-1 text-center max-w-[240px]">
            {isServiceRunning
              ? 'الزر العائم نشط الآن فوق الشاشة. اضغط عليه في أي وقت للترجمة.'
              : 'اضغط على الزر لتفعيل الزر العائم والبدء بالتقاط وترجمة الشاشة.'}
          </p>

          {isServiceRunning && (
            <button
              onClick={onGoToScreen}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg transition-transform active:scale-95"
            >
              <span>جرّب الزر فوق الألعاب الآن</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* Permissions & Engine Status */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="font-semibold text-slate-200">الظهور فوق التطبيقات</p>
              <p className="text-[10px] text-emerald-400">ممنوح (SYSTEM_ALERT)</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Cpu size={16} />
            </div>
            <div>
              <p className="font-semibold text-slate-200">محرك Google ML Kit</p>
              <p className="text-[10px] text-indigo-400">معالجة فورية (On-Device)</p>
            </div>
          </div>
        </div>

        {/* Language Selection Card with Interactive Dropdowns */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800" dir="rtl">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Globe size={13} className="text-indigo-400" />
              <span>لغات الترجمة الفورية</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">Google ML Kit / Free API</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
            {/* Source Language Dropdown */}
            <div className="flex-1 text-right">
              <label htmlFor="source-lang-select" className="text-[10px] text-slate-400 block mb-1">من (المصدر):</label>
              <select
                id="source-lang-select"
                aria-label="لغة المصدر"
                value={settings.sourceLang}
                onChange={(e) => onUpdateSettings({ sourceLang: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={`src-${lang.code}`} value={lang.code}>
                    {lang.flag} {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <button
              onClick={() => {
                const currentSrc = settings.sourceLang;
                const currentTgt = settings.targetLang;
                onUpdateSettings({ sourceLang: currentTgt, targetLang: currentSrc });
              }}
              className="p-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all self-end mb-0.5 active:scale-95"
              title="تبديل لغات الترجمة"
              aria-label="تبديل لغات الترجمة"
            >
              <ArrowLeftRight size={14} />
            </button>

            {/* Target Language Dropdown */}
            <div className="flex-1 text-right">
              <label htmlFor="target-lang-select" className="text-[10px] text-slate-400 block mb-1">إلى (الهدف):</label>
              <select
                id="target-lang-select"
                aria-label="لغة الهدف"
                value={settings.targetLang}
                onChange={(e) => onUpdateSettings({ targetLang: e.target.value })}
                className="w-full bg-slate-900 border border-emerald-500/50 rounded-lg p-1.5 text-xs font-bold text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={`tgt-${lang.code}`} value={lang.code}>
                    {lang.flag} {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Display Mode Switcher */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <label className="text-xs text-slate-400 font-medium block mb-2">طريقة عرض الترجمة:</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => onUpdateSettings({ displayMode: 'in-place' })}
              className={`p-2.5 rounded-lg border text-right transition-all ${
                settings.displayMode === 'in-place'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold">
                <Layers size={13} />
                <span>فوق النص (In-Place)</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">يستبدل النص الإنجليزي بمكانه مباشرة</p>
            </button>

            <button
              onClick={() => onUpdateSettings({ displayMode: 'popup' })}
              className={`p-2.5 rounded-lg border text-right transition-all ${
                settings.displayMode === 'popup'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold">
                <Sparkles size={13} />
                <span>نافذة منبثقة (Popup)</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">بطاقة عائمة أسفل الشاشة مع نطق صوتي</p>
            </button>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 text-center">
        <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
          <HelpCircle size={12} />
          <span>يدعم الألعاب والأفلام والمحادثات بدون إعلانات</span>
        </p>
      </div>
    </div>
  );
};
