
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

const Dashboard: React.FC = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold">BincangKecil Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {profile?.username}</p>
            </div>
            <div className="flex items-center space-x-4">
              {profile?.role === 'admin' && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin')}
                >
                  Admin Panel
                </Button>
              )}
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <RedeemCodeForm />
          <UserPermissionsDisplay />
          <PromptRequestForm />
        </div>

        <Tabs defaultValue="prompts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
            <TabsTrigger value="ideas">Product Ideas</TabsTrigger>
            <TabsTrigger value="products">Digital Products</TabsTrigger>
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
      </main>
    </div>
  );
};

export default Dashboard;
