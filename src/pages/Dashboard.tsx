
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import RedeemCodeForm from '@/components/RedeemCodeForm';
import UserPermissionsDisplay from '@/components/UserPermissionsDisplay';
import AccessiblePromptsList from '@/components/AccessiblePromptsList';
import AccessibleIdeasList from '@/components/AccessibleIdeasList';
import AccessibleDigitalProductsList from '@/components/AccessibleDigitalProductsList';
import PromptRequestForm from '@/components/PromptRequestForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Lightbulb, Package, LogOut, Shield, User, Menu, Search, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard: React.FC = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Google-style Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-xl font-normal text-gray-900">AI Kit</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-700">
                <User className="w-4 h-4" />
                <span>{profile?.username}</span>
              </div>
              
              {profile?.role === 'admin' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin')}
                  className="hidden md:flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Keluar</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-normal text-gray-900 mb-2">
            Selamat datang, {profile?.username}
          </h1>
          <p className="text-gray-600">
            Kelola konten AI premium dan akses sumber daya eksklusif Anda
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Tukar Kode Akses
              </CardTitle>
              <CardDescription className="text-gray-600">
                Masukkan kode untuk mengakses konten premium
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RedeemCodeForm />
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Izin Akses
              </CardTitle>
              <CardDescription className="text-gray-600">
                Lihat status dan level akses Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserPermissionsDisplay />
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                Permintaan Khusus
              </CardTitle>
              <CardDescription className="text-gray-600">
                Minta prompt atau konten yang disesuaikan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PromptRequestForm />
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-xl font-medium text-gray-900">
              Konten Premium Anda
            </CardTitle>
            <CardDescription className="text-gray-600">
              Jelajahi koleksi prompt AI, ide produk, dan sumber daya digital
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="prompts" className="w-full">
              <TabsList className="w-full justify-start border-b border-gray-200 bg-white rounded-none h-auto p-0">
                <TabsTrigger 
                  value="prompts" 
                  className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white rounded-none"
                >
                  <FileText className="w-4 h-4" />
                  Prompt AI
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
                  Produk Digital
                </TabsTrigger>
              </TabsList>
              
              <div className="p-6">
                <TabsContent value="prompts" className="mt-0">
                  <AccessiblePromptsList />
                </TabsContent>
                
                <TabsContent value="ideas" className="mt-0">
                  <AccessibleIdeasList />
                </TabsContent>
                
                <TabsContent value="products" className="mt-0">
                  <AccessibleDigitalProductsList />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
