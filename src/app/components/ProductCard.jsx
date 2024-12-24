// components/ProductCard.js
import Link from "next/link";
import Image from "next/image";
import { UserContext } from "../provider/UserContext";
import { useMemo, useContext } from "react";
import Button from "./CartButton";

import {
  RiHeartLine,
  RiHeartFill,
  RiStarLine,
  RiStarFill,
  RiStarHalfFill,
} from "react-icons/ri";

const ProductCard = ({ product, toggleWishlist }) => {
  const { user } = useContext(UserContext); // Ensure UserContext is available

  // Calculate the average rating
  const averageRating = useMemo(() => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const totalRating = product.reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    return totalRating / product.reviews.length;
  }, [product.reviews]);

  return (
    <div className="desktop:w-64 relative p-3 max-w-xs w-60 h-[45vh] bg-white rounded-lg shadow-xl overflow-hidden  flex flex-col justify-between border-x border-y border-slate-200 phone:w-1/2 phone:h-[40vh] phone:px-2 phone:py-2">
      {/* Discount button */}
      {Math.round(
        ((product?.price - product?.discountPrice) / product?.price) * 100
      ) >= 5 && (
        <button className="desktop:text-sm absolute top-0 left-2 p-1  shadow-md  z-10 bg-[#538cee] text-white  border flex flex-col items-center font-bold w-10 h-12 desktop:w-14 desktop:h-14 phone:text-sm phone:w-12 phone:h-12">
          <h1>
            {Math.round(
              ((product?.price - product?.discountPrice) / product?.price) * 100
            )}
            <span className="text-xs">%</span>
          </h1>
          <p className="text-xs desktop:text-xs phone:text-xs">OFF</p>
        </button>
      )}

      {/* Wishlist button */}
      <button
        className="desktop:text-lg absolute top-1 right-1 p-2 rounded-full shadow-md text-2xl z-10 bg-white hover:bg-gray-200  border phone:text-sm phone:top-2"
        onClick={() => toggleWishlist(product._id)}
      >
        {user?.user?.wishlist?.items?.some(
          (item) => item.productId === product._id
        ) ? (
          <RiHeartFill className="text-red-500" />
        ) : (
          <RiHeartLine />
        )}
      </button>

      {/* Link for product details */}
      <div className="w-full h-full flex flex-col items-start justify-between phone:justify-start phone:gap-2">
        <Link
          href={`/product/${product._id}`}
          className="relative w-full h-5/6 rounded-lg flex flex-col items-start justify-between gap-2 phone:justify-start phone:gap-1"
        >
          <Image
            width={400}
            height={300}
            priority={true}
            className="object-contain bg-center bg-cover h-3/4 w-full rounded-lg p-10"
            src={product?.thumbnail[0]}
            alt={product?.title}
          />
          <div className="flex flex-col gap-1 items-start justify-end w-full h-1/3">
            <h2 className="desktop:text-sm text-lg font-bold text-gray-800 dark:text-black line-clamp-2 phone:text-sm phone:line-clamp-1">
              {product.title}
            </h2>
            {/*  <div className="flex items-center gap-1 phone:hidden">
            <h1 className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  if (averageRating >= i + 1) {
                    return <RiStarFill key={i} className="text-yellow-400" />;
                  } else if (averageRating >= i + 0.5) {
                    return (
                      <RiStarHalfFill key={i} className="text-yellow-400" />
                    );
                  } else {
                    return <RiStarLine key={i} className="text-yellow-400" />;
                  }
                })}
              </h1> 

              <span className="text-gray-600 dark:text-gray-400 ml-2 desktop:text-sm phone:text-sm phone:hidden">
                ({product.reviews.length} reviews)
              </span>
            </div>*/}

            <span className=" text-gray-800  flex items-center gap-2   phone:gap-1 phone:text-md">
              <span className="line-through text-slate-400 text-sm desktop:text-sm phone:text-xs">
                Rs.{product.price}
              </span>
              <span className="text-md font-extrabold">
                {" "}
                Rs.{product.discountPrice}
              </span>
            </span>
          </div>
        </Link>
        <div className="w-full flex items-center justify-between">
          <h1 className="text-sm font-bold text-[#318616] ">100 gm</h1>
          <Button amount={product.discountPrice} productId={product._id} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
