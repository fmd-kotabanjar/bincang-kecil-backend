
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ContentCard from './ContentCard';
import { useToast } from '@/hooks/use-toast';

interface DigitalProduct {
  id: number;
  nama_produk: string;
  link_produk: string;
  required_permission_key: string;
}

const AccessibleDigitalProductsList: React.FC = () => {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching digital products...');
      const { data, error } = await supabase
        .from('digital_products_links')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      console.log('Products fetched successfully:', data?.length || 0, 'items');
      setProducts(data || []);
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
      toast({
        title: "Gagal memuat produk digital",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Memuat produk digital...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Belum ada produk digital yang tersedia
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Produk Digital</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ContentCard
            key={product.id}
            title={product.nama_produk}
            description="Klik untuk mengakses produk digital ini"
            metadata={product.required_permission_key}
            type="product"
            link={product.link_produk}
          />
        ))}
      </div>
    </div>
  );
};

export default AccessibleDigitalProductsList;
