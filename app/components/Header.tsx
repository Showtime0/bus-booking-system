'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/search', label: 'Search', icon: '🔍' },
    { href: '/bookings', label: 'My Bookings', icon: '🎫' },
    { href: '/profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <>
      {/* Blur overlay with animation */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <header className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-50 transition-colors duration-200">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-red-600 dark:text-red-500">
              BusBooking
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-red-600 dark:hover:text-red-500 flex items-center space-x-1
                    ${isActive(link.href) 
                      ? 'text-red-600 dark:text-red-500' 
                      : 'text-gray-600 dark:text-gray-300'}`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                <span className="text-xl">
                  {theme === 'light' ? '🌙' : '☀️'}
                </span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                <span className="text-xl">
                  {theme === 'light' ? '🌙' : '☀️'}
                </span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <svg
                  className="w-6 h-6 text-gray-600 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden fixed top-[65px] left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
            }`}
          >
            <div className="container mx-auto py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isActive(link.href)
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-[73px]" />
    </>
  );
} 