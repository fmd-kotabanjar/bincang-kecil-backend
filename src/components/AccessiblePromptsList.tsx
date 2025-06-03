
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
      console.log('Fetching prompts...');
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching prompts:', error);
        throw error;
      }

      console.log('Prompts fetched successfully:', data?.length || 0, 'items');
      setPrompts(data || []);
    } catch (error: any) {
      console.error('Failed to fetch prompts:', error);
      toast({
        title: "Gagal memuat prompt",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Memuat prompt...</div>;
  }

  if (prompts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Belum ada prompt yang tersedia
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Prompt yang Tersedia</h2>
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
