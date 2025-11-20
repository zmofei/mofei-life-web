"use client"

interface BlogBackgroundProps {
  /**
   * Use `scroll` to let the background move with the page instead of being fixed.
   */
  variant?: 'fixed' | 'scroll';
}

export default function BlogBackground({ variant = 'fixed' }: BlogBackgroundProps) {
  const positionClass =
    variant === 'fixed'
      ? 'fixed inset-0'
      : 'absolute inset-0';

  return (
    <div
      className={`${positionClass} pointer-events-none -z-10`}
      style={{
        backgroundImage: 'url(/img/blog-background.svg)',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: variant === 'fixed' ? 'fixed' : 'scroll',
      }}
    />
  );
}
