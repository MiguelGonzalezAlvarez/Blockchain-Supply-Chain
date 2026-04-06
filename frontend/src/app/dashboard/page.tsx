'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Boxes, Plus, Truck, QrCode } from 'lucide-react';
import Link from 'next/link';
import { useCreateProduct, CHAINTRACE_ADDRESS } from '@/lib/contracts';

const STAGES = [
  { value: 0, label: 'Production', description: 'Product manufactured' },
  { value: 1, label: 'Packaging', description: 'Product packaged' },
  { value: 2, label: 'Storage', description: 'In warehouse' },
  { value: 3, label: 'Transport', description: 'In transit' },
  { value: 4, label: 'Distribution', description: 'At distributor' },
  { value: 5, label: 'Delivered', description: 'Delivered to consumer' },
];

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const { createProduct, isPending, isConfirming } = useCreateProduct();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    origin: '',
    manufacturer: '',
    category: '',
    tokenURI: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct({
      ...formData,
      tokenURI: formData.tokenURI || 'https://example.com/metadata.json',
    });
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
        <Boxes className="h-16 w-16 text-gray-600" />
        <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
        <p className="text-gray-400">Connect your wallet to access the dashboard</p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400">Manage your supply chain products</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-semibold">Create Product</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-400">Product Name</label>
              <input
                type="text"
                required
                className="w rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div>
              <label className="mb-1 block text-sm text-gray-400">Description</label>
              <textarea
                required
                rows={2}
                className="w rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">Origin</label>
              <input
                type="text"
                required
                className="w rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                placeholder="e.g., Mexico, USA, China"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">Manufacturer</label>
              <input
                type="text"
                required
                className="w rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">Category</label>
              <input
                type="text"
                required
                className="w rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                placeholder="e.g., Electronics, Clothing, Food"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isPending || isConfirming}
              className="w rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {isPending ? 'Signing...' : isConfirming ? 'Confirming...' : 'Create Product'}
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-semibold">Supply Chain Stages</h2>
          </div>
          
          <div className="space-y-3">
            {STAGES.map((stage) => (
              <div
                key={stage.value}
                className="flex items-center gap-3 rounded-lg bg-gray-800/50 p-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-900/30 text-sm font-bold text-emerald-400">
                  {stage.value + 1}
                </div>
                <div>
                  <div className="font-medium">{stage.label}</div>
                  <div className="text-xs text-gray-500">{stage.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <QrCode className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          
          <div className="space-y-3">
            <Link
              href="/products"
              className="block rounded-lg bg-gray-800 p-3 hover:bg-gray-700"
            >
              <div className="font-medium">View All Products</div>
              <div className="text-sm text-gray-400">Browse registered products</div>
            </Link>
            
            <Link
              href="/verify"
              className="block rounded-lg bg-gray-800 p-3 hover:bg-gray-700"
            >
              <div className="font-medium">Verify Product</div>
              <div className="text-sm text-gray-400">Check authenticity via ID</div>
            </Link>
          </div>
          
          <div className="mt-4 rounded-lg bg-gray-800/50 p-3">
            <div className="text-xs text-gray-400">Contract Address</div>
            <div className="mt-1 break-all text-xs font-mono text-gray-300">
              {CHAINTRACE_ADDRESS}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}