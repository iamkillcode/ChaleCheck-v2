'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold">
                ChaleCheck
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/restaurants"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/restaurants')}`}
              >
                Restaurants
              </Link>
              <Link
                href="/restaurants/new"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/restaurants/new')}`}
              >
                Add Restaurant
              </Link>
              <Link
                href="/profile"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/profile')}`}
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">© 2024 ChaleCheck. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/about" className="text-sm hover:text-gray-300">
                About
              </Link>
              <Link href="/contact" className="text-sm hover:text-gray-300">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 