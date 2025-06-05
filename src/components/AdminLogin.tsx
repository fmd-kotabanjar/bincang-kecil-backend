
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onAdminLogin: (password: string) => Promise<boolean>;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onAdminLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await onAdminLogin(password);
      
      if (success) {
        toast({
          title: "Login admin berhasil",
          description: "Selamat datang di panel admin"
        });
        navigate('/admin');
      } else {
        toast({
          title: "Login gagal",
          description: "Password admin tidak valid",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-normal text-gray-900 mb-2">
            Login Admin
          </h1>
          <p className="text-sm text-gray-600">
            Masukkan password admin untuk mengakses panel kontrol
          </p>
        </div>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password Admin
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password admin"
                    required
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Memverifikasi...' : 'Akses Admin'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
