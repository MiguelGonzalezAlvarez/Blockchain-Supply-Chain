'use client';

import { useState } from 'react';
import { Boxes, Search } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  const [searchId, setSearchId] = useState('');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-gray-400">Browse and verify supply chain products</p>
      </div>

      <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
        <h2 className="mb-4 text-lg font-semibold">Verify Product</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter Product ID"
            className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <Link
            href={`/verify?id=${searchId}`}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500"
          >
            <Search className="h-4 w-4" />
            Verify
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-12 text-center">
        <Boxes className="mx-auto mb-4 h-12 w-12 text-gray-600" />
        <h3 className="text-lg font-semibold">No Products Yet</h3>
        <p className="mt-2 text-gray-400">
          Products will appear here once they are created on the blockchain.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Connect your wallet and create products from the dashboard.
        </p>
      </div>
    </div>
  );
}