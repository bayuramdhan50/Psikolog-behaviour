import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col">
        <h1 className="text-4xl font-bold mb-8 text-center">Aplikasi Psikolog</h1>
        <p className="text-xl mb-8 text-center">
          Aplikasi untuk psikolog mengelola data tes psikologis dan mendapatkan laporan lengkap
        </p>
        <div className="flex gap-4">
          <Link 
            href="/auth/login" 
            className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/auth/register" 
            className="px-6 py-3 bg-white text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}