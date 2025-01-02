import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductGrid } from './ProductGrid';
import { ProductFilters } from './ProductFilters';
import { useAuth } from '@/context/AuthContext';
import { DigitalProduct } from '@/types/product';

export function ProductStore() {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts(activeTab);
  }, [activeTab]);

  const fetchProducts = async (type: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/products${type !== 'all' ? `?type=${type}` : ''}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="MANGA">Manga</TabsTrigger>
            <TabsTrigger value="COMIC">Comics</TabsTrigger>
            <TabsTrigger value="LIGHT_NOVEL">Light Novels</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ProductGrid products={products} />
          </TabsContent>
          <TabsContent value="MANGA">
            <ProductGrid products={products.filter(p => p.type === 'MANGA')} />
          </TabsContent>
          <TabsContent value="COMIC">
            <ProductGrid products={products.filter(p => p.type === 'COMIC')} />
          </TabsContent>
          <TabsContent value="LIGHT_NOVEL">
            <ProductGrid products={products.filter(p => p.type === 'LIGHT_NOVEL')} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}