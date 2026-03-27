import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X, UploadCloud } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ImageUpload = ({ productData, setProductData }) => {
  
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setProductData((prev) => ({
        ...prev,
        productImg: [...prev.productImg, ...files]
      }));
    }
  };

  const removeImage = (index) => {
    setProductData((prev) => ({
      ...prev,
      productImg: prev.productImg.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="grid gap-2">
      <Label className="text-xs font-semibold text-gray-700">Product Images</Label>
      
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-24 border-2 border-orange-200 border-dashed rounded-lg cursor-pointer bg-orange-50/30 hover:bg-orange-50 transition-all"
        >
          <div className="flex flex-col items-center justify-center py-2">
            <UploadCloud className="w-6 h-6 mb-1 text-orange-500" />
            <p className="text-xs text-orange-600 font-medium">Click to upload photos</p>
          </div>
          <Input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFiles}
          />
        </label>
      </div>

      {productData.productImg.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {productData.productImg.map((file, idx) => {
            let preview;
            if (file instanceof File) {
              preview = URL.createObjectURL(file);
            } else if (typeof file === 'string') {
              preview = file;
            } else if (file?.url) {
              preview = file.url;
            } else {
              return null;
            }

            return (
              <div key={idx} className="relative group w-16 h-16 border border-orange-100 rounded-md overflow-hidden">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-0 right-0 bg-orange-600 text-white p-0.5 rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;