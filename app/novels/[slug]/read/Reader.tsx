'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { Scene } from '@/types/db';
import EndingScreen from '@/app/components/EndingScreen';
import BrandWordmark from '@/app/components/BrandWordmark';

type ReaderProps = {
  scenes: Scene[];
  novelTitle: string;
  novelSlug: string;
};

export default function Reader({ scenes, novelTitle, novelSlug }: ReaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEnding, setShowEnding] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const shouldReduce = useReducedMotion();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setTtsSupported(true);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((text: string, lang = 'zh-CN') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find((v) => v.lang.startsWith('zh'));
    if (zhVoice) utterance.voice = zhVoice;
    utterance.onend = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, []);

  const toggleSpeak = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(scenes[currentIndex].body);
    }
  }, [isSpeaking, stopSpeaking, speak, scenes, currentIndex]);

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

  useEffect(() => {
    if (!mounted) return;
    stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  useEffect(() => {
    if (showEnding) stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showEnding]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const restartReader = useCallback(() => {
    stopSpeaking();
    setShowEnding(false);
    setCurrentIndex(0);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`lumatale.${novelSlug}.scene`, '0');
      } catch {}
    }
  }, [novelSlug, stopSpeaking]);

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
    <div className="relative min-h-screen flex flex-col">
      {/* Top bar — hides during ending takeover */}
      {!showEnding && (
        <header className="flex items-center justify-between px-6 py-5 border-b border-line bg-paper/95 backdrop-blur-sm sticky top-0 z-10">
          <BrandWordmark size="mini" href="/" />
          <span className="text-muted text-xs tracking-widest">
            Vol. I &middot; {novelTitle}
          </span>
        </header>
      )}

      <AnimatePresence mode="wait">
        {showEnding ? (
          <motion.div
            key="ending"
            initial={endingInitial}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex-1 flex"
          >
            <EndingScreen
              novelTitle={novelTitle}
              novelSlug={novelSlug}
              onRestart={restartReader}
            />
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

      {/* Bottom navigation bar (hidden when ending takes over) */}
      {!showEnding && (
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

          {/* TTS toggle */}
          {ttsSupported && !showEnding && (
            <div className="flex justify-center">
              <button
                onClick={toggleSpeak}
                aria-pressed={isSpeaking}
                aria-label={isSpeaking ? '停止朗读' : '朗读当前场景'}
                className="text-sm transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {isSpeaking ? '停止' : '朗读'}
              </button>
            </div>
          )}

          {/* Keyboard hint */}
          <p className="hidden md:block text-xs text-muted text-center">
            ← → 键盘翻页
          </p>
        </div>
      </div>
      )}
    </div>
  );
}
