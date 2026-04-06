'use client';

import { Suspense } from 'react';
import { Shield, MapPin, Calendar, User, Boxes, CheckCircle, XCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useVerifyProduct, useGetProductInfo, useGetProductHistory } from '@/lib/contracts';

const STAGES = [
  'Production',
  'Packaging',
  'Storage',
  'Transport',
  'Distribution',
  'Delivered',
];

function VerifyContent() {
  const searchParams = useSearchParams();
  const productIdParam = searchParams.get('id');
  
  const [productId, setProductId] = useState<bigint | null>(null);
  
  useEffect(() => {
    if (productIdParam) {
      try {
        const parsed = BigInt(productIdParam);
        setProductId(parsed);
      } catch {
        setProductId(null);
      }
    }
  }, [productIdParam]);

  const { data: verifyData } = useVerifyProduct(productId || BigInt(0));
  const { data: productInfo } = useGetProductInfo(productId || BigInt(0));
  const { data: history } = useGetProductHistory(productId || BigInt(0));

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const value = formData.get('productId') as string;
    try {
      const parsed = BigInt(value);
      setProductId(parsed);
    } catch {
      setProductId(null);
    }
  };

  const [exists] = verifyData || [false];

  return (
    <div>
      <form onSubmit={handleVerify} className="mb-8">
        <div className="flex gap-4">
          <input
            name="productId"
            type="text"
            placeholder="Enter Product ID to verify"
            className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
            defaultValue={productIdParam || ''}
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-500"
          >
            <Shield className="h-4 w-4" />
            Verify
          </button>
        </div>
      </form>

      {productId && (
        <div>
          {exists ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-emerald-800 bg-emerald-900/20 p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-emerald-500" />
                  <div>
                    <h2 className="text-xl font-bold text-emerald-400">Product Verified</h2>
                    <p className="text-gray-400">This product is registered on the blockchain</p>
                  </div>
                </div>
              </div>

              {productInfo && (
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                  <h3 className="mb-4 text-lg font-semibold">Product Details</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <Boxes className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-400">Name</div>
                        <div className="font-medium">{productInfo.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-400">Manufacturer</div>
                        <div className="font-medium">{productInfo.manufacturer}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-400">Origin</div>
                        <div className="font-medium">{productInfo.origin}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-400">Created</div>
                        <div className="font-medium">
                          {productInfo.createTime ? new Date(Number(productInfo.createTime) * 1000).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 border-t border-gray-800 pt-4">
                    <div className="text-sm text-gray-400">Owner Address</div>
                    <div className="mt-1 break-all font-mono text-sm text-gray-300">{productInfo.owner}</div>
                  </div>
                </div>
              )}

              {history && history.length > 0 && (
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                  <h3 className="mb-4 text-lg font-semibold">Traceability Timeline</h3>
                  <div className="space-y-4">
                    {history.map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-900/30 text-sm font-bold text-emerald-400">
                            {index + 1}
                          </div>
                          {index < history.length - 1 && (
                            <div className="h-full w-0.5 bg-gray-800" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{STAGES[Number(event.stage)] || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">
                              {event.timestamp ? new Date(Number(event.timestamp) * 1000).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">{event.description}</div>
                          <div className="mt-1 text-xs text-gray-500">
                            {event.location} • {event.actor ? `${event.actor.slice(0, 6)}...${event.actor.slice(-4)}` : 'Unknown'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-red-800 bg-red-900/20 p-6">
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-red-500" />
                <div>
                  <h2 className="text-xl font-bold text-red-400">Product Not Found</h2>
                  <p className="text-gray-400">This product ID is not registered on the blockchain</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Verify Product</h1>
        <p className="text-gray-400">Check product authenticity on blockchain</p>
      </div>

      <Suspense fallback={<div className="text-center text-gray-400">Loading...</div>}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}