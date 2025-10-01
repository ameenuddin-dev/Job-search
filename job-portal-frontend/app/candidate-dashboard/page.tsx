'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CandidateDashboard() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'candidate') {
      router.push('/login'); // unauthorized
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
      <h1 className="text-4xl font-bold text-white mb-6">
        Candidate Dashboard
      </h1>
      <p className="text-lg text-white">
        Welcome, browse and apply for jobs here.
      </p>
    </div>
  );
}
