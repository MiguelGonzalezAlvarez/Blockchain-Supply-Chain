'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Wallet, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export function CustomConnectButton() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [showDropdown, setShowDropdown] = useState(false);

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 rounded-lg border border-emerald-600 bg-emerald-900/30 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-900/50"
        >
          <Wallet className="h-4 w-4" />
          {address.slice(0, 6)}...{address.slice(-4)}
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-700 bg-gray-800 p-2">
            <button
              onClick={() => disconnect()}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {connectors.slice(0, 2).map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          <Wallet className="h-4 w-4" />
          Connect
        </button>
      ))}
    </div>
  );
}