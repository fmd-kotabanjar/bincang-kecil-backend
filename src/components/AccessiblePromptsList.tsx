
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ContentCard from './ContentCard';
import { useToast } from '@/hooks/use-toast';

interface Prompt {
  id: number;
  judul_konten: string;
  deskripsi_konten: string;
  required_permission_key: string;
}

const AccessiblePromptsList: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrompts(data || []);
    } catch (error: any) {
      toast({
        title: "Failed to load prompts",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading prompts...</div>;
  }

  if (prompts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No prompts available with your current permissions
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Available Prompts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt) => (
          <ContentCard
            key={prompt.id}
            title={prompt.judul_konten}
            description={prompt.deskripsi_konten}
            metadata={prompt.required_permission_key}
            type="prompt"
          />
        ))}
      </div>
    </div>
  );
};

export default AccessiblePromptsList;
