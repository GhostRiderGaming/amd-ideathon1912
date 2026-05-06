'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { href: '/', icon: '🏠', label: 'Home' },
    { href: '/log', icon: '📸', label: 'Log' },
    { href: '/chat', icon: '💬', label: 'AI Chat' },
    { href: '/history', icon: '📊', label: 'History' },
    { href: '/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {tabs.map(tab => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`bottom-nav-item ${pathname === tab.href ? 'active' : ''}`}
          aria-label={tab.label}
          aria-current={pathname === tab.href ? 'page' : undefined}
        >
          <span className="bottom-nav-icon">{tab.icon}</span>
          <span className="bottom-nav-label">{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
