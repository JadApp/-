import React from 'react';
import {
  Layers,
  Camera,
  Cpu,
  Languages,
  Sparkles,
  ShieldAlert,
  ArrowDown,
  CheckCircle2,
  Lock,
  Workflow,
  Zap,
} from 'lucide-react';

export const ArchitectureFlow: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Floating Widget (الزر العائم)',
      titleAr: 'ويدجت الرسم العائم فوق التطبيقات والألعاب',
      tech: 'WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY',
      icon: <Layers className="text-indigo-400" size={24} />,
      desc: 'يتم إنشاء نافذة عائمة شفافة لا تحجب لمسات الشاشة (FLAG_NOT_FOCUSABLE)، تتيح للمستخدم سحب الزر لأي مكان مع ميزة الانجذاب المغناطيسي لحافة الشاشة (Magnetic Snap).',
      badge: 'System Alert Window',
    },
    {
      num: '02',
      title: 'Screen Capture (التقاط الشاشة الفوري)',
      titleAr: 'خدمة التقاط البكسلات في الخلفية',
      tech: 'MediaProjection + VirtualDisplay + ImageReader',
      icon: <Camera className="text-cyan-400" size={24} />,
      desc: 'عند لمس الزر العائم، تستقبل خدمة Foreground Service أمر الالتقاط، وتسحب أحدث إطار من ImageReader بدقة الشاشة الكاملة كـ Bitmap فورية في الذاكرة بدون حفظ ملفات على القرص لتسريع الأداء.',
      badge: 'MediaProjection API',
    },
    {
      num: '03',
      title: 'OCR Processing (التعرف البصري على النصوص)',
      titleAr: 'محرك قراءة النصوص واستخراج الإحداثيات',
      tech: 'Google ML Kit Text Recognition (On-Device)',
      icon: <Cpu className="text-emerald-400" size={24} />,
      desc: 'معالجة محلية سريعة جداً (<150ms) بدون الحاجة لإنترنت. يستخرج المحرك الكتل النصية (TextBlocks) ومصفوفة الإحداثيات المستطيلة (BoundingBox Rects) لكل سطر وفقاعة حوار.',
      badge: 'Google ML Kit Vision',
    },
    {
      num: '04',
      title: 'Translation Engine (محرك الترجمة)',
      titleAr: 'الترجمة إلى اللغة العربية',
      tech: 'Google ML Kit Translate / Cloud Translation API',
      icon: <Languages className="text-amber-400" size={24} />,
      desc: 'إرسال النصوص المستخرجة إلى نموذج الترجمة المحلي (Offline ML Kit Translate) المحمّل مسبقاً على جهاز المستخدم، أو الاتصال بـ Google Translate API عند توفر الشبكة لترجمة دقيقة وسياقية.',
      badge: 'ML Kit Translate',
    },
    {
      num: '05',
      title: 'Result Overlay (طبقة العرض الفورية)',
      titleAr: 'رسم الترجمة مباشرة فوق النص الأصلي',
      tech: 'Custom Canvas / In-Place Text Replacement',
      icon: <Sparkles className="text-pink-400" size={24} />,
      desc: 'عرض الترجمة بإحدى طريقتين: إما In-place Overlay حيث يتم تغطية النص الإنجليزي بمستطيل متناسق الألوان ورسم النص العربي بداخله بحجم خط متكيف، أو عبر نافذة منبثقة (Popup Sheet) مزودة بنطق صوتي TTS وزر نسخ.',
      badge: 'In-Place Rendering',
    },
  ];

  const permissions = [
    {
      name: 'android.permission.SYSTEM_ALERT_WINDOW',
      purpose: 'رسم الزر العائم وطبقة الترجمة فوق الألعاب والتطبيقات الأخرى.',
      status: 'يتطلب موافقة يدوية من صفحة إعدادات النظام.',
    },
    {
      name: 'android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION',
      purpose: 'إلزامية في أندرويد 14+ لتشغيل خدمة التقاط الشاشة في الخلفية.',
      status: 'مطلوب في AndroidManifest مع إشعار دائم.',
    },
    {
      name: 'MediaProjection Token (createScreenCaptureIntent)',
      purpose: 'منح التطبيق صلاحية التقاط إطارات الشاشة المباشرة.',
      status: 'حوار أمني يظهر للمستخدم في أول تفعيل للخدمة.',
    },
    {
      name: 'android.permission.POST_NOTIFICATIONS',
      purpose: 'إظهار إشعار استمرار الخدمة في شريط الإشعارات (Android 13+).',
      status: 'مطلوب للمحافظة على استقرار الخدمة دون إغلاق النظام لها.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 text-slate-100">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          <Workflow size={14} />
          <span>المعمارية الهندسية ومخطط تدفق البيانات (Architecture Pipeline)</span>
        </div>
        <h2 className="text-2xl font-bold">كيف يعمل تطبيق مترجم الشاشة في أندرويد من الصفر؟</h2>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          شرح تفصيلي لدورة حياة التطبيق من لحظة نقر الزر العائم، مروراً بالتقاط الشاشة ومعالجة OCR، وحتى رسم النصوص المترجمة بدقة فائقة.
        </p>
      </div>

      {/* Pipeline Steps */}
      <div className="space-y-4 mb-12">
        {steps.map((step, idx) => (
          <div key={step.num} className="relative">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 shadow-xl transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                  {step.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-indigo-400">
                      STEP {step.num}
                    </span>
                    <span className="text-slate-500">•</span>
                    <h3 className="text-sm font-bold text-white">{step.titleAr}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mb-2">
                    {step.desc}
                  </p>
                  <code className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800 inline-block">
                    {step.tech}
                  </code>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shrink-0 self-start md:self-center">
                {step.badge}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div className="flex justify-center my-1.5 text-slate-600">
                <ArrowDown size={18} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Permissions Breakdown Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="text-amber-400" size={18} />
          <h3 className="text-base font-bold text-white">
            متطلبات الأذونات والحماية في أندرويد (Android Security & Permissions)
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          لتشغيل التطبيق بسلاسة على أجهزة أندرويد الحديثة (Android 10 حتى Android 14) دون أن يقوم النظام بقتل الخدمة في الخلفية:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {permissions.map((p) => (
            <div
              key={p.name}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <p className="font-mono text-xs font-bold text-indigo-300 break-all mb-1">
                  {p.name}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {p.purpose}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 size={13} />
                <span>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
