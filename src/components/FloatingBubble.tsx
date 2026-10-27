import React, { useState, useRef, useEffect } from 'react';
import { Languages, Sparkles } from 'lucide-react';

interface FloatingBubbleProps {
  parentRef: React.RefObject<HTMLDivElement | null>;
  onTriggerTranslate: () => void;
  isScanning: boolean;
  opacity: number;
  size: 'small' | 'medium' | 'large';
}

export const FloatingBubble: React.FC<FloatingBubbleProps> = ({
  parentRef,
  onTriggerTranslate,
  isScanning,
  opacity,
  size,
}) => {
  const [position, setPosition] = useState({ x: 280, y: 320 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 280,
    posY: 320,
  });
  const hasMovedRef = useRef(false);

  const sizePixels = size === 'small' ? 44 : size === 'large' ? 60 : 52;
  const iconSize = size === 'small' ? 20 : size === 'large' ? 28 : 24;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !parentRef.current) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasMovedRef.current = true;
    }

    const parentRect = parentRef.current.getBoundingClientRect();
    const maxX = parentRect.width - sizePixels - 8;
    const maxY = parentRect.height - sizePixels - 40;

    const newX = Math.max(8, Math.min(maxX, dragStartRef.current.posX + dx));
    const newY = Math.max(50, Math.min(maxY, dragStartRef.current.posY + dy));

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    if (!hasMovedRef.current) {
      // Tap detected!
      onTriggerTranslate();
    } else if (parentRef.current) {
      // Magnetic snap to nearest edge
      const parentRect = parentRef.current.getBoundingClientRect();
      const midPoint = parentRect.width / 2;
      const targetX = position.x < midPoint ? 12 : parentRect.width - sizePixels - 12;
      setPosition((prev) => ({ ...prev, x: targetX }));
    }
  };

  return (
    <div
      role="button"
      aria-label="الزر العائم لترجمة الشاشة (Screen Translator Floating Bubble)"
      title="انقر لترجمة الشاشة أو اسحب لتغيير الموضع"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        width: `${sizePixels}px`,
        height: `${sizePixels}px`,
        opacity: isDragging ? 0.9 : opacity,
      }}
      className={`absolute top-0 left-0 z-50 select-none cursor-grab active:cursor-grabbing touch-none
        rounded-full flex items-center justify-center transition-shadow
        bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-500
        text-white shadow-xl shadow-indigo-600/40 border-2 border-white/60
        ${isScanning ? 'scale-110 ring-4 ring-cyan-400 animate-pulse' : 'hover:scale-105'}
      `}
    >
      {isScanning ? (
        <Sparkles size={iconSize} className="animate-spin text-cyan-200" />
      ) : (
        <Languages size={iconSize} className="drop-shadow" />
      )}

      {/* Ripple pulse ring when idle */}
      {!isDragging && !isScanning && (
        <span className="absolute -inset-1 rounded-full border border-indigo-400/40 animate-ping pointer-events-none" />
      )}
    </div>
  );
};
