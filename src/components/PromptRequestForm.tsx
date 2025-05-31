
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const PromptRequestForm: React.FC = () => {
  const [requestText, setRequestText] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('submit-prompt-request', {
        body: { requestText: requestText.trim() }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Request submitted successfully!",
          description: "We'll review your request and get back to you soon."
        });
        setRequestText('');
      } else {
        throw new Error(data.error || 'Failed to submit request');
      }
    } catch (error: any) {
      toast({
        title: "Failed to submit request",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = profile && profile.request_prompt_quota > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Custom Prompt</CardTitle>
        <CardDescription>
          {canSubmit 
            ? `Submit a request for a custom prompt (Quota: ${profile?.request_prompt_quota})`
            : "You need request quota to submit custom prompt requests"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="request">Request Details</Label>
            <Textarea
              id="request"
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              placeholder="Describe the type of prompt you need..."
              className="mt-1 min-h-[100px]"
              disabled={!canSubmit}
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading || !requestText.trim() || !canSubmit}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PromptRequestForm;
