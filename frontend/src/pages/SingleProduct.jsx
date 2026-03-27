import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import Breadcrums from '@/components/Breadcrums'
import ProductImg from '@/components/ProductImg'
import ProductDesc from '@/components/ProductDesc'
import { setProducts } from '../redux/productSlice'

const SingleProduct = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { products } = useSelector((store) => store.product)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try to find product from Redux store first
    const found = products.find((item) => item._id === id)
    if (found) {
      setProduct(found)
      setLoading(false)
    } else {
      // If not found in Redux (refresh case), fetch from backend
      const fetchProduct = async () => {
        try {
          setLoading(true)
          const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/product/${id}`)
          if (res.data.success) {
            setProduct(res.data.product)
            // Optionally, add to Redux store
            dispatch(setProducts([...products, res.data.product]))
          } else {
            toast.error(res.data.message || 'Product not found')
          }
        } catch (error) {
          console.log(error)
          toast.error(error.response?.data?.message || 'Failed to load product')
        } finally {
          setLoading(false)
        }
      }
      fetchProduct()
    }
  }, [id, products, dispatch])

  if (loading) {
    return <div className="pt-20 text-center">Loading product...</div>
  }

  if (!product) {
    return <div className="pt-20 text-center">Product not found</div>
  }

  return (
    <div className="pt-28 pb-10 max-w-7xl mx-auto px-4">
      <Breadcrums product={product} />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <ProductImg images={product?.productImg} />
        <ProductDesc product={product} />
      </div>
    </div>
  )
}

export default SingleProduct