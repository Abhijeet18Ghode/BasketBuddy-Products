// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { CiSearch } from "react-icons/ci";
// import { IoMdNotificationsOutline, IoMdCart } from "react-icons/io";
// import { FiUser } from "react-icons/fi";
// import Link from "next/link";
// import { useSession, signOut } from "next-auth/react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useCart } from "../provider/CartContext";
// import { ProductContext } from "../provider/ProductContext";
// import { useContext } from "react";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { GrUserManager } from "react-icons/gr";
// import { ImTruck } from "react-icons/im";
// import { AiFillHeart } from "react-icons/ai";
// import { LuWallet } from "react-icons/lu";
// import { IoCardSharp } from "react-icons/io5";
// import { RiCustomerService2Line } from "react-icons/ri";
// import { GiReturnArrow } from "react-icons/gi";
// import { MdSubscriptions } from "react-icons/md";
// import { GoCodeReview } from "react-icons/go";
// import { FaMoneyBill1Wave } from "react-icons/fa6";
// import { BsShieldFillPlus } from "react-icons/bs";
// import { IoIosLogOut } from "react-icons/io";
// import { usePathname } from "next/navigation";
// const Navbar = () => {
//   const { products, loading, error } = useContext(ProductContext);
//   const { cartData } = useCart();
//   const { data: session } = useSession();
//   const [keyword, setKeyword] = useState("");
//   const [category, setCategory] = useState("All Categories");
//   const [searchHistory, setSearchHistory] = useState([]);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [cartItems, setCartItems] = useState(3); // Replace with actual cart item count
//   const router = useRouter();
//   const dropdownRef = useRef(null);
//   const inputRef = useRef(null);
//   const [isDropDown, setIsDropDown] = useState(false);
//   const profileOptions = [
//     {
//       id: 1,
//       logo: <GrUserManager />,
//       option: "My Account",
//     },
//     {
//       id: 2,
//       logo: <ImTruck />,
//       option: "My Orders",
//     },
//     {
//       id: 3,
//       logo: <LuWallet />,
//       option: "My Wallet",
//     },
//     {
//       id: 4,
//       logo: <AiFillHeart />,
//       option: "Favourite Items",
//     },
//     {
//       id: 5,
//       logo: <IoCardSharp />,
//       option: "Voucher & Gift Cards",
//     },
//     {
//       id: 6,
//       logo: <RiCustomerService2Line />,
//       option: "Services",
//     },
//     {
//       id: 7,
//       logo: <GiReturnArrow />,
//       option: "My Returns",
//     },
//     {
//       id: 8,
//       logo: <MdSubscriptions />,
//       option: "Plans & Subscription",
//     },
//     {
//       id: 9,
//       logo: <GoCodeReview />,
//       option: "My Reviews",
//     },
//     {
//       id: 10,
//       logo: <BsShieldFillPlus />,
//       option: "My Guarantees",
//     },
//     {
//       id: 11,
//       logo: <FaMoneyBill1Wave />,
//       option: "Billing Data",
//     },
//   ];
//   const categories = ["Electronics", "Clothing", "Home Appliances", "Books"];
//   console.log(cartData);
//   // Submit handler for search
//   const submitHandler = (e) => {
//     e.preventDefault();
//     if (keyword) {
//       router.push(`/?category=${category}&keyword=${keyword}`);
//       setSearchHistory([...searchHistory, keyword]);
//     } else {
//       router.push("/");
//     }
//   };
//   console.log(products);
//   const combinedCartItems = cartData?.cart?.map((cartItem) => {
//     const product = products.find((p) => p._id === cartItem.productId?._id); // Find product by ID
//     return {
//       ...cartItem,
//       product,
//     };
//   });
//   console.log(combinedCartItems);
//   // Toggle Cart Dropdown
//   const toggleCartDropdown = () => {
//     setIsCartOpen(!isCartOpen);
//   };

