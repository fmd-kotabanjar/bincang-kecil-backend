
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Menu, Apps, AccountCircle } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Google-style Navigation */}
      <nav className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100">
            Tentang
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100">
            Bantuan
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100">
            <Apps className="w-5 h-5" />
          </Button>
          {user ? (
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100">
                <AccountCircle className="w-6 h-6" />
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700"
              >
                Masuk
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Google-style Logo */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-red-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">I</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">K</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">it</span>
                </div>
              </div>
            </div>
            <p className="text-lg text-gray-600 mb-8">
              oleh @bapakpakaiai
            </p>
          </div>

          {/* Search-like Input */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto relative">
              <div className="flex items-center border border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white">
                <Search className="w-5 h-5 text-gray-400 ml-4" />
                <input
                  type="text"
                  placeholder="Cari prompt AI, ide produk, atau sumber daya digital..."
                  className="flex-1 px-4 py-3 text-gray-900 bg-transparent border-none outline-none"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-12">
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard">
                  <Button 
                    size="lg"
                    className="bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300 px-8 py-3 rounded shadow-sm hover:shadow-md transition-all"
                  >
                    Ke Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button 
                    size="lg"
                    className="bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300 px-8 py-3 rounded shadow-sm hover:shadow-md transition-all"
                  >
                    Mulai Sekarang
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    size="lg"
                    className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded shadow-sm hover:shadow-md transition-all"
                  >
                    Masuk
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 leading-relaxed mb-12">
              Platform terdepan untuk prompt AI premium, ide produk inovatif, dan sumber daya digital eksklusif. 
              Bergabunglah dengan komunitas kami dan tingkatkan kreativitas Anda dengan alat berbasis AI.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="bg-blue-50 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-medium text-lg mb-2 text-gray-900">Prompt Premium</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Akses prompt berkualitas tinggi yang dirancang untuk performa dan hasil AI yang optimal</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-green-50 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="font-medium text-lg mb-2 text-gray-900">Ide Produk</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Temukan konsep produk digital inovatif dan peluang bisnis yang menarik</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-red-50 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-red-100 transition-colors">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-medium text-lg mb-2 text-gray-900">Sumber Daya Digital</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Akses produk digital eksklusif dan alat profesional untuk kebutuhan Anda</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              © 2024 AI Kit by @bapakpakaiai. Semua hak dilindungi.
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Privasi</a>
              <a href="#" className="hover:text-gray-900">Syarat</a>
              <a href="#" className="hover:text-gray-900">Bantuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
