import React, { useState } from 'react';
import { CodeFile } from '../types';
import { ANDROID_KOTLIN_FILES } from '../data/nativeAndroidCode';
import { FLUTTER_FILES } from '../data/flutterCode';
import JSZip from 'jszip';
import {
  FileCode,
  FolderTree,
  Copy,
  Check,
  Download,
  Terminal,
  ExternalLink,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface CodeExplorerProps {
  initialLanguage?: 'kotlin' | 'flutter';
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({ initialLanguage = 'kotlin' }) => {
  const [activePlatform, setActivePlatform] = useState<'kotlin' | 'flutter'>(initialLanguage);
  const files: CodeFile[] = activePlatform === 'kotlin' ? ANDROID_KOTLIN_FILES : FLUTTER_FILES;
  const [selectedFile, setSelectedFile] = useState<CodeFile>(files[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleSelectPlatform = (platform: 'kotlin' | 'flutter') => {
    setActivePlatform(platform);
    const targetFiles = platform === 'kotlin' ? ANDROID_KOTLIN_FILES : FLUTTER_FILES;
    setSelectedFile(targetFiles[0]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const currentFiles = activePlatform === 'kotlin' ? ANDROID_KOTLIN_FILES : FLUTTER_FILES;
      const folderName = activePlatform === 'kotlin' ? 'ScreenTranslator_Android_Kotlin' : 'screen_translator_flutter';
      const rootFolder = zip.folder(folderName);

      if (rootFolder) {
        currentFiles.forEach((file) => {
          rootFolder.file(file.path, file.content);
        });

        // Add helpful README.md
        const readmeContent = activePlatform === 'kotlin'
          ? `# Screen Translator (Android Kotlin & Jetpack Compose)
## Overview
Instant Screen Translator app with floating action bubble, Google ML Kit Text Recognition (OCR), on-device translation to Arabic, and window overlay rendering.

## Setup Instructions:
1. Open this folder in Android Studio (Iguana, Jellyfish, or newer).
2. Sync Gradle files (Dependencies will download automatically from Google Maven).
3. Connect an Android device running Android 8.0 (API 26) to Android 14 (API 34).
4. Run the app and grant "Display over other apps" and "Screen capture" permissions.
`
          : `# Screen Translator (Flutter & Dart)
## Overview
Instant Screen Translator built with Flutter, google_mlkit_text_recognition, flutter_overlay_window, and google_mlkit_translation.

## Run Instructions:
1. Run: flutter pub get
2. Connect your Android device.
3. Run: flutter run
`;
        rootFolder.file('README.md', readmeContent);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${folderName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Header with Platform Selector & Zip Download */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCode className="text-indigo-400" />
            <span>الأكواد البرمجية والهيكل الكامل للتطبيق (Native Source Code)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            كود كامل ونظيف جاهز للنسخ والتشغيل المباشر في Android Studio أو مشروع Flutter.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Platform Tabs */}
          <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => handleSelectPlatform('kotlin')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                activePlatform === 'kotlin'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Kotlin + Compose (Android Native)
            </button>
            <button
              onClick={() => handleSelectPlatform('flutter')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                activePlatform === 'flutter'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Flutter (Dart)
            </button>
          </div>

          {/* Download Zip Button */}
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            title="تحميل المشروع بالكامل كملف ZIP"
          >
            <Download size={14} className={isZipping ? 'animate-bounce' : ''} />
            <span>{isZipping ? 'جاري التحميل...' : 'تحميل المشروع كامل (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* Main Code Viewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden min-h-[600px]">
        {/* Sidebar: File Tree */}
        <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-slate-900/60 p-3">
          <div className="flex items-center gap-2 px-2 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <FolderTree size={14} />
            <span>ملفات المشروع ({files.length})</span>
          </div>

          <div className="space-y-1 mt-2">
            {files.map((file) => {
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex flex-col gap-0.5 ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 truncate pl-3.5" dir="rtl">
                    {file.descriptionAr}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Architecture Note */}
          <div className="mt-6 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <Info size={13} className="text-indigo-400" />
              <span>ملاحظة أمنية في Android 14+:</span>
            </div>
            <p className="leading-relaxed">
              تتطلب خدمات تسجيل الشاشة تحديد <code className="text-indigo-300">foregroundServiceType="mediaProjection"</code> مع تشغيل Notification نشط وإشعار دائم لتفادي حظر النظام.
            </p>
          </div>
        </div>

        {/* Code View Area */}
        <div className="lg:col-span-3 flex flex-col bg-slate-950">
          {/* File Action Bar */}
          <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-200">
                  {selectedFile.path}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-400">
                  {selectedFile.language}
                </span>
              </div>
              <p className="text-xs text-indigo-300/90 mt-0.5" dir="rtl">
                {selectedFile.descriptionAr}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                title="نسخ الكود البرمجي"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-400" />
                    <span className="text-emerald-400">تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>نسخ الملف</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Code Content */}
          <div className="flex-1 p-4 overflow-x-auto font-mono text-xs text-slate-300 leading-relaxed bg-[#0b0f19]">
            <pre className="selection:bg-indigo-500/30 selection:text-white">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
