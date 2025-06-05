
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
import { Upload, Users, FileText, Lightbulb, Package } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="text-lg text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-sm text-gray-600">
                  {isAdmin ? 'Default Admin' : `Content & User Management - ${profile?.username}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-blue-200 hover:bg-blue-50"
              >
                {isAdmin ? 'Exit Admin' : 'Back to Dashboard'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="prompts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="prompts" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Prompts
            </TabsTrigger>
            <TabsTrigger value="ideas" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Ideas
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prompts">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Prompts from CSV
                </CardTitle>
                <CardDescription>
                  Format: judul_konten, deskripsi_konten, required_permission_key, is_published
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <CSVTemplateDownload type="prompts" />
                  </div>
                  <div>
                    <Label htmlFor="prompts-csv" className="text-sm font-medium">CSV File</Label>
                    <Input
                      id="prompts-csv"
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleFileChange(e, 'prompts')}
                      disabled={uploading}
                      className="mt-2 border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  {uploading && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                      Uploading and processing file...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ideas">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Product Ideas from CSV
                </CardTitle>
                <CardDescription>
                  Format: judul_konten, deskripsi_konten, required_permission_key, is_published
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <CSVTemplateDownload type="ideas" />
                  </div>
                  <div>
                    <Label htmlFor="ideas-csv" className="text-sm font-medium">CSV File</Label>
                    <Input
                      id="ideas-csv"
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleFileChange(e, 'ide_produk')}
                      disabled={uploading}
                      className="mt-2 border-green-200 focus:border-green-400"
                    />
                  </div>
                  {uploading && (
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                      Uploading and processing file...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Upload Digital Products
                </CardTitle>
                <CardDescription>
                  This feature will be available soon for managing digital products
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-500">
                    Digital product upload functionality will be added later
                  </div>
                  <CSVTemplateDownload type="products" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPage;
