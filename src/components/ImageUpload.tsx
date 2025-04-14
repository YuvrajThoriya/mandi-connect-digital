
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onChange: (imageUrl: string) => void;
  value?: string;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value, label = "Product Image" }) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create a local preview URL
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      
      // In a real implementation, we would upload the file to a storage service like Supabase
      // For now, we'll just simulate a successful upload
      setTimeout(() => {
        setIsUploading(false);
        onChange(localUrl);
        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully"
        });
      }, 1500);

      // Mock implementation until storage is set up
      // const { data, error } = await supabase.storage
      //   .from('product-images')
      //   .upload(`${Date.now()}-${file.name}`, file);
      
      // if (error) throw error;
      // 
      // const imageUrl = supabase.storage
      //   .from('product-images')
      //   .getPublicUrl(data.path).data.publicUrl;
      //
      // setPreviewUrl(imageUrl);
      // onChange(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onChange('');
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload">{label}</Label>
      
      {previewUrl ? (
        <div className="relative rounded-md overflow-hidden border border-gray-200">
          <img 
            src={previewUrl} 
            alt="Product preview" 
            className="w-full h-48 object-cover"
          />
          <Button 
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-gray-200 rounded-md p-6 flex flex-col items-center justify-center h-48 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer"
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
          <div className="text-sm text-muted-foreground text-center">
            <span className="font-medium">Click to upload</span> or drag and drop
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            SVG, PNG, JPG or GIF (max. 5MB)
          </p>
          {isUploading && (
            <div className="mt-2 flex items-center">
              <div className="animate-spin h-4 w-4 border-t-2 border-primary rounded-full mr-2" />
              <span className="text-xs">Uploading...</span>
            </div>
          )}
        </div>
      )}
      
      <input 
        id="image-upload"
        type="file" 
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
