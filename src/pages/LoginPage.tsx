
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast({
        title: "Masuk berhasil",
        description: "Selamat datang kembali!"
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Masuk gagal",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Google-style logo */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
            </div>
            <h1 className="text-2xl font-normal text-gray-900 mb-2">
              Masuk ke akun Anda
            </h1>
            <p className="text-sm text-gray-600">
              Gunakan Akun AI Kit Anda
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan email Anda"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Kata sandi
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan kata sandi"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Buat akun
                </Link>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Lupa kata sandi?
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => navigate('/')}
              >
                Kembali
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:block lg:flex-1 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="flex items-center justify-center h-full p-12">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-4xl font-bold">AI</span>
            </div>
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Selamat datang di AI Kit
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Platform terdepan untuk prompt AI premium, ide produk inovatif, dan sumber daya digital eksklusif
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
