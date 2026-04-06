'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Truck, QrCode, Globe, ArrowRight, Boxes } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const features = [
  {
    icon: Boxes,
    title: 'Product Registration',
    description: 'Register products on-chain with full metadata and traceability from origin.'
  },
  {
    icon: Truck,
    title: 'Supply Chain Events',
    description: 'Track every step: Production, Packaging, Storage, Transport, Distribution.'
  },
  {
    icon: QrCode,
    title: 'QR Verification',
    description: 'Consumers verify product authenticity by scanning a QR code.'
  },
  {
    icon: Shield,
    title: 'Blockchain Security',
    description: 'All data immutable and transparent on Ethereum Sepolia testnet.'
  },
];

const stats = [
  { label: 'Products Tracked', value: '12,847' },
  { label: 'Supply Chain Events', value: '48,293' },
  { label: 'Verified Transactions', value: '156,021' },
  { label: 'Active Users', value: '3,842' },
];

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="min-h-screen pt-16">
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent" />
        
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                Supply Chain
              </span>
              <br />
              <span className="text-white">Traceability on Blockchain</span>
            </h1>
            
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
              Track products from manufacturing to delivery. Verify authenticity with QR codes. 
              Built with Solidity, Next.js, and Ethereum.
            </p>

            <div className="flex justify-center gap-4">
              {isConnected ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-500 transition-colors"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <ConnectButton />
              )}
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-6 py-3 font-semibold text-white hover:bg-gray-800 transition-colors"
              >
                View Products
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-24 grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-emerald-400">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-16 text-center text-3xl font-bold">
            How It Works
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border border-gray-800 bg-gray-900/50 p-6"
              >
                <feature.icon className="mb-4 h-10 w-10 text-emerald-500" />
                <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="mb-8 text-3xl font-bold">Ready to Build Your Web3 Portfolio?</h2>
          <p className="mx-auto mb-8 max-w-xl text-gray-400">
            This DApp demonstrates smart contract development, ERC-721 tokens, 
            supply chain logic, and Web3 integration. Connect your wallet to get started.
          </p>
          <ConnectButton />
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Deployed on Ethereum Sepolia Testnet</span>
          </div>
        </div>
      </footer>
    </main>
  );
}