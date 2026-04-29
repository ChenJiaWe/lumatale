import Image from 'next/image';
import Link from 'next/link';
import type { Novel } from '@/types/db';

type NovelCardProps = {
  novel: Novel;
  disabled?: boolean;
};

export default function NovelCard({ novel, disabled = false }: NovelCardProps) {
  const cardContent = (
    <article
      className={[
        'flex flex-col border border-line w-full',
        'transition-colors duration-200 ease-out',
        disabled
          ? 'grayscale opacity-60 cursor-not-allowed'
          : 'cursor-pointer hover:border-ink-soft focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
      ].join(' ')}
      aria-label={disabled ? `${novel.title} — 即将上线` : novel.title}
    >
      {/* Cover */}
      <div className="relative w-full" style={{ aspectRatio: '3 / 4' }}>
        {novel.cover_url ? (
          <Image
            src={novel.cover_url}
            alt={`${novel.title} 封面`}
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            sizes="(max-width: 768px) calc(100vw - 32px), 320px"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-paper-dark"
            aria-hidden="true"
          >
            <span
              className="text-muted text-sm tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-heading)', writingMode: 'vertical-rl' }}
            >
              {novel.title}
            </span>
          </div>
        )}
        {disabled && (
          <div className="absolute inset-0 flex items-end justify-start p-3">
            <span className="bg-paper text-muted text-xs tracking-widest px-2 py-1 border border-line">
              即将上线
            </span>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-3 p-5">
        <div className="text-muted text-xs tracking-widest uppercase" aria-hidden="true">
          Volume I
        </div>

        <div>
          <h2
            className="text-2xl leading-tight tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {novel.title}
          </h2>
          <div className="mt-1 h-px bg-line" aria-hidden="true" />
        </div>

        <p className="text-muted text-sm leading-relaxed">
          {novel.author} &middot; {novel.scene_count} {novel.scene_count === 1 ? 'chapter' : 'chapters'}
        </p>

        <p className="text-ink-soft text-sm leading-relaxed line-clamp-3">{novel.synopsis}</p>

        {!disabled && (
          <span className="text-accent text-sm font-medium mt-1 tracking-wide">
            阅读 &rarr;
          </span>
        )}
      </div>
    </article>
  );

  if (disabled) {
    return <div className="w-full max-w-xs mx-auto md:mx-0">{cardContent}</div>;
  }

  return (
    <Link
      href={`/novels/${novel.slug}`}
      className="block w-full max-w-xs mx-auto md:mx-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
      aria-label={`阅读《${novel.title}》`}
    >
      {cardContent}
    </Link>
  );
}
