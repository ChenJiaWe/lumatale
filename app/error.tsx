'use client';

import BrandWordmark from './components/BrandWordmark';
import Button from './components/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="flex flex-col gap-6 items-center text-center max-w-md">
        <BrandWordmark size="mini" />
        <h1
          className="text-3xl font-heading italic"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          翻页时出了一点意外
        </h1>
        <div className="h-px w-12 bg-line" />
        <p className="text-base text-muted">
          图书馆员正在记录这次失误。请稍候再试。
        </p>
        {error.digest && (
          <p className="text-xs text-muted">事件编号 {error.digest}</p>
        )}
        <div className="mt-6 flex gap-3">
          <Button variant="primary" onClick={reset}>
            重试
          </Button>
          <Button variant="ghost" href="/">
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}
