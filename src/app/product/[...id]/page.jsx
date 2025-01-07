"use client";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { GoStarFill } from "react-icons/go";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { FiHeart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useParams } from "next/navigation";
import { RiDiscountPercentFill } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";
import { PiPackageFill } from "react-icons/pi";
import { SlCalender } from "react-icons/sl";
import Slider from "react-slick";
import { IoMdCart } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { CartContext } from "../../../../lib/CartContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ProductContext } from "../../provider/ProductContext";
import { useCart } from "@/app/provider/CartContext";
import { LuMinus } from "react-icons/lu";
import { LuPlus } from "react-icons/lu";
import { SiPhonepe } from "react-icons/si";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import ComingSoon from "../../animData/comingSoon.json";
import NoReviews from "../../animData/noReviews.json";
import ProductCard from "@/app/components/ProductCard";
import NotFound from "../../animData/noReviews.json";
import { GrNext } from "react-icons/gr";
import { motion } from "framer-motion";

const Page = () => {
  const router = useRouter();
  const { id } = useParams();
  const { fetchCartData } = useCart();
  const { products, loading, error, fetchProducts } =
    useContext(ProductContext);
  const [activeTab, setActiveTab] = useState("details"); // Manage active section

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  //   const router = useRouter()
  const { data: session } = useSession();
  const [productDetail, setProductDetail] = useState(null); // Set initial state to null to handle loading state
  //   const [overviewBtn,setOverviewBtn] = useState(true)
  //   const [shipmentBtn,setShipmentBtn]=useState(false)
  const [moreProducts, setMoreProducts] = useState(null);
  const [quantityCount, setQuantityCount] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState(session?.user?.name);
  const [reviewerRating, setReviewerRating] = useState(0);
  const [reviewerComment, setReviewerComment] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const variants = {
    initial: { x: "100%", opacity: 0 }, // Start off-screen to the left
    enter: { x: 0, opacity: 1 }, // Move to the center
    exit: { x: "-100%", opacity: 0 }, // Move off-screen to the right
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const reviewData = [
    {
      id: id,
      name: reviewerName,
      rating: reviewerRating,
      comment: reviewerComment,
      reviewImage: session?.user?.image, // Get image from session
    },
  ];
  const reviewFormSubmit = async (event) => {
    // Prevent the default form submit behavior (like page reload)
    event.preventDefault();

    // Show a loading toast while the request is processing
    const toastId = toast.loading("Submitting your review...");

    try {
      // Post the review data to the API
      const res = await axios.post("/api/products/add-review", {
        reviewData,
      });

      // On success, update the toast with a success message
      if (res) {
        await fetchProducts();
        await toggleModal();
        toast.success("Review submitted successfully!", { id: toastId });
        console.log(res.data);
      }
    } catch (error) {
      // On error, update the toast with an error message
      toast.error("Failed to submit the review.", { id: toastId });
      console.error(error);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!session?.user?.id) {
      alert("Please log in to manage your wishlist.");
      return;
    }

    // Create a loading toast
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

  const addToCart = async (productId) => {
    if (!session) {
      toast.error("Please sign in first");
      return;
    }
    const loadingToast = toast.loading("Adding To cart...");
    if (session) {
      try {
        const res = await axios.post("/api/cart", {
          userId: session.user.id,
          productId,
          quantity: quantityCount,
        });
        toast.success(res.data.message, { id: loadingToast });
        fetchCartData(); // Refresh the cart data after successfully adding
      } catch (error) {
        if (error.response && error.response.status === 400) {
          // If product is already in the cart, show a specific message
          toast.error("Product already in the cart", { id: loadingToast });
        } else {
          // Handle other types of errors
          toast.error("Error adding product to cart", { id: loadingToast });
        }
      }
    } else {
      router.push("/user/login");
    }
  };
  useEffect(() => {
    if (products && id) {
      // Adjust the way you access id based on your routing library
      // If id is an array, use id[0], else use id directly
      const productId = Array.isArray(id) ? id[0] : id;

      // Find the product that matches the ID from the URL
      const product = products.find((product) => product._id === productId);

      if (product) {
        setProductDetail(product);
        setMainImage(product.thumbnail[0] || ""); // Handle cases where thumbnail might be undefined
      } else {
        // Handle case where product is not found
        setProductDetail(null);
        setMainImage("");
      }
    }
  }, [products, id]);
  const relatedProducts = useMemo(() => {
    if (productDetail && productDetail.category) {
      return products.filter(
        (p) =>
          p.category === productDetail.category && p._id !== productDetail._id
      );
    }
    return [];
  }, [products, productDetail]); // Re-run the effect when products or id changes
  console.log("detail = ", productDetail);
  const handleBuyNow = async (id) => {
    if (!session) {
      toast.error("Please sign in first");
      return;
    }
    try {
      // Wait for addToCart to complete
      await addToCart(id);
      // Redirect to checkout page
      router.push("/checkout");
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Optionally, you could handle the error here, e.g., show a notification
    }
  };
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  // Determine how many products to show based on 'showMore' state
  const productsToShow = showMore
    ? relatedProducts
    : relatedProducts.slice(0, 5);

  console.log("main", mainImage);
  if (!productDetail) {
    return (
      <div
        role="status"
        className="w-full h-screen flex items-center justify-center"
      >
        <svg
          aria-hidden="true"
          class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-700"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    ); // Render loading state if productDetail is null
  } else {
    return (
      <div className="w-full   pl-1 pr-1 h-fit pb-5 flex flex-col gap-10 phone:pl-1 phone:pr-1">
        <Toaster />
        <div className="w-full flex items-start justify-between h-[80vh] desktop:h-[85vh] phone:flex-col phone:h-auto">
          <div className="w-1/2 flex h-full flex-col items-center justify-between p-5 phone:w-full phone:px-1 phone:py-3 gap-5">
            <div className="w-full flex items-center flex-row-reverse h-5/6 gap-5 phone:flex-col">
              {/* Product Image */}
              <div className="w-3/4 h-full overflow-hidden relative group ">
                <Image
                  width={400}
                  height={400}
                  src={mainImage}
                  className="w-full h-full bg-cover bg-center object-contain border-x border-y shadow-sm p-5 rounded-lg cursor-pointer group-hover:scale-110 transition-transform duration-300"
                />
                {/* <ReactImageMagnify
    {...{
      smallImage: {
        alt: 'Wristwatch by Ted Baker London',
        isFluidWidth: true, // Use true for responsive resizing
        src: mainImage,
        width: 1200,  // Adjust as needed for your small image dimensions
        height: 800,   // Adjust as needed for your small image dimensions
      },
      largeImage: {
        src: mainImage,
        width: 2400, // Adjust to ensure the large image is high quality
        height: 3600 // Adjust to ensure the large image is high quality
      },
    }}
    className="w-full h-full object-contain border-x border-y shadow-sm p-5 rounded-lg cursor-pointer group-hover:scale-110 transition-transform duration-300"
  /> */}
              </div>
              <div className="w-1/4 h-full flex laptop:flex-col desktop:flex-col desktopxl:flex-col  items-center justify-start gap-5 overflow-auto scrollbar-none desktop:gap-3 phone:w-full phone:flex phone:overflow-x-scroll phone:scrollbar-none phone:gap-2">
                {/* Product Images */}
                <div className="w-32 h-32 overflow-hidden relative group phone:w-24 phone:h-24 ">
                  <Image
                    alt="product"
                    onClick={() => {
                      setMainImage(productDetail?.thumbnail[0]);
                    }}
                    width={100}
                    height={100}
                    src={productDetail.thumbnail[0]}
                    className="w-full h-full bg-cover bg-center object-contain p-5 rounded-lg border-x border-y border-slate-300 shadow-sm cursor-pointer group-hover:scale-110 transition-transform duration-300 desktop:w-24 desktop:h-24 phone:p-2"
                  />
                </div>
                {productDetail?.images?.map((image) => (
                  <div
                    key={image}
                    className="w-32 h-32 overflow-hidden relative group phone:w-24 phone:h-24"
                  >
                    <Image
                      alt="product"
                      src={image}
                      width={100}
                      height={100}
                      onClick={() => setMainImage(image)}
                      className="w-full h-full bg-cover bg-center object-contain p-5 rounded-lg border-x border-y border-slate-300 shadow-sm cursor-pointer group-hover:scale-110 transition-transform duration-300 desktop:w-24 desktop:h-24 phone:p-2"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full flex items-end gap-3 h-1/6 justify-center phone:gap-1 phone:fixed phone:bottom-0 phone:left-0 phone:right-0 phone:bg-white phone:z-50 phone:h-auto phone:p-4">
              <button
                onClick={() => addToCart(productDetail._id)}
                className="w-1/2 text-xl border-x border-y border-gray-700 p-3 font-bold rounded-lg phone:text-lg"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleBuyNow(productDetail._id)}
                className="w-1/2 text-xl border-x border-y border-gray-700 p-3 font-bold bg-gray-700 text-white rounded-lg phone:text-lg"
              >
                Buy Now
              </button>
            </div>
          </div>

          <div className="w-1/2 h-full p-5 flex flex-col items-start justify-between phone:w-full phone:px-1 phone:py-3">
            {/* Product Info */}
            <div className="flex flex-col gap-1 w-full">
              <h1 className="text-2xl font-extrabold desktop:text-lg phone:text-lg">
                {productDetail?.title}
              </h1>
              <p className="text-slate-400 desktop:text-sm phone:text-sm">
                {productDetail?.reviews?.length} Reviews
              </p>
              <div className="flex items-center gap-1 w-full">
                <h1 className="line-through text-xl desktop:text-lg phone:text-lg">
                  Rs.{productDetail.price}
                </h1>
                <h1 className="text-2xl font-extrabold desktop:text-xl phone:text-lg">
                  Rs.{productDetail?.discountPrice}
                </h1>
              </div>
            </div>

            {/* Description Section */}
            <div className="w-full mt-2 phone:hidden ">
              <p className="text-lg text-slate-400 max-h-40 overflow-auto scrollbar-none desktop:text-sm phone:text-sm">
                {productDetail.description}
              </p>
            </div>

            <hr className="w-full my-4" />

            {/* Product Variants
            <div className="w-full flex">
              {productDetail?.variants?.length > 0 ? (
                productDetail.variants.map((variant) => (
                  <div key={variant._id} className="flex flex-col gap-2">
                    {/* Display "Available" message for the variant
                    <h1 className="text-sm font-extrabold text-slate-400">
                      Available:{" "}
                      {variant.attributes
                        .map((attr) => attr.attributeType)
                        .join(", ")}
                    </h1>

                    {/* Button group for variant attributes 
                    <div className="flex gap-3">
                      {variant.attributes.map((attribute) => (
                        <button
                          key={attribute.value}
                          onClick={() => {
                            const variantProduct = products.find(
                              (product) => product._id === variant._id
                            );
                            setProductDetail(variantProduct);
                          }}
                          className={`bg-${attribute.value}-500 w-10 h-10 border border-slate-400 rounded-full desktop:w-5 desktop:h-5`}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <h1 className="text-xl font-extrabold text-slate-400 desktop:text-lg">
                  No Variants Available
                </h1>
              )}
            </div> */}

            <hr className="w-full my-4" />

            {/* Quantity Selector */}

            <hr className="w-full" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-10 mt-5 w-full phone:gap-5">
          <button
            onClick={() => handleTabChange("details")}
            className={`p-2 text-xl w-1/2 desktop:text-lg phone:text-xs phone:p-1 ${
              activeTab === "details"
                ? "font-extrabold border-b-2 border-black transition-all ease-in-out duration-150 flex items-center justify-center  gap-3 phone:flex-col"
                : "flex items-center justify-center  gap-3 phone:flex-col"
            }`}
          >
            <Image
              src="/icons/info.png"
              width={35}
              height={35}
              className="phone:w-6 phone:h-6"
            />
            Details
          </button>
          <button
            onClick={() => handleTabChange("reviews")}
            className={`p-2 text-xl w-1/2 desktop:text-lg phone:text-xs  phone:p-1 ${
              activeTab === "reviews"
                ? "font-extrabold border-b-2 border-black transition-all ease-in-out duration-150 flex items-center justify-center  gap-3 phone:flex-col"
                : "flex items-center justify-center  gap-3 phone:flex-col"
            }`}
          >
            <Image
              src="/icons/rating.png"
              width={35}
              height={35}
              className="phone:w-6 phone:h-6"
            />
            Rating & Reviews {productDetail?.reviews?.length}
          </button>
        </div>

        {/* Tab Content */}
        <div className="w-full ">
          {activeTab === "details" && (
            <motion.div
              className="flex flex-col gap-5 w-full h-auto "
              initial="initial"
              animate="enter"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.5 }} // Adjust duration as needed
            >
              {/* Your Details Tab Content */}
              <div className="flex flex-col items-start justify-between  w-full h-[25vh] p-5 shadow-md rounded-lg border-x border-y overflow-auto scrollbar-none phone:p-2">
                <div className="flex items-center gap-3 h-full">
                  <Image
                    src="/icons/desc.png"
                    width={35}
                    height={35}
                    className="phone:w-6 phone:h-6"
                  />
                  <h2 className="text-2xl font-bold phone:text-sm">
                    Description
                  </h2>
                </div>
                <p className="text-lg phone:text-xs h-full">
                  {productDetail?.description}
                </p>
              </div>
            </motion.div>
          )}
          {activeTab === "reviews" && (
            <motion.div
              className="flex flex-col gap-5 w-full h-[100vh] phone:h-[50vh]"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.5 }}
            >
              {/* Your Reviews Tab Content */}
              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex items-center justify-between ">
                  <h2 className="text-2xl font-bold phone:text-lg">
                    Rating & Reviews
                  </h2>
                  <button
                    onClick={toggleModal}
                    className="bg-gray-700 p-2 text-white font-bold rounded-lg  phone:text-sm"
                  >
                    Add Your Review
                  </button>
                </div>
                <select className="w-fit border-x border-y p-3">
                  <option>Newest</option>
                  <option>Older</option>
                </select>
              </div>
              {/* Modal for Adding Review */}
              {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                  <div className="bg-white p-5 rounded-lg w-1/2 phone:w-full">
                    <h2 className="text-xl font-semibold mb-4">
                      Add Your Review
                    </h2>
                    <form onSubmit={reviewFormSubmit}>
                      {/* Form Fields */}
                      <div className="mb-4">
                        <label className="block text-gray-700">Your Name</label>
                        <input
                          value={reviewerName}
                          placeholder="Type Your Name Here"
                          onChange={(e) => setReviewerName(e.target.value)}
                          type="text"
                          className="w-full p-2 border rounded-lg outline-none"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Rating</label>
                        <input
                          placeholder="Out Of 5"
                          onChange={(e) => setReviewerRating(e.target.value)}
                          type="number"
                          min="1"
                          max="5"
                          className="w-full p-2 border rounded-lg outline-none"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Comment</label>
                        <textarea
                          onChange={(e) => setReviewerComment(e.target.value)}
                          className="w-full p-2 border rounded-lg outline-none"
                        ></textarea>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="bg-gray-300 p-2 rounded-lg"
                          onClick={toggleModal}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-gray-700 text-white p-2 rounded-lg"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {/* Display product reviews */}
              {productDetail.reviews.length > 0 ? (
                <div className="w-full flex flex-col gap-5 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
                  {productDetail.reviews.map((review) => {
                    return (
                      <div
                        key={review._id} // Use review._id for unique key
                        className="w-full flex flex-col items-start p-3 bg-white shadow-sm border-x border-y border-slate-200 rounded-lg gap-5 phone:p-2 phone:gap-2"
                      >
                        <div className="flex items-center w-full justify-between">
                          <div className="flex items-center gap-3">
                            {review.reviewerImage ? (
                              <Image
                                alt="buddy"
                                src={review.reviewerImage}
                                width={100}
                                height={100}
                              />
                            ) : (
                              <h1 className="bg-blue-700 text-white p-1 text-center flex flex-col items-center justify-center text-xl rounded-full w-10 h-10 phone:text-sm phone:w-5 phone:h-5">
                                {review.reviewerName.charAt(0)}
                              </h1>
                            )}
                            <h1 className="text-xl font-bold phone:text-lg">
                              {review.reviewerName}
                            </h1>
                          </div>
                          <h1 className="flex items-center gap-1 justify-end">
                            <GoStarFill className="text-yellow-400 text-xl phone:text-lg" />
                            <h1 className="text-xl phone:text-lg">
                              {review.rating}
                            </h1>
                          </h1>
                        </div>
                        <h1 className="phone:text-sm">{review.comment}</h1>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full h-3/4 flex flex-col items-center gap-5 justify-center">
                  <Lottie
                    loop={true}
                    animationData={NoReviews}
                    className="w-full h-full"
                  />
                  <button
                    onClick={toggleModal}
                    className="bg-blue-700 text-white font-extrabold p-3 rounded-lg"
                  >
                    Make it Your First?
                  </button>
                </div>
              )}
            </motion.div>
          )}
          {activeTab === "discussion" && (
            <motion.div
              className="w-full h-[100vh] flex flex-col items-center justify-center phone:h-[50vh]"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.5 }}
            >
              <Lottie
                loop={true}
                animationData={ComingSoon}
                className="w-full h-full"
              />
            </motion.div>
          )}
        </div>

        <hr className="w-full" />
        <div className="w-full h-full  flex  gap-10">
          {/* Existing Product Details UI */}

          {/* Related Products Section */}
          <div className="w-full h-full flex flex-col gap-10">
            {/* Related Products Section */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col items-start gap-3 phone:gap-1">
                <h1 className="text-2xl font-bold desktop:text-lg phone:text-lg">
                  Related Products
                </h1>
                <hr className="w-48" />
              </div>

              <div className="flex flex-col gap-10">
                {relatedProducts.length > 0 ? (
                  <div className="w-full h-full flex flex-wrap items-center justify-start gap-1 phone:gap-0">
                    {productsToShow.map((relatedProduct) => (
                      <ProductCard
                        key={relatedProduct._id}
                        product={relatedProduct}
                        toggleWishlist={toggleWishlist}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-center">
                    <Lottie loop={true} animationData={NotFound} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Page;