//   // Toggle Profile Dropdown
//   const toggleProfileDropdown = () => {
//     setIsProfileOpen(!isProfileOpen);
//   };

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target) &&
//         !inputRef.current.contains(event.target)
//       ) {
//         setIsCartOpen(false);
//         setIsProfileOpen(false);
//         setIsDropDown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [dropdownRef, inputRef]);
//   const handleCartChange = () => {
//     setIsCartOpen(!isCartOpen);
//     router.push(`/cart/${session.user.id}`);
//   };
//   const pathname = usePathname();
//   const layout = ["/profile"];
//   const isHomePage = layout.includes(pathname);
//   if (isHomePage) {
//     return null;
//   }
//   return (
//     <div className="flex items-center w-full h-[7vh]  justify-between p-10 sticky top-0 z-50 bg-green-300">
//       <Link href={"/"} className=" desktop:text-xl phone:text-xl">
//         <Image
//           src="/logo/bb.png" // Path relative to the public folder
//           alt="BasketBuddy Logo"
//           width={100} // Set appropriate width
//           height={100} // Set appropriate height
//           priority // Optional: For better loading performance
//         />{" "}
//       </Link>

//       <div className="flex items-center w-2/5 relative phone:w-2/4">
//         {/* Search Input */}
//         <input
//           ref={inputRef}
//           className="outline-none border-t border-b border-r border-slate-200 pl-5 pr-5 pt-2 pb-2 rounded-lg w-full desktop:pt-1 desktop:pb-1 desktop:text-sm phone:text-sm phone:pl-1 phone:pr-1 phone:pt-1 phone:pb-1 phone:border-l phone:rounded-l-lg"
//           placeholder="Search"
//           value={keyword}
//           onChange={(e) => setKeyword(e.target.value)}
//           onFocus={() => setIsDropDown(true)} // Corrected to a function
//         />
//         <CiSearch
//           onClick={submitHandler}
//           className="-translate-x-10 text-3xl cursor-pointer desktop:-translate-x-7 phone:text-lg phone:-translate-x-7"
//         />
//         {isDropDown && (
//           <div
//             ref={dropdownRef}
//             className="dropdown absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto scrollbar-none"
//           >
//             {/* Search History */}
//             <div className="p-3 desktop:text-sm phone:p-1 phone:text-sm">
//               <h3 className="font-bold">Search History</h3>
//               <ul>
//                 {searchHistory.length > 0
//                   ? searchHistory.map((item, index) => (
//                       <li
//                         key={index}
//                         className="cursor-pointer hover:bg-gray-100 p-1"
//                         onClick={() => setKeyword(item)}
//                       >
//                         {item}
//                       </li>
//                     ))
//                   : null}
//               </ul>
//             </div>
//             {/* You can add other sections like Suggested Products, Top Features, etc. */}
//           </div>
//         )}
//       </div>

//       <div className="flex items-center justify-evenly text-2xl gap-5 desktop:text-lg desktop:gap-3 phone:text-lg phone:gap-2">
//         <IoMdNotificationsOutline className="cursor-pointer font-extrabold" />

//         {/* Cart Icon with Dropdown */}
//         <div className="relative">
//           <div className="relative cursor-pointer" onClick={toggleCartDropdown}>
//             <IoMdCart />
//             {cartData?.cart?.length > 0 && (
//               <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
//                 {cartData?.cart?.length}
//               </span>
//             )}
//           </div>
//           {isCartOpen && (
//             <div
//               ref={dropdownRef}
//               className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg z-50 phone:w-64"
//             >
//               <div className="p-3 flex flex-col  gap-2">
//                 {/* Remove the header and table design */}
//                 <div>
//                   <h1 className="text-xl font-bold phone:text-lg">
//                     Your Products
//                   </h1>
//                 </div>
//                 <hr className="w-full" />
//                 <ul className="p-2 flex flex-col gap-2 h-96 overflow-auto scrollbar-none">
//                   {combinedCartItems?.slice(0, 3).map((product) => (
//                     <li
//                       key={product?.product?.id}
//                       className="flex items-center justify-between border-b border-slate-200 py-2"
//                     >
//                       <Image
//                         src={product?.product?.thumbnail[0]}
//                         width={50}
//                         height={50}
//                         className="rounded"
//                         alt={product?.product?.title}
//                       />
//                       <div className="flex flex-col items-start mx-2 flex-grow">
//                         <h1 className="text-lg font-semibold phone:text-sm">
//                           {product?.product?.title}
//                         </h1>
//                         <p className="text-sm text-slate-600">
//                           Rs.{product?.price}
//                         </p>
//                       </div>
//                       <div className="flex items-center gap-3">
//                         <button className="text-lg " onClick={handleCartChange}>
//                           -
//                         </button>
//                         <span className="text-lg">{product?.quantity}</span>
//                         <button className="text-lg" onClick={handleCartChange}>
//                           +
//                         </button>
//                       </div>
//                       <button
//                         className="text-lg text-red-500 ml-2"
//                         onClick={handleCartChange}
//                       >
//                         <RiDeleteBin6Line />
//                       </button>
//                     </li>
//                   ))}
//                   {combinedCartItems?.length > 3 && (
//                     <li className="text-sm text-slate-600">
//                       ...and {combinedCartItems?.length - 3} more products.
//                     </li>
//                   )}
//                   <li className="w-full flex items-center justify-between text-lg font-bold">
//                     <h1>Total</h1>
//                     <p>Rs.{cartData?.totalAmount}</p>
//                   </li>
//                 </ul>

