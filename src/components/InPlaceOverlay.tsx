import React, { useState } from 'react';
import { DetectedTextBlock } from '../types';
import { Copy, Check, Eye, EyeOff, X } from 'lucide-react';

interface InPlaceOverlayProps {
  blocks: DetectedTextBlock[];
  onClose: () => void;
  onSelectBlock: (block: DetectedTextBlock) => void;
}

export const InPlaceOverlay: React.FC<InPlaceOverlayProps> = ({
  blocks,
  onClose,
  onSelectBlock,
}) => {
  const [showOriginals, setShowOriginals] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, block: DetectedTextBlock) => {
    e.stopPropagation();
    navigator.clipboard.writeText(block.translatedText);
    setCopiedId(block.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="absolute inset-0 z-40 pointer-events-auto">
      {/* Top action badge for overlay controls */}
      <div className="absolute top-12 left-4 right-4 z-50 flex items-center justify-between px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-lg text-xs text-white">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ترجمة فورية (In-Place)</span>
          <span className="text-slate-400">({blocks.length} كتل)</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowOriginals(!showOriginals)}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="تبديل بين الأصل والترجمة"
          >
            {showOriginals ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{showOriginals ? 'الترجمة' : 'الأصل'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="إغلاق طبقة الترجمة"
            aria-label="إغلاق طبقة الترجمة"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Render each translated block over original position */}
      {blocks.map((block) => {
        const isCopied = copiedId === block.id;
        const displayText = showOriginals ? block.originalText : block.translatedText;

        return (
          <div
            key={block.id}
            onClick={() => onSelectBlock(block)}
            style={{
              top: `${block.box.top}%`,
              left: `${block.box.left}%`,
              width: `${block.box.width}%`,
              minHeight: `${block.box.height}%`,
            }}
            className="group absolute cursor-pointer rounded-md p-1.5 transition-all duration-200
              shadow-md hover:shadow-lg hover:ring-2 hover:ring-indigo-400 hover:z-50
              flex items-center justify-between text-right"
            dir={showOriginals ? 'ltr' : 'rtl'}
          >
            {/* Background block patch */}
            <div
              className="absolute inset-0 rounded-md transition-opacity"
              style={{
                backgroundColor: block.bgColor || '#0f172a',
                opacity: 0.94,
              }}
            />

            {/* Glowing border indication */}
            <div className="absolute inset-0 rounded-md border border-indigo-400/50 pointer-events-none" />

            {/* Text content */}
            <div className="relative z-10 w-full px-1">
              <p
                style={{
                  color: block.textColor || '#ffffff',
                }}
                className={`font-semibold leading-snug drop-shadow-sm ${
                  showOriginals ? 'font-sans text-xs' : 'font-cairo text-[13px]'
                }`}
              >
                {displayText}
              </p>
            </div>

            {/* Mini action buttons on hover */}
            <div className="relative z-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
              <button
                onClick={(e) => handleCopy(e, block)}
                className="p-1 rounded bg-black/60 text-white hover:bg-black/90 transition-colors"
                title="نسخ النص"
                aria-label="نسخ النص"
              >
                {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
