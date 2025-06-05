
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
import { FileText, Lightbulb, Package, LogOut, Shield } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-green-600">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Dashboard AI Kit
                </h1>
                <p className="text-sm text-gray-600">Selamat datang, {profile?.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {profile?.role === 'admin' && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 border-green-200 hover:bg-green-50"
                >
                  <Shield className="w-4 h-4" />
                  Panel Admin
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="flex items-center gap-2 border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="animate-fade-in">
            <RedeemCodeForm />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <UserPermissionsDisplay />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <PromptRequestForm />
          </div>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Tabs defaultValue="prompts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="prompts" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Prompt
              </TabsTrigger>
              <TabsTrigger value="ideas" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Ide Produk
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Produk Digital
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="prompts">
              <AccessiblePromptsList />
            </TabsContent>
            
            <TabsContent value="ideas">
              <AccessibleIdeasList />
            </TabsContent>
            
            <TabsContent value="products">
              <AccessibleDigitalProductsList />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
