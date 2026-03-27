import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { setProducts } from '@/redux/productSlice';
import ImageUpload from '@/components/ImageUpload';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const AdminProduct = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(false);

  const accessToken = localStorage.getItem("accesstoken");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/product/getallproducts`);
      if (res.data.success) {
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", editProduct.productName);
    formData.append("productDesc", editProduct.productDesc);
    formData.append("productPrice", editProduct.productPrice);
    formData.append("category", editProduct.category);
    formData.append("brand", editProduct.brand);

    const existingImages = editProduct.productImg
      ?.filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id) || [];
    
    formData.append("existingImages", JSON.stringify(existingImages));

    editProduct.productImg
      ?.filter((img) => img instanceof File)
      .forEach((file) => formData.append("files", file));

    try {
      const res = await axios.put(`${import.meta.env.VITE_URL}/api/v1/product/update/${editProduct._id}`, formData, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data" 
        },
      });

      if (res.data.success) {
        toast.success("Product updated successfully");
        fetchProducts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await axios.delete(`${import.meta.env.VITE_URL}/api/v1/product/delete/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.data.success) {
        toast.success("Deleted successfully");
        fetchProducts();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const filteredProducts = products
    ?.filter(p => p.productName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "lowToHigh") return a.productPrice - b.productPrice;
      if (sortBy === "highToLow") return b.productPrice - a.productPrice;
      return 0;
    });

  return (
    <div className='flex-1 p-8 flex flex-col gap-6 min-h-screen bg-gray-50'>
      <div className='flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
        <div className='relative'>
          <Input 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[400px] pl-10 focus:ring-orange-500 border-gray-200 bg-white" 
          />
          <Search className='absolute left-3 top-2.5 text-gray-400 w-5 h-5' />
        </div>

        <Select onValueChange={(value) => setSortBy(value)}>
          <SelectTrigger className="w-[200px] border-gray-200 bg-white">
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
            <SelectItem value="highToLow">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='flex flex-col gap-3'>
        {loading ? (
          <p className="text-center py-10 text-gray-500 font-medium">Loading products...</p>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product._id} className="p-4 hover:shadow-md transition-shadow border-gray-100 bg-white">
              <div className='flex items-center justify-between'>
                <div className='flex gap-5 items-center'>
                  <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center">
                    <img 
                      src={product.productImg?.[0]?.url || 'https://via.placeholder.com/150'} 
                      alt="" 
                      className='max-w-full max-h-full object-contain' 
                    />
                  </div>
                  <div>
                    <h1 className='font-bold text-gray-800 text-base uppercase leading-tight'>{product.productName}</h1>
                    <p className='text-xs text-gray-400 font-medium mt-1'>{product.brand} • {product.category}</p>
                  </div>
                </div>

                <div className='flex items-center gap-8'>
                  <h1 className='font-bold text-orange-600 text-xl'>₹{product.productPrice}</h1>
                  <div className='flex gap-2'>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setEditProduct(product)}
                          className="text-emerald-600 hover:bg-emerald-50 h-9 w-9 border border-emerald-100"
                        >
                          <Edit size={18} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto bg-white p-0 border-none shadow-2xl">
                        <DialogHeader className="p-6 bg-gray-50 border-b">
                          <DialogTitle className="text-xl font-bold text-gray-800">Edit Product</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSave} className="p-6 space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label className="text-xs font-semibold uppercase text-gray-500">Product Name</Label>
                              <Input 
                                name="productName" 
                                value={editProduct?.productName || ""} 
                                onChange={handleChange} 
                                className="bg-white border-gray-200"
                                required 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-semibold uppercase text-gray-500">Price (₹)</Label>
                              <Input 
                                type="number" 
                                name="productPrice" 
                                value={editProduct?.productPrice || ""} 
                                onChange={handleChange} 
                                className="bg-white border-gray-200"
                                required 
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label className="text-xs font-semibold uppercase text-gray-500">Brand</Label>
                              <Input name="brand" value={editProduct?.brand || ""} onChange={handleChange} className="bg-white border-gray-200" required />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-semibold uppercase text-gray-500">Category</Label>
                              <Input name="category" value={editProduct?.category || ""} onChange={handleChange} className="bg-white border-gray-200" required />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase text-gray-500">Description</Label>
                            <Textarea 
                              name="productDesc" 
                              value={editProduct?.productDesc || ""} 
                              onChange={handleChange} 
                              className="min-h-[150px] bg-white border-gray-200 leading-relaxed" 
                            />
                          </div>
                          <div className="pt-2 border-t border-dashed">
                             <ImageUpload productData={editProduct} setProductData={setEditProduct} />
                          </div>
                          <DialogFooter className="pt-6 border-t flex gap-3">
                            <DialogClose asChild>
                              <Button variant="outline" className="border-gray-300 text-gray-600">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8">Save Changes</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500 hover:bg-red-50 h-9 w-9 border border-red-100"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 text-gray-400 italic bg-white rounded-xl border border-dashed border-gray-200">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProduct;