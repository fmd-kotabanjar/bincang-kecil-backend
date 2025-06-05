import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Selamat datang di <span className="text-blue-600">AI Kit by @bapakpakaiai</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Buka akses prompt premium, ide produk, dan sumber daya digital dengan kode akses. 
          Bergabunglah dengan komunitas kami dan tingkatkan kreativitas Anda.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Ke Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Mulai Sekarang
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Masuk
                </Button>
              </Link>
            </>
          )}
          <Link to="/admin-login">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Admin
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Prompt Premium</h3>
            <p className="text-gray-600">Akses prompt berkualitas tinggi untuk proyek Anda</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Ide Produk</h3>
            <p className="text-gray-600">Temukan konsep produk digital yang inovatif</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Sumber Daya Digital</h3>
            <p className="text-gray-600">Akses produk digital dan alat eksklusif</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
