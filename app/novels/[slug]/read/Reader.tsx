'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { Scene } from '@/types/db';
import EndingScreen from '@/app/components/EndingScreen';

type ReaderProps = {
  scenes: Scene[];
  novelTitle: string;
  novelSlug: string;
};

export default function Reader({ scenes, novelTitle, novelSlug }: ReaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEnding, setShowEnding] = useState(false);
  const [mounted, setMounted] = useState(false);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const storageKey = `lumatale.${novelSlug}.scene`;
    if (window.location.search.includes('restart=1')) {
      setCurrentIndex(0);
      setShowEnding(false);
      localStorage.setItem(storageKey, '0');
    } else {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= scenes.length - 1) {
          setCurrentIndex(parsed);
        }
      }
    }
    setMounted(true);
  }, [novelSlug, scenes.length]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(`lumatale.${novelSlug}.scene`, String(currentIndex));
  }, [currentIndex, mounted, novelSlug]);

  const goPrev = useCallback(() => {
    if (showEnding) {
      setShowEnding(false);
    } else if (currentIndex > 0) {
      setCurrentIndex((c) => c - 1);
    }
  }, [showEnding, currentIndex]);

  const goNext = useCallback(() => {
    if (currentIndex < scenes.length - 1) {
      setCurrentIndex((c) => c + 1);
    } else {
      setShowEnding(true);
    }
  }, [currentIndex, scenes.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'j' || e.key === 'J') {
        goPrev();
      } else if (
        e.key === 'ArrowRight' ||
        e.key === 'k' ||
        e.key === 'K' ||
        e.key === 'l' ||
        e.key === 'L'
      ) {
        goNext();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goPrev, goNext]);

  const progressPercent = showEnding
    ? 100
    : ((currentIndex + 1) / scenes.length) * 100;

  const isPrevDisabled = currentIndex === 0 && !showEnding;
  const isLastScene = currentIndex === scenes.length - 1;

  const sceneInitial = shouldReduce ? { opacity: 0 } : { opacity: 0, y: 8 };
  const sceneAnimate = { opacity: 1, y: 0 };
  const sceneExit = shouldReduce ? { opacity: 0 } : { opacity: 0, y: -8 };
  const endingInitial = shouldReduce ? { opacity: 0 } : { opacity: 0, y: 32 };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col">
      <AnimatePresence mode="wait">
        {showEnding ? (
          <motion.div
            key="ending"
            initial={endingInitial}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <EndingScreen novelTitle={novelTitle} novelSlug={novelSlug} />
          </motion.div>
        ) : (
          <motion.div
            key={currentIndex}
            initial={sceneInitial}
            animate={sceneAnimate}
            exit={sceneExit}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex-1 flex items-center justify-center px-6 py-20"
          >
            <article aria-live="polite" className="max-w-prose mx-auto w-full">
              <p className="italic text-muted text-sm tracking-widest text-center mb-2">
                场景 {currentIndex + 1} &middot; {scenes[currentIndex].title}
              </p>
              <div className="mt-2 mb-12 h-px bg-line w-12 mx-auto" />
              <div className="whitespace-pre-line text-lg leading-loose">
                {scenes[currentIndex].body}
              </div>
            </article>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom navigation bar */}
      <div className="sticky bottom-0 bg-paper/95 backdrop-blur-sm border-t border-line py-4 z-10">
        <div className="max-w-prose mx-auto px-6 flex flex-col gap-3">
          {/* Prev / indicator / next row */}
          <div className="flex items-center justify-between">
            <button
              onClick={goPrev}
              aria-label="上一页"
              aria-disabled={isPrevDisabled}
              className={`text-sm transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2${isPrevDisabled ? ' opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
            >
              ◀ 上一页
            </button>

            <span
              className="text-sm text-muted"
              style={{ fontFamily: "var(--font-mono, 'ui-monospace', monospace)" }}
            >
              {showEnding ? scenes.length : currentIndex + 1} / {scenes.length}
            </span>

            <button
              onClick={goNext}
              aria-label={isLastScene && !showEnding ? '完结' : '下一页'}
              className="text-sm transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              {isLastScene && !showEnding ? '完结 →' : '下一页 ▶'}
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-px bg-line w-full">
            <motion.div
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="h-full bg-ink"
            />
          </div>

          {/* Keyboard hint */}
          <p className="hidden md:block text-xs text-muted text-center">
            ← → 键盘翻页
          </p>
        </div>
      </div>
    </div>
  );
}
