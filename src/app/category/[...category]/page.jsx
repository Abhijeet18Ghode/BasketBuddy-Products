"use client"
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductContext } from "@/app/provider/ProductContext";
import Image from "next/image";
import { RiHeartLine, RiStarLine, RiStarFill } from "react-icons/ri";
import ProductCard from "@/app/components/ProductCard";
import { useSession } from "next-auth/react";
import { Toaster,toast } from "react-hot-toast";
import { UserContext } from "@/app/provider/UserContext";
import FilterSection from "@/app/components/FilterSection";
import NotFound from "../../animData/noReviews.json"
import Lottie from "lottie-react";
const Page = () => {
  const { data: session } = useSession();
  const { products } = useContext(ProductContext);
  const { category } = useParams();
  const [productData, setProductData] = useState([]);
  const totalReviews = productData?.reviews?.length;
  const averageRating = productData?.reviews?.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
  const { user, fetchUserData } = useContext(UserContext);
  useEffect(() => {
    if (products && category) {
      const decodedCategory = decodeURIComponent(category.toString()); // Decode the category
      const filteredProducts = products.filter(
        (product) => product?.category?.toLowerCase() === decodedCategory.toLowerCase()
      );
      setProductData(filteredProducts);
    }
  }, [products, category]);
  const toggleWishlist = async (productId) => {
    console.log(productId)
    if (!session?.user?.id) {
      alert("Please log in to manage your wishlist.");
      return;
    }

    const loadingToastId = toast.loading("Updating wishlist...");

    try {
      const response = await fetch("/api/wishlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          productId,
        }),
      });

      if (response.ok) {
        fetchUserData();
        toast.success("Wishlist updated successfully!", { id: loadingToastId });
      } else {
        toast.error("Failed to update wishlist.", { id: loadingToastId });
      }
    } catch (error) {
      console.error("Error managing wishlist:", error);
      toast.error("Something went wrong while managing your wishlist.", {
        id: loadingToastId,
      });
    }
  };
  return (
    <div className="w-full flex flex-col items-start  h-full">
      <Toaster/>
      
      <div className="p-5  w-full flex flex-col gap-3 phone:gap-2">
        <h1 className=" text-2xl font-bold phone:text-sm">Products in {decodeURIComponent(category).toUpperCase()} category</h1>
        <hr className="w-96 phone:w-64" />
      </div>
     <div className="w-full flex items-center justify-start h-full gap-4">
      <div className="w-full p-5 flex  items-center justify-start  gap-4 flex-wrap h-full phone:gap-0 phone:p-1">
        {productData.length > 0 ? (
          productData?.map((product) => (
              <ProductCard key={product._id} product={product} toggleWishlist={toggleWishlist} />

          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Lottie loop={true} animationData={NotFound} className="w-1/2 phone:w-full"/>
          </div>
        )}
      </div>
     </div>
    </div>
  );
};

export default Page;
