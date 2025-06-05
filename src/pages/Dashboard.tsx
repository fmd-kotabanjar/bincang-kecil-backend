
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
import { FileText, Lightbulb, Package, LogOut, Shield, Sparkles, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard: React.FC = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Header dengan desain modern */}
      <header className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-blue-100/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  AI Kit Dashboard
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Selamat datang, {profile?.username}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {profile?.role === 'admin' && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 border-green-200 hover:bg-green-50 bg-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Shield className="w-4 h-4" />
                  Panel Admin
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="flex items-center gap-2 border-red-200 hover:bg-red-50 hover:text-red-600 bg-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Welcome Card */}
        <Card className="mb-10 bg-gradient-to-r from-blue-600 to-green-600 text-white border-0 shadow-2xl">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold mb-2">Hai, {profile?.username}! 👋</CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  Siap untuk mengeksplorasi konten AI premium hari ini?
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="animate-fade-in">
            <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-t-lg">
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Tukar Kode Akses
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <RedeemCodeForm />
              </CardContent>
            </Card>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="bg-gradient-to-br from-green-50 to-green-100 rounded-t-lg">
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Izin Akses Anda
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <UserPermissionsDisplay />
              </CardContent>
            </Card>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-t-lg">
                <CardTitle className="text-purple-800 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Minta Prompt Khusus
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <PromptRequestForm />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b">
              <CardTitle className="text-2xl text-gray-800 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-blue-600" />
                Konten Premium Anda
              </CardTitle>
              <CardDescription className="text-gray-600">
                Jelajahi koleksi lengkap prompt AI, ide produk, dan sumber daya digital
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Tabs defaultValue="prompts" className="space-y-8">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100/80 backdrop-blur-sm h-14 rounded-xl p-2">
                  <TabsTrigger 
                    value="prompts" 
                    className="flex items-center gap-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg font-medium text-sm px-6 py-3"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Prompt AI</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ideas" 
                    className="flex items-center gap-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg font-medium text-sm px-6 py-3"
                  >
                    <Lightbulb className="w-5 h-5" />
                    <span>Ide Produk</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="products" 
                    className="flex items-center gap-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg font-medium text-sm px-6 py-3"
                  >
                    <Package className="w-5 h-5" />
                    <span>Produk Digital</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="prompts" className="mt-8">
                  <AccessiblePromptsList />
                </TabsContent>
                
                <TabsContent value="ideas" className="mt-8">
                  <AccessibleIdeasList />
                </TabsContent>
                
                <TabsContent value="products" className="mt-8">
                  <AccessibleDigitalProductsList />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
