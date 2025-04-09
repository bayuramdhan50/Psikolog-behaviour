'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';

type TestData = {
  id: string;
  no_tes: string;
  nama_peserta: string;
  tanggal_tes: string;
  jenis_kelamin: string;
  nama_pt?: string;
};

export default function Reports() {
  const router = useRouter();
  const [tests, setTests] = useState<TestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { data, error } = await supabase
          .from('personal_info')
          .select('id, no_tes, nama_peserta, tanggal_tes, jenis_kelamin, nama_pt')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTests(data || []);
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    setDeleteLoading(true);
    try {
      // Delete related records first
      await supabase.from('ist').delete().eq('personal_info_id', id);
      await supabase.from('papikostick').delete().eq('personal_info_id', id);
      
      // Then delete the main record
      const { error } = await supabase
        .from('personal_info')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update the tests list
      setTests(tests => tests.filter(test => test.id !== id));
    } catch (error) {
      console.error('Error deleting test:', error);
      alert('Gagal menghapus data');
    } finally {
      setDeleteLoading(false);
    }
  };

  const exportToExcel = async () => {
    setExportLoading(true);
    try {
      // Fetch complete data for export
      const { data, error } = await supabase
        .from('personal_info')
        .select(`
          id, no_tes, nama_peserta, tanggal_lahir, nama_pt, sdr_sdri, jenis_kelamin, tanggal_tes, phq, keterangan_phq,
          ist(se_konkrit_praktis, wa_verbal, an_fleksibilitas_pikir, ge_daya_abstraksi_verbal, ra_berpikir_praktis, iq, iq_classification, wa_ge),
          papikostick(n, g, a, l, p, i, t, v, s, b, o, x, c, d, r, z, e, k, f, w, ng, cdr, tv, pi, bs, zk)
        `);

      if (error) throw error;

      // Transform data for Excel
      const excelData = data?.map(item => {
        const ist = item.ist?.[0] || {};
        const papikostick = item.papikostick?.[0] || {};

        return {
          'No Tes': item.no_tes,
          'Nama Peserta': item.nama_peserta,
          'Tanggal Lahir': dayjs(item.tanggal_lahir).format('DD/MM/YYYY'),
          'Nama PT': item.nama_pt || '-',
          'SDR/SDRI': item.sdr_sdri,
          'Jenis Kelamin': item.jenis_kelamin,
          'Tanggal Tes': dayjs(item.tanggal_tes).format('DD/MM/YYYY'),
          'PHQ': item.phq || '-',
          'Keterangan PHQ': item.keterangan_phq || '-',
          // IST data
          'SE / Konkrit Praktis': ist.se_konkrit_praktis || 0,
          'WA / Verbal': ist.wa_verbal || 0,
          'AN / Fleksibilitas Pikir': ist.an_fleksibilitas_pikir || 0,
          'GE / Daya Abstraksi Verbal': ist.ge_daya_abstraksi_verbal || 0,
          'RA / Berpikir Praktis': ist.ra_berpikir_praktis || 0,
          'IQ': ist.iq || 0,
          'Klasifikasi IQ': ist.iq_classification || '-',
          'WA GE': ist.wa_ge || 0,
          // PAPIKOSTICK data
          'N': papikostick.n || 0,
          'G': papikostick.g || 0,
          'A': papikostick.a || 0,
          'L': papikostick.l || 0,
          'P': papikostick.p || 0,
          'I': papikostick.i || 0,
          'T': papikostick.t || 0,
          'V': papikostick.v || 0,
          'S': papikostick.s || 0,
          'B': papikostick.b || 0,
          'O': papikostick.o || 0,
          'X': papikostick.x || 0,
          'C': papikostick.c || 0,
          'D': papikostick.d || 0,
          'R': papikostick.r || 0,
          'Z': papikostick.z || 0,
          'E': papikostick.e || 0,
          'K': papikostick.k || 0,
          'F': papikostick.f || 0,
          'W': papikostick.w || 0,
          'NG': papikostick.ng || 0,
          'CDR': papikostick.cdr || 0,
          'TV': papikostick.tv || 0,
          'PI': papikostick.pi || 0,
          'BS': papikostick.bs || 0,
          'ZK': papikostick.zk || 0,
        };
      }) || [];

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Tes Psikologis');

      // Generate Excel file
      XLSX.writeFile(workbook, `Data_Tes_Psikologis_${dayjs().format('YYYY-MM-DD')}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Gagal mengekspor data ke Excel');
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Laporan Tes Psikologis</h1>
        <button
          onClick={exportToExcel}
          disabled={exportLoading || tests.length === 0}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exportLoading ? 'Mengekspor...' : 'Export ke Excel'}
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No Tes
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Peserta
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jenis Kelamin
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama PT
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal Tes
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tests.length > 0 ? (
              tests.map((test) => (
                <tr key={test.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {test.no_tes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {test.nama_peserta}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {test.jenis_kelamin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {test.nama_pt || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dayjs(test.tanggal_tes).format('DD/MM/YYYY')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="space-x-4">
                      <Link
                        href={`/dashboard/reports/${test.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Lihat
                      </Link>
                      <button
                        onClick={() => handleDelete(test.id)}
                        disabled={deleteLoading}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Belum ada data tes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}