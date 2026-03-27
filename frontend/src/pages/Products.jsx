import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../redux/productSlice";

import FilterSidebar from "@/components/ui/FilterSidebar";
import ProductCard from "@/components/ui/ProductCard";



const Products = () => {
  const dispatch = useDispatch();

  const products = useSelector((store) => store.product?.products || []);

  const [loading, setLoading] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 999999]);

  const getAllProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/product/getallproducts`
      );

      if (res.data.success) {
        dispatch(setProducts(res.data.products));
      } else {
        toast.error("Failed to load products");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Server error while loading products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    if (!products) return;

    const filtered = products.filter((p) => {
      const matchesSearch = p.productName
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || p.category === category;

      const matchesBrand =
        brand === "All" || p.brand === brand;

      const matchesPrice =
        p.productPrice >= priceRange[0] &&
        p.productPrice <= priceRange[1];

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesPrice
      );
    });

    setFilterProducts(filtered);

  }, [products, search, category, brand, priceRange]);

  const handleSort = (value) => {
    const sorted = [...filterProducts];

    if (value === "lowToHigh") {
      sorted.sort((a, b) => a.productPrice - b.productPrice);
    }

    if (value === "highToLow") {
      sorted.sort((a, b) => b.productPrice - a.productPrice);
    }

    setFilterProducts(sorted);
  };

  return (
    <div className="pt-20 pb-10 px-4">

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-7">

        <FilterSidebar
          search={search}
          setSearch={setSearch}
          brand={brand}
          setBrand={setBrand}
          category={category}
          setCategory={setCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          allProducts={products}
        />

        <div className="flex-1">

          <div className="flex justify-end mb-4">

            <select
              onChange={(e) => handleSort(e.target.value)}
              className="w-[200px] h-9 px-3 text-sm border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 cursor-pointer"
            >
              <option value="">Sort by Price</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

            {loading ? (

              <p className="col-span-full text-center">
                Loading...
              </p>

            ) : filterProducts.length > 0 ? (

              filterProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))

            ) : (

              <p className="col-span-full text-center text-gray-500">
                No products found
              </p>

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Products;