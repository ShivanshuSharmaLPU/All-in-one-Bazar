import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2, ChevronDown, Check } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { setProducts } from '@/redux/productSlice'

const CATEGORY_BRANDS = {
  "Electronics":            ["Sony", "LG", "Philips", "Samsung", "Boat", "Other"],
  "Mobile Phones":          ["Apple", "Samsung", "Xiaomi", "OnePlus", "Realme", "Vivo", "Oppo", "Other"],
  "Laptops & Computers":    ["HP", "Dell", "Lenovo", "Apple", "Asus", "Acer", "Microsoft", "Other"],
  "Fashion":                ["Nike", "Adidas", "Puma", "Zara", "H&M", "Levi's", "Other"],
  "Men's Clothing":         ["Nike", "Adidas", "Puma", "Levi's", "Arrow", "Allen Solly", "Other"],
  "Women's Clothing":       ["Zara", "H&M", "Libas", "Biba", "W", "Global Desi", "Other"],
  "Footwear":               ["Nike", "Adidas", "Puma", "Bata", "Woodland", "Red Tape", "Other"],
  "Home & Kitchen":         ["Philips", "Bajaj", "Prestige", "Hawkins", "Milton", "Other"],
  "Furniture":              ["Ikea", "Godrej", "Durian", "Pepperfry", "Urban Ladder", "Other"],
  "Sports & Fitness":       ["Nike", "Adidas", "Puma", "Decathlon", "Cosco", "Other"],
  "Beauty & Personal Care": ["Lakme", "Maybelline", "L'Oreal", "Dove", "Nivea", "Himalaya", "Other"],
  "Books":                  ["Penguin", "HarperCollins", "Oxford", "Scholastic", "Other"],
  "Toys & Games":           ["Lego", "Hasbro", "Mattel", "Fisher-Price", "Hot Wheels", "Other"],
  "Grocery":                ["Amul", "Haldirams", "Nestle", "ITC", "Britannia", "Patanjali", "Other"],
  "Automotive":             ["Bosch", "3M", "Michelin", "Castrol", "Vega", "Other"],
  "Other":                  ["Other"],
}

const CATEGORIES = Object.keys(CATEGORY_BRANDS)

const CustomDropdown = ({ options, value, onChange, placeholder, disabled }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()))

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => { setOpen(o => !o); setSearch("") }}
        className={`w-full flex items-center justify-between px-3 h-9 rounded-md border text-sm transition-all
          ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-100" :
            open ? "border-orange-400 ring-2 ring-orange-100 bg-white" :
            "border-gray-200 hover:border-orange-300 bg-white"}
          text-left`}
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {disabled ? "Select category first" : value || placeholder}
        </span>
        <ChevronDown size={15} className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              autoFocus
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-2 py-1.5 text-xs rounded-md border border-gray-200 focus:outline-none focus:border-orange-400 bg-gray-50"
            />
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-xs text-gray-400 text-center">No results</li>
            ) : filtered.map(opt => (
              <li
                key={opt}
                onClick={() => { onChange(opt); setOpen(false) }}
                className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors
                  ${value === opt ? "bg-orange-50 text-orange-600 font-semibold" : "hover:bg-gray-50 text-gray-700"}`}
              >
                {opt}
                {value === opt && <Check size={13} className="text-orange-500" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const AddProduct = () => {
  const accessToken = localStorage.getItem("accesstoken")
  const dispatch = useDispatch()
  const { products } = useSelector((state) => state.product) || { products: [] }

  const [loading, setLoading] = useState(false)
  const [customCategory, setCustomCategory] = useState("")
  const [customBrand, setCustomBrand] = useState("")
  const [productData, setProductData] = useState({
    productName: "", productPrice: "", productDesc: "",
    productImg: [], brand: "", category: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setProductData(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (val) => {
    setProductData(prev => ({ ...prev, category: val, brand: "" }))
    setCustomBrand("")
  }

  const availableBrands = productData.category ? CATEGORY_BRANDS[productData.category] || ["Other"] : []

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    const finalCategory = productData.category === "Other" ? customCategory : productData.category
    const finalBrand = productData.brand === "Other" ? customBrand : productData.brand

    if (!finalCategory || !finalBrand) {
      toast.error("Please select or enter category and brand")
      setLoading(false)
      return
    }
    if (productData.productImg.length === 0) {
      toast.error("Please select at least one image")
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("productName", productData.productName)
    formData.append("productPrice", productData.productPrice)
    formData.append("productDesc", productData.productDesc)
    formData.append("category", finalCategory)
    formData.append("brand", finalBrand)
    productData.productImg.forEach(img => formData.append("files", img))

    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/product/add`, formData, {
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "multipart/form-data" }
      })
      if (res.data.success) {
        dispatch(setProducts([...products, res.data.newProduct]))
        toast.success(res.data.message)
        setProductData({ productName: "", productPrice: "", productDesc: "", productImg: [], brand: "", category: "" })
        setCustomCategory("")
        setCustomBrand("")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-6 px-4'>
      <Card className='max-w-2xl w-full shadow-lg border-orange-100'>
        <CardHeader className="py-4 border-b">
          <CardTitle className="text-xl font-bold text-orange-600">Add Product</CardTitle>
          <CardDescription className="text-xs">Fill details below to list your item</CardDescription>
        </CardHeader>

        <CardContent className="py-5 flex flex-col gap-4">
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col gap-1.5'>
              <Label className="text-xs font-semibold text-gray-700">Product Name</Label>
              <Input name="productName" value={productData.productName} onChange={handleChange} placeholder="iPhone 15 Pro" className="h-9 text-sm" required />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label className="text-xs font-semibold text-gray-700">Price (₹)</Label>
              <Input type='number' name="productPrice" value={productData.productPrice} onChange={handleChange} placeholder="999" className="h-9 text-sm" required />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col gap-1.5'>
              <Label className="text-xs font-semibold text-gray-700">Category</Label>
              <CustomDropdown
                options={CATEGORIES}
                value={productData.category}
                onChange={handleCategoryChange}
                placeholder="Select category"
              />
              {productData.category === "Other" && (
                <Input placeholder="Enter custom category" value={customCategory} onChange={e => setCustomCategory(e.target.value)} className="h-9 text-sm mt-1" />
              )}
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label className="text-xs font-semibold text-gray-700">
                Brand
                {productData.category && (
                  <span className="ml-2 text-orange-500 font-normal">({productData.category})</span>
                )}
              </Label>
              <CustomDropdown
                options={availableBrands}
                value={productData.brand}
                onChange={val => setProductData(prev => ({ ...prev, brand: val }))}
                placeholder="Select brand"
                disabled={!productData.category}
              />
              {productData.brand === "Other" && (
                <Input placeholder="Enter custom brand" value={customBrand} onChange={e => setCustomBrand(e.target.value)} className="h-9 text-sm mt-1" />
              )}
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label className="text-xs font-semibold text-gray-700">Description</Label>
            <Textarea name="productDesc" value={productData.productDesc} onChange={handleChange} placeholder="Enter product details..." className="min-h-[80px] text-sm resize-none" required />
          </div>

          <div className="bg-orange-50/50 p-3 rounded-lg border border-dashed border-orange-200">
            <ImageUpload productData={productData} setProductData={setProductData} />
          </div>
        </CardContent>

        <CardFooter className="py-4 border-t">
          <Button disabled={loading} onClick={submitHandler} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-10">
            {loading ? <span className='flex gap-2 items-center text-sm'><Loader2 className='animate-spin w-4 h-4' />Saving...</span> : "Publish Product"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default AddProduct