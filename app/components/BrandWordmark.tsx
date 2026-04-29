import Link from 'next/link';

type BrandWordmarkProps = {
  size?: 'hero' | 'mini';
  href?: string;
};

export default function BrandWordmark({ size = 'hero', href = '/' }: BrandWordmarkProps) {
  const isHero = size === 'hero';

  const wordmark = (
    <span
      className={[
        'inline-flex flex-col items-center gap-1',
        'font-heading font-medium tracking-widest lowercase',
        isHero ? 'text-7xl' : 'text-xl',
      ].join(' ')}
      style={{ fontFamily: 'var(--font-heading)' }}
    >
      <span>lumatale</span>
      <span
        className="block bg-line"
        style={{
          height: '1px',
          width: '100%',
        }}
        aria-hidden="true"
      />
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
        aria-label="lumatale — 返回首页"
      >
        {wordmark}
      </Link>
    );
  }

  return <div className="inline-flex">{wordmark}</div>;
}
