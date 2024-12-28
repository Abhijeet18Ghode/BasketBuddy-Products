"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { SubnavbarSkeleton } from "./SubNavbarSkeleton.jsx";
const Subnavbar = () => {
  const pathname = usePathname();
  const layout = ["/", ""]; // Add more paths if you want it to show on other pages
  const isHomePage =
    layout.includes(pathname) || pathname.startsWith("/category/");
  const { category } = useParams();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null); // Store hovered category
  const [loading, setLoading] = useState(true);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (!isHomePage) {
    return null;
  }

  return (
    <div className="flex items-center justify-evenly pt-2 pb-2 pl-7 pr-7 w-full text-slate-400 overflow-x-scroll scrollbar-none phone:gap-10 phone:w-auto phone:justify-start">
      <AnimatePresence mode="wait">
        {loading ? (
          <div>Loading...</div>
        ) : (
          // <div className="grid grid-cols-4 gap-6 p-5 phone:grid-cols-2 phone:gap-0 phone:p-3">
          //   {Array.from({ length: 8 }).map((_, index) => (
          //     <SubnavbarSkeleton key={index} />
          //   ))}
          // </div>
          categories?.map((cat) => (
            <Link
              href={`/category/${cat?.name?.toLowerCase()}`}
              key={cat.name}
              className="flex flex-col items-center"
              // onMouseEnter={() => setHoveredCategory(cat)} // Show subcategories on hover
              // onMouseLeave={() => setHoveredCategory(null)} // Hide subcategories on mouse leave
            >
              <motion.button
                // onClick={() => router.push(`/category/${cat.name.toLowerCase()}`)}
                className="flex flex-col items-center gap-2 max-w-fit transition-all ease-in-out duration-300"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.1 }}
              >
                <Image
                  src={`${cat?.image}`}
                  width={200}
                  height={200}
                  className="w-14 h-14 object-contain bg-cover desktop:w-12 desktop:h-12 phone:w-10 phone:h-10"
                />
                <h1 className="desktop:text-sm phone:text-xs">{cat.name}</h1>
              </motion.button>

              {/* Display subcategories if this category is hovered */}
              {hoveredCategory?.name === cat.name && (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-1 mt-2 bg-white p-2 rounded-md shadow-md z-50"
                >
                  {cat.subcategories.map((subcategory) => (
                    <motion.span
                      key={subcategory.name}
                      className="cursor-pointer text-blue-600 hover:underline"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      onClick={() =>
                        router.push(
                          `/category/${cat.name.toLowerCase()}/${subcategory.name
                            .toLowerCase()
                            .replace(/ /g, "-")}`
                        )
                      }
                    >
                      {subcategory.name}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </Link>
          ))
        )}
      </AnimatePresence>
    </div>
  );
};

export default Subnavbar;
