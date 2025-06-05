
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Check, X } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const passwordRequirements = [
    { text: 'Minimal 8 karakter', test: (pwd: string) => pwd.length >= 8 },
    { text: 'Mengandung huruf besar', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { text: 'Mengandung huruf kecil', test: (pwd: string) => /[a-z]/.test(pwd) },
    { text: 'Mengandung angka', test: (pwd: string) => /\d/.test(pwd) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Kata sandi tidak cocok",
        description: "Pastikan kata sandi dan konfirmasi kata sandi sama",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, username);
      toast({
        title: "Registrasi berhasil",
        description: "Akun Anda berhasil dibuat!"
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Registrasi gagal",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:block lg:flex-1 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="flex items-center justify-center h-full p-12">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-4xl font-bold">AI</span>
            </div>
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Bergabunglah dengan AI Kit
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Dapatkan akses ke prompt premium, ide produk inovatif, dan sumber daya digital eksklusif
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Google-style logo */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
            </div>
            <h1 className="text-2xl font-normal text-gray-900 mb-2">
              Buat Akun AI Kit Anda
            </h1>
            <p className="text-sm text-gray-600">
              Satu akun untuk semua layanan AI Kit
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Nama pengguna
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Pilih nama pengguna"
                />
              </div>

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
                  placeholder="nama@email.com"
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
                    placeholder="Buat kata sandi yang kuat"
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
                
                {password && (
                  <div className="mt-2 space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center text-xs">
                        {req.test(password) ? (
                          <Check className="h-3 w-3 text-green-500 mr-2" />
                        ) : (
                          <X className="h-3 w-3 text-red-500 mr-2" />
                        )}
                        <span className={req.test(password) ? 'text-green-600' : 'text-red-600'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Konfirmasi kata sandi
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ulangi kata sandi"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-600">
              Dengan membuat akun, Anda menyetujui{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500">Ketentuan Layanan</a>
              {' '}dan{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500">Kebijakan Privasi</a>
              {' '}kami.
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => navigate('/login')}
              >
                Masuk
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Membuat...' : 'Buat akun'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
