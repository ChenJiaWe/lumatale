import BrandWordmark from './components/BrandWordmark';
import Button from './components/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="flex flex-col gap-6 items-center text-center max-w-md">
        <BrandWordmark size="mini" href="/" />
        <h1
          className="text-3xl font-heading italic"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          这一页不在午夜图书馆里
        </h1>
        <div className="h-px w-12 bg-line" />
        <p className="text-base text-muted">
          或许你应该回到入口，重新走一遍。
        </p>
        <Button variant="primary" href="/">
          返回首页 →
        </Button>
      </div>
    </div>
  );
}
