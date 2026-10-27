import React from 'react';
import { TranslatorSettings, SUPPORTED_LANGUAGES } from '../types';
import { X, Sliders, Check, Globe, Layers, Eye, Smartphone, Zap } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TranslatorSettings;
  onUpdateSettings: (newSettings: Partial<TranslatorSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-indigo-400" />
            <h3 className="text-base font-bold text-white">إعدادات المترجم (Settings)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="إغلاق الإعدادات"
          >
            <X size={18} />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Language Pair */}
          <div dir="rtl">
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-200 flex items-center gap-1.5">
                <Globe size={15} className="text-indigo-400" />
                <span>قائمة لغات الترجمة (Source & Target)</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  const s = settings.sourceLang;
                  const t = settings.targetLang;
                  onUpdateSettings({ sourceLang: t, targetLang: s });
                }}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <span>تبديل اللغات ⇄</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label htmlFor="settings-source-lang" className="text-[11px] text-slate-400 block mb-1">الترجمة من (Source):</label>
                <select
                  id="settings-source-lang"
                  aria-label="الترجمة من"
                  value={settings.sourceLang}
                  onChange={(e) => onUpdateSettings({ sourceLang: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={`modal-src-${lang.code}`} value={lang.code}>
                      {lang.flag} {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="settings-target-lang" className="text-[11px] text-slate-400 block mb-1">الترجمة إلى (Target):</label>
                <select
                  id="settings-target-lang"
                  aria-label="الترجمة إلى"
                  value={settings.targetLang}
                  onChange={(e) => onUpdateSettings({ targetLang: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-emerald-500/50 text-emerald-400 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={`modal-tgt-${lang.code}`} value={lang.code}>
                      {lang.flag} {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick popular target language pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-500">اختر بسرعة:</span>
              {[
                { code: 'ar', label: '🇸🇦 العربية' },
                { code: 'en', label: '🇺🇸 English' },
                { code: 'fr', label: '🇫🇷 Français' },
                { code: 'es', label: '🇪🇸 Español' },
                { code: 'ja', label: '🇯🇵 日本語' },
                { code: 'de', label: '🇩🇪 Deutsch' },
              ].map((pill) => (
                <button
                  key={pill.code}
                  type="button"
                  onClick={() => onUpdateSettings({ targetLang: pill.code })}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-all ${
                    settings.targetLang === pill.code
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Translation Mode */}
          <div>
            <label className="font-semibold text-slate-300 block mb-2 flex items-center gap-1.5">
              <Layers size={14} className="text-indigo-400" />
              <span>طريقة عرض النتيجة (Overlay Style)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'in-place', label: 'فوق النص', sub: 'In-Place' },
                { id: 'popup', label: 'نافذة منبثقة', sub: 'Popup Card' },
                { id: 'both', label: 'كلاهما', sub: 'Hybrid' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => onUpdateSettings({ displayMode: mode.id as any })}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    settings.displayMode === mode.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div>{mode.label}</div>
                  <div className="text-[10px] text-slate-400">{mode.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* OCR Engine */}
          <div>
            <label className="font-semibold text-slate-300 block mb-2 flex items-center gap-1.5">
              <Zap size={14} className="text-emerald-400" />
              <span>محرك التعرف الضوئي (OCR Engine)</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                <input
                  type="radio"
                  name="ocrEngine"
                  checked={settings.ocrEngine === 'mlkit-offline'}
                  onChange={() => onUpdateSettings({ ocrEngine: 'mlkit-offline' })}
                  className="text-indigo-600 focus:ring-0"
                />
                <div>
                  <p className="font-semibold text-slate-200">Google ML Kit (أوفلاين - فائق السرعة)</p>
                  <p className="text-[10px] text-slate-400">يعمل بدون إنترنت على الهاتف في أقل من 150ms</p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                <input
                  type="radio"
                  name="ocrEngine"
                  checked={settings.ocrEngine === 'cloud-vision'}
                  onChange={() => onUpdateSettings({ ocrEngine: 'cloud-vision' })}
                  className="text-indigo-600 focus:ring-0"
                />
                <div>
                  <p className="font-semibold text-slate-200">Google Cloud Translation API (سحابي)</p>
                  <p className="text-[10px] text-slate-400">دقة ترجمة لغوية أعلى للنصوص المعقدة والمقالات</p>
                </div>
              </label>
            </div>
          </div>

          {/* Floating Bubble Preferences */}
          <div>
            <label className="font-semibold text-slate-300 block mb-2 flex items-center gap-1.5">
              <Smartphone size={14} className="text-indigo-400" />
              <span>تخصيص الزر العائم (Floating Bubble)</span>
            </label>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>شفافية الزر العائم:</span>
                  <span>{Math.round(settings.bubbleOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.05"
                  value={settings.bubbleOpacity}
                  onChange={(e) => onUpdateSettings({ bubbleOpacity: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">حجم الزر العائم:</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['small', 'medium', 'large'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => onUpdateSettings({ bubbleSize: s })}
                      className={`p-2 rounded-lg border text-center transition-all capitalize ${
                        settings.bubbleSize === s
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {s === 'small' ? 'صغير' : s === 'medium' ? 'متوسط' : 'كبير'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-colors"
          >
            حفظ وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
