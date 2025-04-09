'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [totalTests, setTotalTests] = useState(0);
  const [recentTests, setRecentTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total tests count
        const { count } = await supabase
          .from('personal_info')
          .select('*', { count: 'exact', head: true });

        setTotalTests(count || 0);

        // Fetch recent tests
        const { data } = await supabase
          .from('personal_info')
          .select('id, no_tes, nama_peserta, tanggal_tes')
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentTests(data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900">Total Tes Psikologis</h2>
            <div className="mt-3 text-3xl font-semibold text-primary-600">{totalTests}</div>
            <div className="mt-4">
              <Link 
                href="/dashboard/reports" 
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Lihat semua laporan
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900">Tes Terbaru</h2>
            {recentTests.length > 0 ? (
              <ul className="mt-3 divide-y divide-gray-200">
                {recentTests.map((test) => (
                  <li key={test.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{test.nama_peserta}</p>
                        <p className="text-sm text-gray-500">No. Tes: {test.no_tes}</p>
                      </div>
                      <div>
                        <Link 
                          href={`/dashboard/reports/${test.id}`} 
                          className="text-sm font-medium text-primary-600 hover:text-primary-500"
                        >
                          Lihat
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-gray-500">Belum ada data tes</p>
            )}
            <div className="mt-4">
              <Link 
                href="/dashboard/data-entry" 
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Input data baru
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}