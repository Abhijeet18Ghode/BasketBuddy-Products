// app/components/BannerSlider.jsx
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { usePathname } from "next/navigation";
import Image from "next/image"; // Import Next.js Image component

export default function BannerSlider() {
  const pathname = usePathname();
  const layout = ["/", ""];
  const isHomePage = layout.includes(pathname);

  if (!isHomePage) {
    return null;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="w-full">
      <Slider {...settings}>
        {/* Slide 1 */}
        <div className="relative w-full h-[70vh] rounded-xl shadow-md border-x border-y border-slate-50 outline-none phone:h-[25vh]">
          <Image
            src="/logo/banner1.png"
            alt="Banner 1"
            layout="fill" // Fills the parent container
            className="rounded-xl phone:w-full phone:h-full object-contain phone:object-cover"
          />
        </div>

        {/* Slide 2 */}
        <div className="relative w-full h-[70vh] rounded-xl shadow-md border-x border-y border-slate-50 outline-none phone:h-[25vh]">
          <Image
            src="/logo/banner2.png"
            alt="Banner 2"
            layout="fill"
            className="rounded-xl phone:w-full phone:h-full object-contain phone:object-cover"
          />
        </div>

        {/* Slide 3 */}
        <div className="relative w-full h-[70vh] rounded-xl shadow-md border-x border-y border-slate-50 outline-none phone:h-[25vh]">
          <Image
            src="/logo/banner3.png"
            alt="Banner 3"
            layout="fill"
            className="rounded-xl phone:w-full phone:h-full object-contain phone:object-cover"
          />
        </div>
      </Slider>
    </div>
  );
}
