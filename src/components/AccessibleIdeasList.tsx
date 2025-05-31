
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ContentCard from './ContentCard';
import { useToast } from '@/hooks/use-toast';

interface Idea {
  id: number;
  judul_konten: string;
  deskripsi_konten: string;
  required_permission_key: string;
}

const AccessibleIdeasList: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('ide_produk')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIdeas(data || []);
    } catch (error: any) {
      toast({
        title: "Failed to load ideas",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading ideas...</div>;
  }

  if (ideas.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No ideas available with your current permissions
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Product Ideas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => (
          <ContentCard
            key={idea.id}
            title={idea.judul_konten}
            description={idea.deskripsi_konten}
            metadata={idea.required_permission_key}
            type="idea"
          />
        ))}
      </div>
    </div>
  );
};

export default AccessibleIdeasList;
