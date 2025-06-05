
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Upload, Users, FileText, Lightbulb, Package, Shield, Settings, ArrowLeft, Crown } from 'lucide-react';
import CSVTemplateDownload from '@/components/CSVTemplateDownload';
import UserManagement from '@/components/UserManagement';

const AdminPage: React.FC = () => {
  const { profile, isAdmin, adminLogout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const hasAdminAccess = isAdmin || profile?.role === 'admin';

  React.useEffect(() => {
    if (!hasAdminAccess) {
      navigate('/admin-login');
    }
  }, [hasAdminAccess, navigate]);

  const handleLogout = () => {
    if (isAdmin) {
      adminLogout();
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  };

  const handleCSVUpload = async (file: File, contentType: 'prompts' | 'ide_produk') => {
    if (!file) return;

    setUploading(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      console.log('CSV Headers:', headers);
      console.log('Content Type:', contentType);

      const dataRows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        
        headers.forEach((header, index) => {
          if (values[index]) {
            row[header] = values[index];
          }
        });

        if (contentType === 'prompts') {
          row.is_published = row.is_published === 'true' || row.is_published === '1' || true;
        } else if (contentType === 'ide_produk') {
          row.is_published = row.is_published === 'true' || row.is_published === '1' || true;
        }

        return row;
      }).filter(row => row.judul_konten || row.nama_produk);

      console.log('Parsed data rows:', dataRows);

      if (dataRows.length === 0) {
        throw new Error('Tidak ada data valid ditemukan dalam file CSV');
      }

      const { data, error } = await supabase.functions.invoke('batch-insert-content', {
        body: { 
          contentType, 
          dataRows 
        }
      });

      if (error) throw error;

      toast({
        title: "Upload berhasil",
        description: `${dataRows.length} item berhasil ditambahkan`
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload gagal",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, contentType: 'prompts' | 'ide_produk') => {
    const file = e.target.files?.[0];
    if (file) {
      handleCSVUpload(file, contentType);
    }
  };

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="text-lg text-white">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Header Admin dengan desain mewah */}
      <header className="bg-gradient-to-r from-slate-800 to-blue-900 shadow-2xl border-b border-blue-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-600 shadow-xl">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Shield className="w-6 h-6" />
                  Panel Admin
                </h1>
                <p className="text-blue-200 text-sm">
                  {isAdmin ? 'Admin Default' : `Manajemen Konten & Pengguna - ${profile?.username}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-blue-300 text-white hover:bg-blue-700 bg-blue-800/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {isAdmin ? 'Keluar Admin' : 'Kembali ke Dashboard'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Welcome Admin Card */}
        <Card className="mb-10 bg-gradient-to-r from-blue-600 to-green-600 text-white border-0 shadow-2xl">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Settings className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold mb-2">Panel Administrasi 🛠️</CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  Kelola konten, pengguna, dan pengaturan sistem
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Admin Tabs */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b">
            <CardTitle className="text-2xl text-gray-800 flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-600" />
              Manajemen Sistem
            </CardTitle>
            <CardDescription className="text-gray-600">
              Kelola semua aspek platform AI Kit dari satu tempat
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Tabs defaultValue="prompts" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100/80 backdrop-blur-sm h-16 rounded-xl p-2">
                <TabsTrigger value="prompts" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg font-medium text-sm px-4 py-3">
                  <FileText className="w-5 h-5" />
                  Prompts
                </TabsTrigger>
                <TabsTrigger value="ideas" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg font-medium text-sm px-4 py-3">
                  <Lightbulb className="w-5 h-5" />
                  Ide Produk
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg font-medium text-sm px-4 py-3">
                  <Package className="w-5 h-5" />
                  Produk
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg font-medium text-sm px-4 py-3">
                  <Users className="w-5 h-5" />
                  Pengguna
                </TabsTrigger>
              </TabsList>

              <TabsContent value="prompts">
                <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <Upload className="w-6 h-6" />
                      Upload Prompt dari CSV
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Format: judul_konten, deskripsi_konten, required_permission_key, is_published
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-8 space-y-6">
                    <div className="flex justify-between items-center">
                      <CSVTemplateDownload type="prompts" />
                    </div>
                    <div>
                      <Label htmlFor="prompts-csv" className="text-sm font-semibold text-gray-700 mb-3 block">File CSV Prompt</Label>
                      <Input
                        id="prompts-csv"
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleFileChange(e, 'prompts')}
                        disabled={uploading}
                        className="border-blue-200 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200"
                      />
                    </div>
                    {uploading && (
                      <div className="text-sm text-blue-700 bg-blue-100 p-4 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          Mengunggah dan memproses file...
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ideas">
                <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-100">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <Upload className="w-6 h-6" />
                      Upload Ide Produk dari CSV
                    </CardTitle>
                    <CardDescription className="text-green-100">
                      Format: judul_konten, deskripsi_konten, required_permission_key, is_published
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-8 space-y-6">
                    <div className="flex justify-between items-center">
                      <CSVTemplateDownload type="ideas" />
                    </div>
                    <div>
                      <Label htmlFor="ideas-csv" className="text-sm font-semibold text-gray-700 mb-3 block">File CSV Ide Produk</Label>
                      <Input
                        id="ideas-csv"
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleFileChange(e, 'ide_produk')}
                        disabled={uploading}
                        className="border-green-200 focus:border-green-500 bg-white shadow-sm hover:shadow-md transition-all duration-200"
                      />
                    </div>
                    {uploading && (
                      <div className="text-sm text-green-700 bg-green-100 p-4 rounded-xl border border-green-200">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                          Mengunggah dan memproses file...
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products">
                <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-100">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <Package className="w-6 h-6" />
                      Upload Produk Digital
                    </CardTitle>
                    <CardDescription className="text-purple-100">
                      Fitur ini akan segera tersedia untuk mengelola produk digital
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <div className="text-center py-12">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Segera Hadir!</h3>
                      <div className="text-gray-500 mb-6">
                        Fitur upload produk digital akan ditambahkan dalam update mendatang
                      </div>
                      <CSVTemplateDownload type="products" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users">
                <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-xl p-1">
                  <div className="bg-white rounded-lg">
                    <UserManagement />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPage;
