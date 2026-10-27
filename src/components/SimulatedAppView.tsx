import React from 'react';
import { ScreenScenario } from '../types';
import { Sword, Shield, Heart, Zap, Sparkles, AlertTriangle, Upload, Eye } from 'lucide-react';

interface SimulatedAppViewProps {
  scenario: ScreenScenario;
  customImage: string | null;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showOriginalsOnly?: boolean;
}

export const SimulatedAppView: React.FC<SimulatedAppViewProps> = ({
  scenario,
  customImage,
  onUploadImage,
}) => {
  if (customImage) {
    return (
      <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
        <img
          src={customImage}
          alt="Custom screen capture"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // Render RPG Game Scenario
  if (scenario.id === 'game-rpg') {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-slate-100 flex flex-col justify-between p-4 font-sans select-none overflow-hidden">
        {/* Game Top HUD */}
        <div className="pt-8">
          <div className="flex items-center justify-between text-xs font-bold px-2 py-1.5 rounded-lg bg-black/50 border border-indigo-500/30 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Sword size={14} />
              <span>LVL. 48 WARRIOR</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-rose-400">
                <Heart size={13} fill="currentColor" />
                <span>3850 / 4200</span>
              </div>
              <div className="flex items-center gap-1 text-cyan-400">
                <Zap size={13} fill="currentColor" />
                <span>1200 / 1200</span>
              </div>
            </div>
          </div>

          {/* Quest Banner */}
          <div className="mt-3 p-2 rounded-lg bg-indigo-900/40 border border-indigo-500/40 text-center">
            <p className="text-xs font-bold text-amber-300 tracking-wide">
              Quest Complete: 3/3 Crystals Gathered
            </p>
          </div>
        </div>

        {/* Game Center Visual & Boss Dialogue */}
        <div className="my-auto text-center relative py-6">
          <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-tr from-purple-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-purple-600/50 border-2 border-amber-400/50">
            <Sparkles size={40} className="text-white animate-pulse" />
          </div>

          {/* Story Dialogue Box */}
          <div className="mx-2 p-3.5 rounded-xl bg-slate-950/80 border border-indigo-400/50 backdrop-blur-md shadow-2xl">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mb-1">
              Ancient Guardian
            </span>
            <p className="text-xs font-medium text-slate-200 leading-relaxed">
              Defeat the Shadow Dragon to unlock the Ancient Gates
            </p>
          </div>
        </div>

        {/* Game Bottom Actions & Inventory */}
        <div className="pb-4 space-y-2">
          <div className="p-2.5 rounded-lg bg-indigo-950/70 border border-indigo-800 text-center">
            <p className="text-[11px] font-semibold text-amber-200">
              Equip Legendary Blade [ATK +850]
            </p>
          </div>

          <div className="p-2 rounded-lg bg-emerald-950/70 border border-emerald-800/80 text-center">
            <p className="text-[11px] font-bold text-emerald-300">
              Health +500 | Mana +250
            </p>
          </div>

          <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-transform">
            Claim Daily Quest Reward
          </button>
        </div>
      </div>
    );
  }

  // Render Manga / Comic Reader Scenario
  if (scenario.id === 'manga-comic') {
    return (
      <div className="relative w-full h-full bg-stone-900 text-slate-900 flex flex-col justify-between p-4 select-none overflow-hidden font-sans">
        {/* Top comic panel */}
        <div className="pt-8">
          <div className="p-3.5 rounded-2xl bg-white shadow-xl border-2 border-black max-w-[85%] ml-auto relative">
            <span className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r-2 border-b-2 border-black transform rotate-45" />
            <p className="text-xs font-black text-black">
              What is this mysterious power?!
            </p>
          </div>
        </div>

        {/* Center narrative frame */}
        <div className="my-auto py-8">
          <div className="p-4 rounded-2xl bg-white shadow-2xl border-2 border-black max-w-[90%] mr-auto relative">
            <span className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-r-2 border-b-2 border-black transform rotate-45" />
            <p className="text-xs font-bold text-black leading-snug">
              We need to find the ancient sanctuary before sunset.
            </p>
          </div>
        </div>

        {/* Bottom shout action */}
        <div className="pb-8 text-center">
          <div className="inline-block p-3 rounded-2xl bg-amber-200 shadow-xl border-2 border-black">
            <p className="text-xs font-black text-rose-700 tracking-wide uppercase">
              Behind you! Watch out!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render Social News Scenario
  if (scenario.id === 'social-news') {
    return (
      <div className="relative w-full h-full bg-slate-950 text-slate-100 flex flex-col justify-between p-4 pt-10 select-none overflow-hidden font-sans">
        <div className="space-y-4">
          {/* Tweet / Post Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                TX
              </div>
              <div>
                <p className="text-xs font-bold">Tech World Daily</p>
                <p className="text-[10px] text-slate-400">@techworld • 12m ago</p>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-100 leading-relaxed">
              Breaking News: Major breakthrough in quantum computing announced today.
            </p>

            <p className="text-[11px] text-slate-400 leading-normal">
              Researchers achieve room-temperature quantum coherence.
            </p>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
              <button className="text-blue-400 font-semibold hover:underline">
                Read Full Article
              </button>
              <button className="hover:text-white">
                Share with friends
              </button>
            </div>
          </div>
        </div>

        <div className="pb-4 text-center">
          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 cursor-pointer border border-slate-700 transition-colors">
            <Upload size={13} />
            <span>أو ارفع صورة خاصة لتجربتها</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onUploadImage}
            />
          </label>
        </div>
      </div>
    );
  }

  // System Warning Scenario
  return (
    <div className="relative w-full h-full bg-black/95 text-slate-100 flex flex-col justify-center items-center p-5 select-none font-sans">
      <div className="w-full max-w-[280px] p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
          <AlertTriangle size={24} />
        </div>

        <h3 className="text-xs font-bold text-rose-400 mb-2 leading-relaxed">
          System Warning: Battery level is critically low. Connect charger immediately.
        </h3>

        <div className="mt-4 flex items-center gap-2 text-xs">
          <button className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors">
            Battery Saver
          </button>
          <button className="flex-1 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold transition-colors">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
