'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther } from 'viem';

const CHAINTRACE_ABI = [
  {
    name: 'createProduct',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'origin', type: 'string' },
      { name: 'manufacturer', type: 'string' },
      { name: 'category', type: 'string' },
      { name: 'tokenURI', type: 'string' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'addTraceabilityEvent',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'productId', type: 'uint256' },
      { name: 'stage', type: 'uint256' },
      { name: 'location', type: 'string' },
      { name: 'description', type: 'string' },
    ],
    outputs: [],
  },
  {
    name: 'transferProduct',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'productId', type: 'uint256' },
      { name: 'to', type: 'address' },
    ],
    outputs: [],
  },
  {
    name: 'getProductHistory',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'productId', type: 'uint256' }],
    outputs: [
      {
        components: [
          { name: 'productId', type: 'uint256' },
          { name: 'stage', type: 'uint8' },
          { name: 'location', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'actor', type: 'address' },
          { name: 'timestamp', type: 'uint256' },
        ],
        type: 'tuple[]',
      },
    ],
  },
  {
    name: 'getProductInfo',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'productId', type: 'uint256' }],
    outputs: [
      {
        components: [
          { name: 'tokenId', type: 'uint256' },
          { name: 'name', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'origin', type: 'string' },
          { name: 'manufacturer', type: 'string' },
          { name: 'owner', type: 'address' },
          { name: 'createTime', type: 'uint256' },
        ],
        type: 'tuple',
      },
    ],
  },
  {
    name: 'verifyProduct',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'productId', type: 'uint256' }],
    outputs: [
      { name: 'exists', type: 'bool' },
      { name: 'name', type: 'string' },
      { name: 'owner', type: 'address' },
      { name: 'eventCount', type: 'uint256' },
    ],
  },
  {
    name: 'getTotalProducts',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export const CHAINTRACE_ADDRESS = '0x0000000000000000000000000000000000000000';

export interface ProductInfo {
  tokenId: bigint;
  name: string;
  description: string;
  origin: string;
  manufacturer: string;
  owner: string;
  createTime: bigint;
}

export interface TraceabilityEvent {
  productId: bigint;
  stage: bigint;
  location: string;
  description: string;
  actor: string;
  timestamp: bigint;
}

export function useCreateProduct() {
  const { data: hash, writeContract, error, isPending } = useWriteContract();
  
  const createProduct = async (product: {
    name: string;
    description: string;
    origin: string;
    manufacturer: string;
    category: string;
    tokenURI: string;
  }) => {
    writeContract({
      address: CHAINTRACE_ADDRESS,
      abi: CHAINTRACE_ABI,
      functionName: 'createProduct',
      args: [
        product.name,
        product.description,
        product.origin,
        product.manufacturer,
        product.category,
        product.tokenURI,
      ],
    });
  };

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash 
  });

  return { createProduct, hash, isPending, isConfirming, error };
}

export function useAddTraceabilityEvent() {
  const { data: hash, writeContract, error, isPending } = useWriteContract();
  
  const addEvent = async (event: {
    productId: bigint;
    stage: bigint;
    location: string;
    description: string;
  }) => {
    writeContract({
      address: CHAINTRACE_ADDRESS,
      abi: CHAINTRACE_ABI,
      functionName: 'addTraceabilityEvent',
      args: [
        event.productId,
        event.stage,
        event.location,
        event.description,
      ],
    });
  };

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash 
  });

  return { addEvent, hash, isPending, isConfirming, error };
}

export function useVerifyProduct(productId: bigint) {
  return useReadContract({
    address: CHAINTRACE_ADDRESS,
    abi: CHAINTRACE_ABI,
    functionName: 'verifyProduct',
    args: productId ? [productId] : undefined,
  });
}

export function useGetProductInfo(productId: bigint) {
  return useReadContract({
    address: CHAINTRACE_ADDRESS,
    abi: CHAINTRACE_ABI,
    functionName: 'getProductInfo',
    args: productId ? [productId] : undefined,
  });
}

export function useGetProductHistory(productId: bigint) {
  return useReadContract({
    address: CHAINTRACE_ADDRESS,
    abi: CHAINTRACE_ABI,
    functionName: 'getProductHistory',
    args: productId ? [productId] : undefined,
  });
}

export function useGetTotalProducts() {
  return useReadContract({
    address: CHAINTRACE_ADDRESS,
    abi: CHAINTRACE_ABI,
    functionName: 'getTotalProducts',
    args: [],
  });
}