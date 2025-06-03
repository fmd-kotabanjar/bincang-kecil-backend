
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

const AdminPage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  // Redirect if not admin
  React.useEffect(() => {
    if (profile && profile.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [profile, navigate]);

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

        // Ensure required fields
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

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold">Panel Admin</h1>
              <p className="text-sm text-gray-600">Kelola konten dan pengguna</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Kembali ke Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="prompts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prompts">Upload Prompt</TabsTrigger>
            <TabsTrigger value="ideas">Upload Ide Produk</TabsTrigger>
            <TabsTrigger value="products">Upload Produk Digital</TabsTrigger>
          </TabsList>

          <TabsContent value="prompts">
            <Card>
              <CardHeader>
                <CardTitle>Upload Prompt dari CSV</CardTitle>
                <CardDescription>
                  Format CSV: judul_konten, deskripsi_konten, required_permission_key, is_published
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prompts-csv">File CSV Prompt</Label>
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
                    <div className="text-sm text-gray-600">
                      Mengupload dan memproses file...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ideas">
            <Card>
              <CardHeader>
                <CardTitle>Upload Ide Produk dari CSV</CardTitle>
                <CardDescription>
                  Format CSV: judul_konten, deskripsi_konten, required_permission_key, is_published
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ideas-csv">File CSV Ide Produk</Label>
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
                    <div className="text-sm text-gray-600">
                      Mengupload dan memproses file...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Upload Produk Digital</CardTitle>
                <CardDescription>
                  Fitur ini akan segera hadir untuk mengelola produk digital
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-gray-500">
                  Fungsi upload produk digital akan ditambahkan nanti
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPage;