//                 <Link href={`/cart/${session?.user.id}`}>
//                   <button
//                     onClick={() => {
//                       setIsCartOpen(false);
//                     }}
//                     className="w-full bg-blue-500 text-white p-2 rounded text-lg font-bold"
//                   >
//                     See Your Cart
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Profile Icon with Dropdown */}
//         <div className="relative">
//           <div
//             className="flex items-center cursor-pointer"
//             onClick={toggleProfileDropdown}
//           >
//             {session?.user.image ? (
//               <Image
//                 src={session?.user?.image}
//                 width={40}
//                 height={40}
//                 className="rounded-full desktop:w-8 desktop:h-8 phone:w-8 phone:h-8 "
//                 alt={session?.user?.name || "User Profile"}
//               />
//             ) : (
//               <FiUser />
//             )}
//           </div>
//           {isProfileOpen && (
//             <div
//               ref={dropdownRef}
//               className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-50 phone:w-64"
//             >
//               <div className="p-3 flex flex-col items-start gap-5">
//                 <div className="w-full flex flex-col gap-2">
//                   <h3 className="font-bold text-lg">
//                     Hello, {session?.user?.name || "Guest"}
//                   </h3>
//                   <hr className="w-full" />
//                 </div>
//                 {session ? (
//                   <div className="w-full">
//                     {profileOptions.map((option) => {
//                       return (
//                         <Link
//                           key={option.id}
//                           href={`/profile/${option.option
//                             .toLowerCase()
//                             .replace(/\s+/g, "")}`}
//                           className=" p-2 rounded-lg hover:bg-gray-100 text-lg w-full flex items-center gap-2 phone:text-sm "
//                         >
//                           <span className="text-slate-400 phone:text-sm">
//                             {option.logo}
//                           </span>{" "}
//                           {option.option}
//                         </Link>
//                       );
//                     })}
//                     <button
//                       onClick={() => signOut()}
//                       className="flex items-center gap-2  p-2  w-full text-left text-sm text-red-500 font-semibold"
//                     >
//                       <IoIosLogOut /> Sign Out
//                     </button>
//                   </div>
//                 ) : (
//                   <Link
//                     href="/user/login"
//                     className="block py-1 hover:bg-gray-100"
//                   >
//                     Sign in
//                   </Link>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;
"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { CiSearch } from "react-icons/ci";
import { IoMdNotificationsOutline, IoMdCart } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../provider/CartContext";
import { ProductContext } from "../provider/ProductContext";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrUserManager } from "react-icons/gr";
import { ImTruck } from "react-icons/im";
import { AiFillHeart } from "react-icons/ai";
import { LuWallet } from "react-icons/lu";
import { IoCardSharp } from "react-icons/io5";
import { RiCustomerService2Line } from "react-icons/ri";
import { GiReturnArrow } from "react-icons/gi";
import { MdSubscriptions } from "react-icons/md";
import { GoCodeReview } from "react-icons/go";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { BsShieldFillPlus } from "react-icons/bs";

