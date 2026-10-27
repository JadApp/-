import React, { useState } from 'react';
import { ActiveTab, TranslatorSettings } from './types';
import { Navbar } from './components/Navbar';
import { PhoneSimulator } from './components/PhoneSimulator';
import { CodeExplorer } from './components/CodeExplorer';
import { ArchitectureFlow } from './components/ArchitectureFlow';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [settings, setSettings] = useState<TranslatorSettings>({
    sourceLang: 'en',
    targetLang: 'ar',
    displayMode: 'in-place',
    ocrEngine: 'mlkit-offline',
    bubbleOpacity: 0.9,
    bubbleSize: 'medium',
    autoTranslateOnTap: true,
    hapticFeedback: true,
    showOriginalOnLongPress: true,
  });

  const handleUpdateSettings = (newSettings: Partial<TranslatorSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-cairo selection:bg-indigo-500/30 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col justify-center items-center py-4">
        {activeTab === 'simulator' && (
          <PhoneSimulator
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {activeTab === 'kotlin-code' && (
          <CodeExplorer initialLanguage="kotlin" />
        )}

        {activeTab === 'flutter-code' && (
          <CodeExplorer initialLanguage="flutter" />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureFlow />
        )}
      </main>

      {/* Global Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
}
