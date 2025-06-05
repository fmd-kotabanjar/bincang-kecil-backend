
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
import { Upload, Users, FileText, Lightbulb, Package, Shield, Settings, ArrowLeft, Database } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Google-style Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded bg-gradient-to-r from-red-500 to-blue-500 flex items-center justify-center mr-3">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-normal text-gray-900">Admin Panel</span>
              </div>
              <div className="ml-4 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                {isAdmin ? 'Super Admin' : 'Admin'}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {isAdmin ? 'Keluar Admin' : 'Kembali'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-normal text-gray-900 mb-2">
            Panel Administrasi
          </h1>
          <p className="text-gray-600">
            Kelola konten, pengguna, dan pengaturan sistem AI Kit
          </p>
        </div>

        {/* Admin Tabs */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-0">
            <Tabs defaultValue="prompts" className="w-full">
              <TabsList className="w-full justify-start border-b border-gray-200 bg-white rounded-none h-auto p-0">
                <TabsTrigger 
                  value="prompts" 
                  className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white rounded-none"
                >
                  <FileText className="w-4 h-4" />
                  Prompts
                </TabsTrigger>
                <TabsTrigger 
                  value="ideas" 
                  className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white rounded-none"
                >
                  <Lightbulb className="w-4 h-4" />
                  Ide Produk
                </TabsTrigger>
                <TabsTrigger 
                  value="products" 
                  className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white rounded-none"
                >
                  <Package className="w-4 h-4" />
                  Produk
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white rounded-none"
                >
                  <Users className="w-4 h-4" />
                  Pengguna
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="prompts" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Prompt dari CSV</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Format: judul_konten, deskripsi_konten, required_permission_key, is_published
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <CSVTemplateDownload type="prompts" />
                    </div>
                    
                    <div>
                      <Label htmlFor="prompts-csv" className="text-sm font-medium text-gray-700">
                        File CSV Prompt
                      </Label>
                      <Input
                        id="prompts-csv"
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleFileChange(e, 'prompts')}
                        disabled={uploading}
                        className="mt-1"
                      />
                    </div>
                    
                    {uploading && (
                      <div className="text-sm text-blue-700 bg-blue-50 p-4 rounded-md border border-blue-200">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          Mengunggah dan memproses file...
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="ideas" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Ide Produk dari CSV</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Format: judul_konten, deskripsi_konten, required_permission_key, is_published
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <CSVTemplateDownload type="ideas" />
                    </div>
                    
                    <div>
                      <Label htmlFor="ideas-csv" className="text-sm font-medium text-gray-700">
                        File CSV Ide Produk
                      </Label>
                      <Input
                        id="ideas-csv"
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleFileChange(e, 'ide_produk')}
                        disabled={uploading}
                        className="mt-1"
                      />
                    </div>
                    
                    {uploading && (
                      <div className="text-sm text-green-700 bg-green-50 p-4 rounded-md border border-green-200">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                          Mengunggah dan memproses file...
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="products" className="mt-0">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Segera Hadir!</h3>
                    <p className="text-gray-600 mb-6">
                      Fitur upload produk digital akan ditambahkan dalam update mendatang
                    </p>
                    <CSVTemplateDownload type="products" />
                  </div>
                </TabsContent>

                <TabsContent value="users" className="mt-0">
                  <UserManagement />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPage;
