"use client";
import React, { useState, useContext, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaCheckSquare, FaRegSquare } from "react-icons/fa";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { usePathname } from "next/navigation";
import { ProductContext } from "../provider/ProductContext";

const FilterSection = () => {
  const pathname = usePathname();
  const layout = ["/", ""]; 
  const isFilterSectionPage = layout.includes(pathname) || pathname.startsWith("/category");

  const [isCategoryOpen, setCategoryOpen] = useState(true);
  const [isBrandOpen, setBrandOpen] = useState(true);
  const [isPriceOpen, setPriceOpen] = useState(true);
  const [isRatingOpen, setRatingOpen] = useState(true);

  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false);

  const { products, setProducts, filteredProducts, setFilteredProducts } = useContext(ProductContext);

  const categories = ["Electronics", "Fashion", "Home & Kitchen", "Books", "Health", "Sports", "Beauty"];
  const brands = ["Samsung", "Apple", "Nike", "Sony", "Adidas", "HP", "LG", "OnePlus"];

  const availableBrands = useMemo(() => {
    if (selectedCategories.length === 0) {
      return brands;
    } else {
      const filtered = products.filter((product) =>
        selectedCategories.includes(product.category)
      );
      return Array.from(new Set(filtered.map((product) => product.brand)));
    }
  }, [selectedCategories, products]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
    setFiltersApplied(true);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setFiltersApplied(true);
  };

  const handleRatingChange = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
    setFiltersApplied(true);
  };

  const handlePriceChange = (newPriceRange) => {
    setPriceRange(newPriceRange);
    setFiltersApplied(true);
  };

  const applyFilters = () => {
    let filtered = filteredProducts;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => selectedCategories.includes(product.category));
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) => selectedBrands.includes(product.brand));
    }

    if (priceRange.length === 2) {
      filtered = filtered.filter(
        (product) => product.discountPrice >= priceRange[0] && product.discountPrice <= priceRange[1]
      );
    }

    if (selectedRatings.length > 0) {
      filtered = filtered.filter((product) =>
        selectedRatings.includes(Math.floor(product.reviews.rating))
      );
    }

    setProducts(filtered);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedRatings([]);
    setPriceRange([0, 100000]);
    setFiltersApplied(false);
    setProducts(products);
  };

  useEffect(() => {
    if (filtersApplied) {
      applyFilters();
    }
  }, [selectedCategories, selectedBrands, priceRange, selectedRatings, filtersApplied]);

  useEffect(() => {
    setSelectedBrands((prevBrands) => prevBrands.filter((brand) => availableBrands.includes(brand)));
  }, [availableBrands]);

  if (!isFilterSectionPage) {
    return null;
  }

  return (
    <div className="w-1/6 md:w-1/4 p-4 bg-white shadow-md rounded-lg desktop:text-sm sticky top-16 phone:hidden">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Filters</h2>

      {/* Category Filter */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer p-2 bg-gray-100 rounded-lg"
          onClick={() => setCategoryOpen(!isCategoryOpen)}
        >
          <h3 className="font-semibold text-lg">Categories</h3>
          {isCategoryOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isCategoryOpen ? "auto" : 0, opacity: isCategoryOpen ? 1 : 0 }}
          className="overflow-hidden p-2"
        >
          {categories.map((category, idx) => (
            <div key={idx} className="flex items-center mt-2">
              <div
                className="cursor-pointer"
                onClick={() => handleCategoryChange(category)}
              >
                {selectedCategories.includes(category) ? (
                  <FaCheckSquare className="text-blue-500" />
                ) : (
                  <FaRegSquare className="text-gray-400" />
                )}
              </div>
              <label className="ml-2 text-gray-700">{category}</label>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer p-2 bg-gray-100 rounded-lg"
          onClick={() => setBrandOpen(!isBrandOpen)}
        >
          <h3 className="font-semibold text-lg">Brands</h3>
          {isBrandOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isBrandOpen ? "auto" : 0, opacity: isBrandOpen ? 1 : 0 }}
          className="overflow-hidden p-2"
        >
          {availableBrands.length > 0 ? (
            availableBrands.map((brand, idx) => (
              <div key={idx} className="flex items-center mt-2">
                <div
                  className="cursor-pointer"
                  onClick={() => handleBrandChange(brand)}
                >
                  {selectedBrands.includes(brand) ? (
                    <FaCheckSquare className="text-blue-500" />
                  ) : (
                    <FaRegSquare className="text-gray-400" />
                  )}
                </div>
                <label className="ml-2 text-gray-700">{brand}</label>
              </div>
            ))
          ) : (
            <p className="mt-2 text-gray-500">No brands available.</p>
          )}
        </motion.div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer p-2 bg-gray-100 rounded-lg"
          onClick={() => setPriceOpen(!isPriceOpen)}
        >
          <h3 className="font-semibold text-lg">Price</h3>
          {isPriceOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isPriceOpen ? "auto" : 0, opacity: isPriceOpen ? 1 : 0 }}
          className="overflow-hidden p-2"
        >
          <div className="mt-2">
            <Slider
              range
              min={0}
              max={100000}
              value={priceRange}
              onChange={handlePriceChange}
              trackStyle={{ backgroundColor: "#007bff" }}
              handleStyle={{ borderColor: "#007bff" }}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer p-2 bg-gray-100 rounded-lg"
          onClick={() => setRatingOpen(!isRatingOpen)}
        >
          <h3 className="font-semibold text-lg">Rating</h3>
          {isRatingOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isRatingOpen ? "auto" : 0, opacity: isRatingOpen ? 1 : 0 }}
          className="overflow-hidden p-2"
        >
          {[1, 2, 3, 4, 5].map((rating, idx) => (
            <div key={idx} className="flex items-center mt-2">
              <div
                className="cursor-pointer"
                onClick={() => handleRatingChange(rating)}
              >
                {selectedRatings.includes(rating) ? (
                  <FaCheckSquare className="text-blue-500" />
                ) : (
                  <FaRegSquare className="text-gray-400" />
                )}
              </div>
              <label className="ml-2 text-gray-700">{rating} Star</label>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Reset Filters */}
      <div className="text-center">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSection;
