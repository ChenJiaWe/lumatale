import Button from './Button';

type EndingScreenProps = {
  novelTitle: string;
  novelSlug: string;
};

export default function EndingScreen({ novelTitle, novelSlug }: EndingScreenProps) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-paper-dark px-6"
      style={{
        animation: 'endingFadeIn 800ms ease-out both',
      }}
      role="main"
      aria-label="故事已读完"
    >
      <style>{`
        @keyframes endingFadeIn {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes endingFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        }
      `}</style>

      <div className="flex flex-col items-center gap-8 max-w-sm text-center">
        {/* Ellipsis ornament */}
        <span
          className="text-muted text-4xl tracking-[0.5em]"
          aria-hidden="true"
        >
          &hellip;
        </span>

        {/* Closing line */}
        <p
          className="text-2xl leading-relaxed italic"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          而最后一页，是空白的。
        </p>

        {/* Attribution */}
        <p
          className="text-muted text-sm tracking-widest"
          aria-live="polite"
        >
          &mdash; 你已读完《{novelTitle}》&mdash;
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full">
          <Button
            variant="ghost"
            href={`/novels/${novelSlug}/read`}
            className="flex-1 justify-center"
            aria-label={`重新阅读《${novelTitle}》`}
          >
            重新阅读
          </Button>
          <Button
            variant="ghost"
            href="/"
            className="flex-1 justify-center"
            aria-label="返回首页"
          >
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}
