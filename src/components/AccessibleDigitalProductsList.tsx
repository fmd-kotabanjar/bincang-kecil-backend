
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
      const { data, error } = await supabase
        .from('digital_products_links')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Failed to load products",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No digital products available with your current permissions
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Digital Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ContentCard
            key={product.id}
            title={product.nama_produk}
            description="Click to access this digital product"
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
