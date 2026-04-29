import Button from './Button';

type EndingScreenProps = {
  novelTitle: string;
  novelSlug: string;
  onRestart?: () => void;
};

export default function EndingScreen({ novelTitle, novelSlug, onRestart }: EndingScreenProps) {
  return (
    <div
      className="w-full flex-1 flex flex-col items-center justify-center bg-paper-dark px-6"
      role="main"
      aria-label="故事已读完"
    >
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
          {onRestart ? (
            <Button
              variant="ghost"
              onClick={onRestart}
              className="flex-1 justify-center"
              aria-label={`重新阅读《${novelTitle}》`}
            >
              重新阅读
            </Button>
          ) : (
            <Button
              variant="ghost"
              href={`/novels/${novelSlug}/read?restart=1`}
              className="flex-1 justify-center"
              aria-label={`重新阅读《${novelTitle}》`}
            >
              重新阅读
            </Button>
          )}
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
