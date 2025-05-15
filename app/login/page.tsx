'use client';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">RFP Portal</h1>
          <p className="mt-2 text-gray-600">Sign in to access the internal RFP portal</p>
        </div>
        
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-4 py-2 text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Image src="/google.svg" alt="Google logo" width={20} height={20} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
} 