'use client';

import { useState, useEffect } from 'react';
import Button from './Button';

type Props = { novelSlug: string };

type Mode = 'idle' | 'editing' | 'saved';

type StorageRecord = { text: string; savedAt: number };

function formatTime(ms: number): string {
  const saved = new Date(ms);
  const now = new Date();
  const dayDiff = Math.floor((now.getTime() - saved.getTime()) / 86_400_000);
  if (dayDiff > 0) {
    return saved.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return saved.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

export default function EntryComposer({ novelSlug }: Props) {
  const key = `lumatale.${novelSlug}.entry`;

  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>('idle');
  const [text, setText] = useState('');
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const record: StorageRecord = JSON.parse(raw);
        if (record.text) {
          setText(record.text);
          setSavedAt(record.savedAt);
          setMode('saved');
        }
      }
    } catch {}
    setMounted(true);
  }, [key]);

  if (!mounted) return null;

  function save() {
    try {
      const now = Date.now();
      const trimmed = text.trim();
      localStorage.setItem(key, JSON.stringify({ text: trimmed, savedAt: now }));
      setText(trimmed);
      setSavedAt(now);
      setMode('saved');
    } catch {}
  }

  function cancelEdit() {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const record: StorageRecord = JSON.parse(raw);
        if (record.text) {
          setText(record.text);
          setSavedAt(record.savedAt);
          setMode('saved');
          return;
        }
      }
    } catch {}
    setText('');
    setMode('idle');
  }

  if (mode === 'idle') {
    return (
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
        <p className="text-muted text-sm tracking-widest italic">
          这一页是你的。
        </p>
        <Button variant="ghost" onClick={() => setMode('editing')}>
          拿起笔 →
        </Button>
      </div>
    );
  }

  if (mode === 'editing') {
    return (
      <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 280))}
          rows={3}
          placeholder="任何一句话，留给以后的自己。"
          maxLength={280}
          autoFocus
          className="bg-transparent border border-line p-4 text-base font-body w-full rounded-none resize-none focus:border-ink-soft outline-none transition-colors"
        />
        <div className="flex items-center justify-between">
          <span className="text-muted text-xs">{text.length} / 280</span>
          <div className="flex gap-2">
            <Button variant="link" onClick={cancelEdit}>取消</Button>
            <Button variant="ghost" onClick={save} disabled={text.trim().length === 0}>保存</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 max-w-md mx-auto text-center">
      <p
        className="text-lg italic leading-relaxed"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        「{text}」
      </p>
      <p className="text-muted text-xs tracking-widest">
        — 你写于 {formatTime(savedAt!)} —
      </p>
      <Button variant="link" onClick={() => setMode('editing')}>再写一次</Button>
    </div>
  );
}
