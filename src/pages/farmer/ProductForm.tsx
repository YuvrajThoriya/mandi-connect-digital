
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getCategories } from '@/utils/supabaseUtils';

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  image_url: string;
  quality: string;
  location: string;
  unit: string;
}

export const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    quantity: 0,
    price: 0,
    image_url: '',
    quality: 'Standard',
    location: '',
    unit: 'kg'
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    const cats = await getCategories();
    setCategories(cats || ['Fruits', 'Vegetables', 'Grains', 'Dairy', 'Other']);
  };

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setFormData(data as unknown as ProductFormData);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!profile?.id) {
        throw new Error('User not authenticated');
      }
      
      if (id) {
        const { error } = await supabase
          .from('products')
          .update({
            name: formData.name,
            description: formData.description,
            category: formData.category,
            quantity: formData.quantity,
            price: formData.price,
            image_url: formData.image_url,
            quality: formData.quality,
            location: formData.location,
            unit: formData.unit
          })
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([{
            farmer_id: profile.id,
            farmer_name: profile.name || 'Unknown farmer',
            name: formData.name,
            description: formData.description,
            category: formData.category,
            quantity: formData.quantity,
            price: formData.price,
            image_url: formData.image_url,
            quality: formData.quality,
            location: formData.location,
            unit: formData.unit,
            status: 'active'
          }]);

        if (error) throw error;
      }

      navigate('/farmer/products');
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value,
    }));
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar userRole="farmer" />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">
          {id ? 'Edit Product' : 'Add New Product'}
        </h1>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="unit">Unit</Label>
            <Select
              value={formData.unit}
              onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilogram (kg)</SelectItem>
                <SelectItem value="g">Gram (g)</SelectItem>
                <SelectItem value="lb">Pound (lb)</SelectItem>
                <SelectItem value="ton">Ton</SelectItem>
                <SelectItem value="piece">Piece</SelectItem>
                <SelectItem value="dozen">Dozen</SelectItem>
                <SelectItem value="crate">Crate</SelectItem>
                <SelectItem value="box">Box</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Price per {formData.unit}</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="quality">Quality</Label>
            <Select
              value={formData.quality}
              onValueChange={(value) => setFormData(prev => ({ ...prev, quality: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Economy">Economy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="http://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/farmer/products')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};
