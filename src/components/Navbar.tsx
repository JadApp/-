import React from 'react';
import { ActiveTab } from '../types';
import {
  Smartphone,
  Code2,
  FileCode,
  Workflow,
  Sliders,
  Languages,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSettings,
}) => {
  const tabs = [
    {
      id: 'simulator' as ActiveTab,
      label: 'محاكي أندرويد التفاعلي',
      sub: 'Live Simulator',
      icon: <Smartphone size={16} />,
    },
    {
      id: 'kotlin-code' as ActiveTab,
      label: 'كود أندرويد (Kotlin)',
      sub: 'Jetpack Compose',
      icon: <Code2 size={16} />,
    },
    {
      id: 'flutter-code' as ActiveTab,
      label: 'كود فلاتر (Flutter)',
      sub: 'Dart Native',
      icon: <FileCode size={16} />,
    },
    {
      id: 'architecture' as ActiveTab,
      label: 'المعمارية الهندسية',
      sub: 'System Pipeline',
      icon: <Workflow size={16} />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-500/20">
            <Languages size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white tracking-tight">
                Screen Translator Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                مترجم الشاشة الفوري
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              تطبيق أندرويد متكامل: زر عائم، Google ML Kit OCR، ترجمة فورية وكود نظيف
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold overflow-x-auto max-w-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Action */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
          >
            <Sliders size={14} className="text-indigo-400" />
            <span>الإعدادات</span>
          </button>
        </div>
      </div>
    </header>
  );
};
