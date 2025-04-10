'use client';

import { useState, useEffect } from 'react';
import { UserCircleIcon, KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('account');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    str_number: '',
    sipp_number: '',
    password: '',
    confirm_password: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUserData(session.user);
          
          // Fetch profile data
          const { data: profile, error: profileError } = await supabase
            .from('psychologist_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile && !profileError) {
            setFormData(prev => ({
              ...prev,
              str_number: profile.str_number || '',
              sipp_number: profile.sipp_number || ''
            }));
            if (profile.signature_url) {
              setPreviewUrl(profile.signature_url);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSignatureFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (activeTab === 'personal') {
        // Upload signature if exists
        let signatureUrl = previewUrl;
        if (signatureFile) {
          const fileExt = signatureFile.name.split('.').pop();
          const fileName = `${userData.id}-signature.${fileExt}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('signatures')
            .upload(fileName, signatureFile, {
              cacheControl: '3600',
              upsert: true
            });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('signatures')
            .getPublicUrl(fileName);

          signatureUrl = publicUrl;
        }

        // Cek apakah profil sudah ada
        const { data: existingProfile } = await supabase
          .from('psychologist_profiles')
          .select('id')
          .eq('id', userData.id)
          .single();

        if (existingProfile) {
          // Update profil yang sudah ada
          const { error: updateError } = await supabase
            .from('psychologist_profiles')
            .update({
              str_number: formData.str_number,
              sipp_number: formData.sipp_number,
              signature_url: signatureUrl,
              updated_at: new Date().toISOString()
            })
            .eq('id', userData.id);

          if (updateError) throw updateError;
        } else {
          // Buat profil baru
          const { error: insertError } = await supabase
            .from('psychologist_profiles')
            .insert({
              id: userData.id,
              str_number: formData.str_number,
              sipp_number: formData.sipp_number,
              signature_url: signatureUrl,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (insertError) throw insertError;
        }

        setSuccess('Data profil berhasil disimpan');
      } else if (activeTab === 'account') {
        if (formData.password && formData.password !== formData.confirm_password) {
          throw new Error('Kata sandi tidak cocok');
        }

        if (formData.password) {
          const { error: updateError } = await supabase.auth.updateUser({
            password: formData.password
          });

          if (updateError) throw updateError;
          setSuccess('Kata sandi berhasil diubah');
        }
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setError(error.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Profil Psikolog</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Kelola informasi akun dan data pribadi Anda
          </p>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('account')}
              className={`${
                activeTab === 'account'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } group inline-flex items-center py-4 px-6 border-b-2 font-medium text-sm`}
            >
              <UserCircleIcon
                className={`${
                  activeTab === 'account' ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                } -ml-0.5 mr-2 h-5 w-5`}
              />
              Akun
            </button>
            <button
              onClick={() => setActiveTab('personal')}
              className={`${
                activeTab === 'personal'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } group inline-flex items-center py-4 px-6 border-b-2 font-medium text-sm`}
            >
              <KeyIcon
                className={`${
                  activeTab === 'personal' ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                } -ml-0.5 mr-2 h-5 w-5`}
              />
              Informasi Pribadi
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-5 sm:p-6">
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900">Informasi Akun</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Kelola informasi akun Anda seperti email dan kata sandi
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={userData?.email || ''}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Kata Sandi Baru
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center mt-6"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>
                
                <div className="relative">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Konfirmasi Kata Sandi
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    id="confirm-password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center mt-6"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900">Informasi Pribadi</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Kelola informasi pribadi Anda sebagai psikolog
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nama Psikolog
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={userData?.user_metadata?.full_name || ''}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="str" className="block text-sm font-medium text-gray-700">
                    Nomor STR/SIK
                  </label>
                  <input
                    type="text"
                    name="str_number"
                    id="str"
                    value={formData.str_number}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Masukkan nomor STR/SIK"
                  />
                </div>
                
                <div>
                  <label htmlFor="sipp" className="block text-sm font-medium text-gray-700">
                    Nomor SIPP/SIPPK
                  </label>
                  <input
                    type="text"
                    name="sipp_number"
                    id="sipp"
                    value={formData.sipp_number}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Masukkan nomor SIPP/SIPPK"
                  />
                </div>

                <div>
                  <label htmlFor="signature" className="block text-sm font-medium text-gray-700">
                    Tanda Tangan
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      name="signature"
                      id="signature"
                      accept="image/*"
                      onChange={handleSignatureChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary-50 file:text-primary-700
                        hover:file:bg-primary-100"
                    />
                  </div>
                  {previewUrl && (
                    <div className="mt-2">
                      <img
                        src={previewUrl}
                        alt="Preview Tanda Tangan"
                        className="max-w-xs h-auto border border-gray-300 rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 