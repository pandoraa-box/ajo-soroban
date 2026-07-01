import Link from 'next/link';

const LINKS = [
  { label: 'Circles',       href: '/dashboard/circles'   },
  { label: 'Dashboard',     href: '/dashboard'           },
  { label: 'How it works',  href: '/#how-it-works'       },
  { label: 'GitHub',        href: 'https://github.com/pandoraa-box/ajo-soroban', target: '_blank' },
];

export function Footer() {
  return (
    <footer className="bg-white border-t border-ajo-border">
      <div className="page-width flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ajo-dark">
            <span className="text-xs font-bold text-ajo-lime">A</span>
          </div>
          <span className="text-sm font-semibold text-ajo-dark">Ajo</span>
          <span className="ml-2 text-xs text-ajo-muted">© {new Date().getFullYear()}</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              target={l.target}
              rel={l.target ? 'noopener noreferrer' : undefined}
              className="text-sm text-ajo-muted hover:text-ajo-dark transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
