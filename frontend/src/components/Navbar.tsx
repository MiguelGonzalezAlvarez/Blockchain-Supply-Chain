'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Box } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
          <Box className="h-8 w-8 text-emerald-500" />
          <span>ChainTrace</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/products" className="text-sm text-gray-300 hover:text-white transition-colors">
            Products
          </Link>
          <ConnectButton showBalance={false} />
        </div>
      </div>
    </nav>
  );
}