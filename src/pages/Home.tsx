import { useState } from "react"; // Tambah useEffect jika ingin update saat resize (opsional)
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { SearchIcon, Loader2 } from "lucide-react";
import heroimg from "../assets/heroimg.svg";
import allRestaurant from "../assets/All_Restaurant_logo.svg";
import Nearby from "../assets/Location_logo.svg";
import Discount from "../assets/Discount_logo.svg";
import BestSeller from "../assets/Best_Seller_logo.svg";
import Delivery from "../assets/Delivery_logo.svg";
import Lunch from "../assets/Lunch_logo.svg";
import RestaurantCard from "../components/uiCustom/RestaurantCard";
import { getRestaurants } from "@/services/api/restaurantService";
import type { Restaurant } from "@/services/api/restaurantService";

// ... (Imports UI components lainnya tetap sama) ...
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";

export default function Home() {
  const [visibleCount, setVisibleCount] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768 ? 12 : 5;
    }
    return 12; // Default fallback
  });

  // Opsional: Tambahan agar tombol "Show More" menambah jumlah yang pas
  // Kalau di Desktop tambah 6, kalau Mobile tambah 5
  const getIncrementCount = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768 ? 6 : 5;
    }
    return 6;
  };

  const {
    data: restaurants,
    isLoading,
    isError,
    error,
  } = useQuery<Restaurant[]>({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
  });

  // ... (Bagian linkModel tetap sama) ...
  const linkModel = [
    { name: "All Restaurant", image: allRestaurant },
    { name: "Nearby", image: Nearby },
    { name: "Discount", image: Discount },
    { name: "Best Seller", image: BestSeller },
    { name: "Delivery", image: Delivery },
    { name: "Lunch", image: Lunch },
  ];

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + getIncrementCount());
  };

  return (
    <div className="bg-white text-black pb-16 w-full">
      {/* ... (Hero Section dan Categories tetap sama persis) ... */}
      <div className="justify-center items-center flex flex-col h-162 md:h-207 gap-6 overflow-hidden">
        <div className="absolute inset-0 left-0 right-0 top-0 w-screen">
          <img
            src={heroimg}
            alt="Hero"
            className="w-full h-full md:h-207 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:h-207 from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl font-extrabold">
            Explore Culinary Experience
          </h1>
          <p className="text-lg font-semibold">
            Search and refine your choice to discover the perfect restaurant.
          </p>
        </div>
        <div className="w-full max-w-2xl relative z-10 px-4">
          <InputGroup className="bg-white rounded-full h-12 shadow-lg overflow-hidden flex items-center px-4">
            <InputGroupInput
              className="border-none focus:ring-0 text-black text-sm outline-none flex-1"
              placeholder="Search restaurants, food and drink"
            />
            <InputGroupAddon>
              <SearchIcon className="text-gray-400" />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>

      {/* Categories */}
      <div className="flex w-full flex-col gap-6 mt-12 px-4">
        <ItemGroup className="grid grid-cols-3 md:flex-row md:justify-between md:grid-cols-6 gap-4 w-full">
          {linkModel.map((model) => (
            <Item
              key={model.name}
              variant="outline"
              className="border-none shadow-none cursor-pointer p-0"
            >
              <ItemHeader className="p-5 shadow-sm rounded-2xl h-25 w-25">
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-contain mx-auto"
                />
              </ItemHeader>
              <ItemContent className="">
                <ItemTitle className="text-sm font-bold w-full text-center block">
                  {model.name}
                </ItemTitle>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </div>

      {/* Recommended Section */}
      <div className="flex w-full max-w-6xl mx-auto flex-col gap-6 mt-16 px-4">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold">Recommended</h2>
          <Link to="/allRestaurant" className="text-orange-600 font-semibold">
            See All
          </Link>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-10 h-10 text-orange-500" />
          </div>
        )}

        {isError && (
          <div className="text-red-500 text-center py-10">
            Error: {(error as Error).message}
          </div>
        )}

        {/* Grid Render */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Slice akan memotong sesuai state visibleCount */}
          {restaurants?.slice(0, visibleCount).map((resto) => (
            <RestaurantCard key={resto.id} restaurant={resto} />
          ))}
        </div>

        {/* Button Show More */}
        {restaurants && visibleCount < restaurants.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleShowMore}
              className="flex items-center gap-2 px-6 w-40 justify-center font-bold py-3 rounded-full! bg-white! border border-neutral-300! text-black hover:bg-orange-50 transition-colors duration-200"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
