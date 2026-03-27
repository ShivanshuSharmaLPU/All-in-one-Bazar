import React from 'react';
import { Input } from "./input";
import { Button } from "./button";

const FilterSidebar = ({ 
    allProducts, 
    search, setSearch, 
    category, setCategory, 
    brand, setBrand, 
    priceRange, setPriceRange 
}) => {
    const uniqueCategories = ["All", ...new Set(allProducts.map(p => p.category))];
    const uniqueBrands = ["All", ...new Set(allProducts.map(p => p.brand))];

    const resetFilters = () => {
        setSearch("");
        setCategory("All");
        setBrand("All");
        setPriceRange([0, 999999]);
    };

    return (
        <div className='bg-gray-50 p-4 rounded-lg border h-max hidden md:block w-64'>
            <h1 className='font-semibold text-lg mb-2'>Search</h1>
            <Input 
                type="text" 
                placeholder="Search products..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white"
            />
            <h1 className='mt-6 font-semibold text-lg'>Category</h1>
            <div className='flex flex-col gap-2 mt-2'>
                {uniqueCategories.map((item, index) => (
                    <div key={index} className='flex items-center gap-2'>
                        <input 
                            type="radio" 
                            id={`cat-${index}`}
                            name="category"
                            checked={category === item}
                            onChange={() => setCategory(item)}
                        />
                        <label htmlFor={`cat-${index}`} className="text-sm cursor-pointer">{item}</label>
                    </div>
                ))}
            </div>
            <h1 className='mt-6 font-semibold text-lg'>Brand</h1>
            <select 
                className='bg-white w-full p-2 border rounded-md mt-2 text-sm'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
            >
                {uniqueBrands.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                ))}
            </select>
            <h1 className='mt-6 font-semibold text-lg mb-2'>Price Range</h1>
            <div className='flex flex-col gap-3'>
                <label className="text-sm text-gray-600">
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <input 
                    type="range" 
                    min="0" 
                    max="999999" 
                    step="1000" 
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className='w-full cursor-pointer' 
                />
            </div>
            <Button 
                onClick={resetFilters}
                className="bg-pink-600 hover:bg-pink-700 text-white mt-8 w-full"
            >
                Reset Filters
            </Button>
        </div>
    );
};

export default FilterSidebar;