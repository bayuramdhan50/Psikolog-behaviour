'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

// Schema untuk validasi form
const personalInfoSchema = z.object({
  nama_peserta: z.string().min(3, 'Nama peserta wajib diisi'),
  tanggal_lahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  nama_pt: z.string().optional(),
  sdr_sdri: z.enum(['SDR', 'SDRI']),
  jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']),
  tanggal_tes: z.string().min(1, 'Tanggal tes wajib diisi'),
  phq: z.string().optional(),
  keterangan_phq: z.string().optional(),
});

const istSchema = z.object({
  se_konkrit_praktis: z.number().min(0, 'Nilai tidak boleh negatif'),
  wa_verbal: z.number().min(0, 'Nilai tidak boleh negatif'),
  an_fleksibilitas_pikir: z.number().min(0, 'Nilai tidak boleh negatif'),
  ge_daya_abstraksi_verbal: z.number().min(0, 'Nilai tidak boleh negatif'),
  ra_berpikir_praktis: z.number().min(0, 'Nilai tidak boleh negatif'),
});

const papikostickSchema = z.object({
  n: z.number().min(0, 'Nilai tidak boleh negatif'),
  g: z.number().min(0, 'Nilai tidak boleh negatif'),
  a: z.number().min(0, 'Nilai tidak boleh negatif'),
  l: z.number().min(0, 'Nilai tidak boleh negatif'),
  p: z.number().min(0, 'Nilai tidak boleh negatif'),
  i: z.number().min(0, 'Nilai tidak boleh negatif'),
  t: z.number().min(0, 'Nilai tidak boleh negatif'),
  v: z.number().min(0, 'Nilai tidak boleh negatif'),
  s: z.number().min(0, 'Nilai tidak boleh negatif'),
  b: z.number().min(0, 'Nilai tidak boleh negatif'),
  o: z.number().min(0, 'Nilai tidak boleh negatif'),
  x: z.number().min(0, 'Nilai tidak boleh negatif'),
  c: z.number().min(0, 'Nilai tidak boleh negatif'),
  d: z.number().min(0, 'Nilai tidak boleh negatif'),
  r: z.number().min(0, 'Nilai tidak boleh negatif'),
  z: z.number().min(0, 'Nilai tidak boleh negatif'),
  e: z.number().min(0, 'Nilai tidak boleh negatif'),
  k: z.number().min(0, 'Nilai tidak boleh negatif'),
  f: z.number().min(0, 'Nilai tidak boleh negatif'),
  w: z.number().min(0, 'Nilai tidak boleh negatif'),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
type IstFormValues = z.infer<typeof istSchema>;
type PapikostickFormValues = z.infer<typeof papikostickSchema>;

export default function DataEntry() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form untuk Personal Information
  const personalInfoForm = useForm<PersonalInfoFormValues>({    
    defaultValues: {
      sdr_sdri: 'SDR',
      jenis_kelamin: 'Laki-laki',
    },
  });
  
  // Fungsi untuk mendapatkan keterangan PHQ berdasarkan nilai PHQ
  const getPhqDescription = (phqValue: string) => {
    const phq = parseInt(phqValue);
    if (isNaN(phq)) return '';
    if (phq < 5) return 'Tidak ada';
    if (phq < 10) return 'Ringan';
    if (phq < 15) return 'Sedang';
    if (phq < 20) return 'Cukup Berat';
    if (phq < 28) return 'Parah';
    return 'Parah';
  };

  // Watch PHQ value untuk update keterangan otomatis
  const phqValue = personalInfoForm.watch('phq');

  useEffect(() => {
    const keterangan = getPhqDescription(phqValue || '');
    personalInfoForm.setValue('keterangan_phq', keterangan);
  }, [phqValue, personalInfoForm]);

  // Form untuk IST
  const istForm = useForm<IstFormValues>({
    defaultValues: {
      se_konkrit_praktis: 0,
      wa_verbal: 0,
      an_fleksibilitas_pikir: 0,
      ge_daya_abstraksi_verbal: 0,
      ra_berpikir_praktis: 0,
    },
  });
  
  // Form untuk PAPIKOSTICK
  const papikostickForm = useForm<PapikostickFormValues>({
    defaultValues: {
      n: 0, g: 0, a: 0, l: 0, p: 0, i: 0, t: 0, v: 0, s: 0, b: 0,
      o: 0, x: 0, c: 0, d: 0, r: 0, z: 0, e: 0, k: 0, f: 0, w: 0,
    },
  });
  
  // Fungsi untuk menghitung IQ dari nilai IST
  const calculateIQ = (istData: IstFormValues) => {
    const { se_konkrit_praktis, wa_verbal, an_fleksibilitas_pikir, ge_daya_abstraksi_verbal, ra_berpikir_praktis } = istData;
    return (se_konkrit_praktis + wa_verbal + an_fleksibilitas_pikir + ge_daya_abstraksi_verbal + ra_berpikir_praktis) / 5;
  };
  
  // Fungsi untuk mendapatkan klasifikasi IQ
  const getIQClassification = (iq: number) => {
    if (iq >= 130) return 'Sangat Superior';
    if (iq >= 120) return 'Superior';
    if (iq >= 110) return 'Di Atas Rata-rata';
    if (iq >= 90) return 'Rata-rata';
    if (iq >= 80) return 'Di Bawah Rata-rata';
    if (iq >= 70) return 'Borderline';
    return 'Intellectual Disability';
  };
  
  // Fungsi untuk menghitung WA GE
  const calculateWAGE = (istData: IstFormValues) => {
    return (istData.wa_verbal + istData.ge_daya_abstraksi_verbal) / 2;
  };
  
  // Fungsi untuk menghitung nilai-nilai PAPIKOSTICK
  const calculatePapikostickValues = (papikostickData: PapikostickFormValues) => {
    return {
      ng: (papikostickData.n + papikostickData.g) / 2,
      cdr: (papikostickData.c + papikostickData.d + papikostickData.r) / 3,
      tv: (papikostickData.t + papikostickData.v) / 2,
      pi: (papikostickData.p + papikostickData.i) / 2,
      bs: (papikostickData.b + papikostickData.s) / 2,
      zk: (papikostickData.z + papikostickData.k) / 2,
    };
  };
  
  // Fungsi untuk mengirim data ke Supabase
  const submitData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Validasi semua form
      const personalInfoData = await personalInfoForm.trigger();
      const istData = await istForm.trigger();
      const papikostickData = await papikostickForm.trigger();
      
      if (!personalInfoData || !istData || !papikostickData) {
        setError('Mohon periksa kembali data yang diinput');
        setLoading(false);
        return;
      }
      
      // Ambil nilai dari form
      const personalInfo = personalInfoForm.getValues();
      const ist = istForm.getValues();
      const papikostick = papikostickForm.getValues();
      
      // Pastikan session aktif sebelum menyimpan data
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Sesi login telah berakhir. Silakan login kembali.');
        setTimeout(() => {
          router.push('/auth/login');
        }, 1500);
        return;
      }
      
      // Hitung nilai-nilai tambahan
      const iq = calculateIQ(ist);
      const iqClassification = getIQClassification(iq);
      const waGe = calculateWAGE(ist);
      const papikostickValues = calculatePapikostickValues(papikostick);
      
      // Generate nomor tes
      const year = new Date().getFullYear();
      const { count, error: countError } = await supabase
        .from('personal_info')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Error getting count:', countError);
        throw new Error('Gagal mendapatkan nomor tes');
      }
      
      const testNumber = `TES-${year}-${String(count ? count + 1 : 1).padStart(4, '0')}`;
      
      // Simpan data personal_info
      const { data: personalInfoResult, error: personalInfoError } = await supabase
        .from('personal_info')
        .insert([
          {
            no_tes: testNumber,
            nama_peserta: personalInfo.nama_peserta,
            tanggal_lahir: personalInfo.tanggal_lahir,
            nama_pt: personalInfo.nama_pt || null,
            sdr_sdri: personalInfo.sdr_sdri,
            jenis_kelamin: personalInfo.jenis_kelamin,
            tanggal_tes: personalInfo.tanggal_tes,
            phq: personalInfo.phq || null,
            keterangan_phq: personalInfo.keterangan_phq || null,
          },
        ])
        .select();
      
      if (personalInfoError) {
        console.error('Personal info error details:', personalInfoError);
        throw new Error(`Gagal menyimpan data personal: ${personalInfoError.message}`);
      }
      
      if (!personalInfoResult || personalInfoResult.length === 0) {
        throw new Error('Gagal mendapatkan ID data personal');
      }
      
      const personalInfoId = personalInfoResult[0].id;
      
      // Simpan data IST
      const { error: istError } = await supabase
        .from('ist')
        .insert([
          {
            personal_info_id: personalInfoId,
            se_konkrit_praktis: ist.se_konkrit_praktis,
            wa_verbal: ist.wa_verbal,
            an_fleksibilitas_pikir: ist.an_fleksibilitas_pikir,
            ge_daya_abstraksi_verbal: ist.ge_daya_abstraksi_verbal,
            ra_berpikir_praktis: ist.ra_berpikir_praktis,
            iq,
            iq_classification: iqClassification,
            wa_ge: waGe,
          },
        ]);
      
      if (istError) {
        console.error('IST error details:', istError);
        throw new Error(`Gagal menyimpan data IST: ${istError.message}`);
      }
      
      // Simpan data PAPIKOSTICK
      const { error: papikostickError } = await supabase
        .from('papikostick')
        .insert([
          {
            personal_info_id: personalInfoId,
            n: papikostick.n,
            g: papikostick.g,
            a: papikostick.a,
            l: papikostick.l,
            p: papikostick.p,
            i: papikostick.i,
            t: papikostick.t,
            v: papikostick.v,
            s: papikostick.s,
            b: papikostick.b,
            o: papikostick.o,
            x: papikostick.x,
            c: papikostick.c,
            d: papikostick.d,
            r: papikostick.r,
            z: papikostick.z,
            e: papikostick.e,
            k: papikostick.k,
            f: papikostick.f,
            w: papikostick.w,
            ng: papikostickValues.ng,
            cdr: papikostickValues.cdr,
            tv: papikostickValues.tv,
            pi: papikostickValues.pi,
            bs: papikostickValues.bs,
            zk: papikostickValues.zk,
          },
        ]);
      
      if (papikostickError) {
        console.error('PAPIKOSTICK error details:', papikostickError);
        throw new Error(`Gagal menyimpan data PAPIKOSTICK: ${papikostickError.message}`);
      }
      
      setSuccess('Data berhasil disimpan');
      
      // Redirect ke halaman laporan
      setTimeout(() => {
        router.push(`/dashboard/reports/${personalInfoId}`);
      }, 1500);
      
    } catch (err: any) {
      console.error('Error submitting data:', err);
      setError(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-6">Input Data Psikologis</h1>
      
      {/* Alert untuk error dan success */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <p className="text-green-700">{success}</p>
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('personal')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'personal' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Data Personal
          </button>
          <button
            onClick={() => setActiveTab('ist')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'ist' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            IST
          </button>
          <button
            onClick={() => setActiveTab('papikostick')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'papikostick' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            PAPIKOSTICK
          </button>
        </nav>
      </div>
      
      {/* Form Sections */}
      <div className="mt-6">
        {/* Personal Information Form */}
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Data Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nama_peserta" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Peserta *
                </label>
                <input
                  id="nama_peserta"
                  type="text"
                  {...personalInfoForm.register('nama_peserta')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {personalInfoForm.formState.errors.nama_peserta && (
                  <p className="mt-1 text-sm text-red-600">{personalInfoForm.formState.errors.nama_peserta.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="tanggal_lahir" className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Lahir *
                </label>
                <input
                  id="tanggal_lahir"
                  type="date"
                  {...personalInfoForm.register('tanggal_lahir')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {personalInfoForm.formState.errors.tanggal_lahir && (
                  <p className="mt-1 text-sm text-red-600">{personalInfoForm.formState.errors.tanggal_lahir.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="nama_pt" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama PT
                </label>
                <input
                  id="nama_pt"
                  type="text"
                  {...personalInfoForm.register('nama_pt')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="sdr_sdri" className="block text-sm font-medium text-gray-700 mb-1">
                  SDR/SDRI *
                </label>
                <select
                  id="sdr_sdri"
                  {...personalInfoForm.register('sdr_sdri')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="SDR">SDR</option>
                  <option value="SDRI">SDRI</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="jenis_kelamin" className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Kelamin *
                </label>
                <select
                  id="jenis_kelamin"
                  {...personalInfoForm.register('jenis_kelamin')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="tanggal_tes" className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Tes *
                </label>
                <input
                  id="tanggal_tes"
                  type="date"
                  {...personalInfoForm.register('tanggal_tes')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {personalInfoForm.formState.errors.tanggal_tes && (
                  <p className="mt-1 text-sm text-red-600">{personalInfoForm.formState.errors.tanggal_tes.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phq" className="block text-sm font-medium text-gray-700 mb-1">
                  PHQ
                </label>
                <input
                  id="phq"
                  type="text"
                  {...personalInfoForm.register('phq')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="keterangan_phq" className="block text-sm font-medium text-gray-700 mb-1">
                  Keterangan PHQ
                </label>
                <textarea
                  id="keterangan_phq"
                  rows={3}
                  {...personalInfoForm.register('keterangan_phq')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* IST Form */}
        {activeTab === 'ist' && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Data IST</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="se_konkrit_praktis" className="block text-sm font-medium text-gray-700 mb-1">
                  SE / Konkrit Praktis
                </label>
                <input
                  id="se_konkrit_praktis"
                  type="number"
                  min="0"
                  {...istForm.register('se_konkrit_praktis', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {istForm.formState.errors.se_konkrit_praktis && (
                  <p className="mt-1 text-sm text-red-600">{istForm.formState.errors.se_konkrit_praktis.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="wa_verbal" className="block text-sm font-medium text-gray-700 mb-1">
                  WA / Verbal
                </label>
                <input
                  id="wa_verbal"
                  type="number"
                  min="0"
                  {...istForm.register('wa_verbal', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {istForm.formState.errors.wa_verbal && (
                  <p className="mt-1 text-sm text-red-600">{istForm.formState.errors.wa_verbal.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="an_fleksibilitas_pikir" className="block text-sm font-medium text-gray-700 mb-1">
                  AN / Fleksibilitas Pikir
                </label>
                <input
                  id="an_fleksibilitas_pikir"
                  type="number"
                  min="0"
                  {...istForm.register('an_fleksibilitas_pikir', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {istForm.formState.errors.an_fleksibilitas_pikir && (
                  <p className="mt-1 text-sm text-red-600">{istForm.formState.errors.an_fleksibilitas_pikir.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="ge_daya_abstraksi_verbal" className="block text-sm font-medium text-gray-700 mb-1">
                  GE / Daya Abstraksi Verbal
                </label>
                <input
                  id="ge_daya_abstraksi_verbal"
                  type="number"
                  min="0"
                  {...istForm.register('ge_daya_abstraksi_verbal', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {istForm.formState.errors.ge_daya_abstraksi_verbal && (
                  <p className="mt-1 text-sm text-red-600">{istForm.formState.errors.ge_daya_abstraksi_verbal.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="ra_berpikir_praktis" className="block text-sm font-medium text-gray-700 mb-1">
                  RA / Berpikir Praktis
                </label>
                <input
                  id="ra_berpikir_praktis"
                  type="number"
                  min="0"
                  {...istForm.register('ra_berpikir_praktis', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {istForm.formState.errors.ra_berpikir_praktis && (
                  <p className="mt-1 text-sm text-red-600">{istForm.formState.errors.ra_berpikir_praktis.message}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* PAPIKOSTICK Form */}
        {activeTab === 'papikostick' && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Data PAPIKOSTICK</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Row 1 */}
              <div>
                <label htmlFor="n" className="block text-sm font-medium text-gray-700 mb-1">
                  N
                </label>
                <input
                  id="n"
                  type="number"
                  min="0"
                  {...papikostickForm.register('n', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="g" className="block text-sm font-medium text-gray-700 mb-1">
                  G
                </label>
                <input
                  id="g"
                  type="number"
                  min="0"
                  {...papikostickForm.register('g', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="a" className="block text-sm font-medium text-gray-700 mb-1">
                  A
                </label>
                <input
                  id="a"
                  type="number"
                  min="0"
                  {...papikostickForm.register('a', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="l" className="block text-sm font-medium text-gray-700 mb-1">
                  L
                </label>
                <input
                  id="l"
                  type="number"
                  min="0"
                  {...papikostickForm.register('l', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              {/* Row 2 */}
              <div>
                <label htmlFor="p" className="block text-sm font-medium text-gray-700 mb-1">
                  P
                </label>
                <input
                  id="p"
                  type="number"
                  min="0"
                  {...papikostickForm.register('p', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="i" className="block text-sm font-medium text-gray-700 mb-1">
                  I
                </label>
                <input
                  id="i"
                  type="number"
                  min="0"
                  {...papikostickForm.register('i', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="t" className="block text-sm font-medium text-gray-700 mb-1">
                  T
                </label>
                <input
                  id="t"
                  type="number"
                  min="0"
                  {...papikostickForm.register('t', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="v" className="block text-sm font-medium text-gray-700 mb-1">
                  V
                </label>
                <input
                  id="v"
                  type="number"
                  min="0"
                  {...papikostickForm.register('v', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              {/* Row 3 */}
              <div>
                <label htmlFor="s" className="block text-sm font-medium text-gray-700 mb-1">
                  S
                </label>
                <input
                  id="s"
                  type="number"
                  min="0"
                  {...papikostickForm.register('s', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="b" className="block text-sm font-medium text-gray-700 mb-1">
                  B
                </label>
                <input
                  id="b"
                  type="number"
                  min="0"
                  {...papikostickForm.register('b', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="o" className="block text-sm font-medium text-gray-700 mb-1">
                  O
                </label>
                <input
                  id="o"
                  type="number"
                  min="0"
                  {...papikostickForm.register('o', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="x" className="block text-sm font-medium text-gray-700 mb-1">
                  X
                </label>
                <input
                  id="x"
                  type="number"
                  min="0"
                  {...papikostickForm.register('x', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              {/* Row 4 */}
              <div>
                <label htmlFor="c" className="block text-sm font-medium text-gray-700 mb-1">
                  C
                </label>
                <input
                  id="c"
                  type="number"
                  min="0"
                  {...papikostickForm.register('c', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="d" className="block text-sm font-medium text-gray-700 mb-1">
                  D
                </label>
                <input
                  id="d"
                  type="number"
                  min="0"
                  {...papikostickForm.register('d', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="r" className="block text-sm font-medium text-gray-700 mb-1">
                  R
                </label>
                <input
                  id="r"
                  type="number"
                  min="0"
                  {...papikostickForm.register('r', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="z" className="block text-sm font-medium text-gray-700 mb-1">
                  Z
                </label>
                <input
                  id="z"
                  type="number"
                  min="0"
                  {...papikostickForm.register('z', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              {/* Row 5 */}
              <div>
                <label htmlFor="e" className="block text-sm font-medium text-gray-700 mb-1">
                  E
                </label>
                <input
                  id="e"
                  type="number"
                  min="0"
                  {...papikostickForm.register('e', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="k" className="block text-sm font-medium text-gray-700 mb-1">
                  K
                </label>
                <input
                  id="k"
                  type="number"
                  min="0"
                  {...papikostickForm.register('k', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="f" className="block text-sm font-medium text-gray-700 mb-1">
                  F
                </label>
                <input
                  id="f"
                  type="number"
                  min="0"
                  {...papikostickForm.register('f', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="w" className="block text-sm font-medium text-gray-700 mb-1">
                  W
                </label>
                <input
                  id="w"
                  type="number"
                  min="0"
                  {...papikostickForm.register('w', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="button"
          onClick={submitData}
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Menyimpan...' : 'Simpan Data'}
        </button>
      </div>
    </div>
  );
};