const Navbar = () => {
  const { products } = useContext(ProductContext);
  const { cartData } = useCart();
  const { data: session } = useSession();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [searchHistory, setSearchHistory] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDropDown, setIsDropDown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const profileOptions = [
    { id: 1, logo: <GrUserManager />, option: "My Account" },
    { id: 2, logo: <ImTruck />, option: "My Orders" },
    { id: 3, logo: <LuWallet />, option: "My Wallet" },
    { id: 4, logo: <AiFillHeart />, option: "Favourite Items" },
    { id: 5, logo: <IoCardSharp />, option: "Voucher & Gift Cards" },
    { id: 6, logo: <RiCustomerService2Line />, option: "Services" },
    { id: 7, logo: <GiReturnArrow />, option: "My Returns" },
    { id: 8, logo: <MdSubscriptions />, option: "Plans & Subscription" },
    { id: 9, logo: <GoCodeReview />, option: "My Reviews" },
    { id: 10, logo: <BsShieldFillPlus />, option: "My Guarantees" },
    { id: 11, logo: <FaMoneyBill1Wave />, option: "Billing Data" },
  ];

  const categories = ["Electronics", "Clothing", "Home Appliances", "Books"];

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      router.push(`/?category=${category}&keyword=${keyword}`);
      setSearchHistory([...searchHistory, keyword]);
    } else {
      router.push("/");
    }
  };

  const combinedCartItems = cartData?.cart?.map((cartItem) => {
    const product = products.find((p) => p._id === cartItem.productId?._id);
    return { ...cartItem, product };
  });

  const toggleCartDropdown = () => setIsCartOpen(!isCartOpen);
  const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setIsCartOpen(false);
        setIsProfileOpen(false);
        setIsDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pathname = usePathname();
  const layout = ["/profile"];
  const isHomePage = layout.includes(pathname);

  if (isHomePage) {
    return null;
  }

  return (
    <div className="flex items-center w-full h-[8.5vh] justify-between p-4 sticky top-0 z-50 bg-green-300">
      <Link href={"/"} className="desktop:text-xl phone:text-xl">
        <Image
          src="/logo/bb.png"
          alt="BasketBuddy Logo"
          width={90}
          height={90}
          priority
        />
      </Link>
      <div className="flex items-center w-2/5  phone:w-1/4">
        <input
          ref={inputRef}
          className="outline-none border pl-5 pr-5 pt-2 pb-2 rounded-lg w-full"
          placeholder="Search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setIsDropDown(true)}
        />
        <CiSearch
          onClick={submitHandler}
          className="-translate-x-10 text-3xl cursor-pointer"
        />
        {isDropDown && (
          <div
            ref={dropdownRef}
            className="dropdown absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            <div className="p-3">
              <h3 className="font-bold">Search History</h3>
              <ul>
                {searchHistory.map((item, index) => (
                  <li
                    key={index}
                    className="cursor-pointer hover:bg-gray-100 p-1"
                    onClick={() => setKeyword(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center text-2xl gap-5">
        <IoMdNotificationsOutline className="cursor-pointer" />
        <div className="relative">
          <IoMdCart onClick={toggleCartDropdown} className="cursor-pointer" />
          {cartData?.cart?.length > 0 && (
            <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {cartData.cart.length}
            </span>
          )}
          {isCartOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg"
            >
              <div className="p-3">
                <h1 className="text-xl font-bold">Your Products</h1>
                <ul>
                  {combinedCartItems.slice(0, 3).map((product) => (
                    <li key={product.product.id} className="flex items-center">
                      <Image
                        src={product.product.thumbnail[0]}
                        width={50}
                        height={50}
                        alt={product.product.title}
                      />
                      <div className="ml-3">
                        <h2>{product.product.title}</h2>
                        <p>Rs.{product.price}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link href={`/cart/${session.user.id}`}>
                  <button className="w-full bg-blue-500 text-white p-2 rounded">
                    See Your Cart
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
        <FiUser className="cursor-pointer" onClick={toggleProfileDropdown} />
        {isProfileOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg"
          >
            {profileOptions.map(({ id, logo, option }) => (
              <div key={id} className="p-2 flex items-center">
                {logo}
                <span className="ml-2">{option}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
