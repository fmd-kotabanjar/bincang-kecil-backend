
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const RedeemCodeForm: React.FC = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { refreshPermissions } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('redeem-access-code', {
        body: { accessCode: code.trim() }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Code redeemed successfully!",
          description: "Your permissions have been updated."
        });
        setCode('');
        await refreshPermissions();
      } else {
        throw new Error(data.error || 'Failed to redeem code');
      }
    } catch (error: any) {
      toast({
        title: "Failed to redeem code",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Redeem Access Code</CardTitle>
        <CardDescription>
          Enter your access code to unlock premium content and features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="code">Access Code</Label>
            <Input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter your access code"
              className="mt-1"
            />
          </div>
          <Button type="submit" disabled={loading || !code.trim()}>
            {loading ? 'Redeeming...' : 'Redeem Code'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RedeemCodeForm;
