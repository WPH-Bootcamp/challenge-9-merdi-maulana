import { useState } from "react";
import {
  getRestaurants,
  type Restaurant,
} from "@/services/api/restaurantService";
import { useQuery } from "@tanstack/react-query";
import RestaurantCard from "@/components/uiCustom/RestaurantCard";
import FilterSection from "@/components/uiCustom/FilterSection";
import { useSelector } from "react-redux";
import type { RootState } from "@/features/store";
import { SlidersHorizontal, X } from "lucide-react";

export default function AllRestaurant() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const {
    priceRange: filterPrice,
    ratings,
    searchQuery,
  } = useSelector((state: RootState) => state.filters);

  const {
    data: restaurants,
    isLoading,
    isError,
  } = useQuery<Restaurant[]>({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
  });

  const filteredRestaurants = restaurants?.filter((resto) => {
    const matchPrice =
      resto.priceRange.min <= filterPrice.max &&
      resto.priceRange.max >= filterPrice.min;
    const starFloor = Math.floor(resto.star);
    const matchRating = ratings.length === 0 || ratings.includes(starFloor);
    const matchSearch = resto.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchPrice && matchRating && matchSearch;
  });

  if (isLoading) return <p className="p-10 text-center">Loading...</p>;
  if (isError)
    return <p className="p-10 text-center text-red-500">Gagal memuat data.</p>;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto pt-20 pb-10">
      <h4 className="text-xl md:text-2xl font-bold mb-4">All Restaurant</h4>

      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center justify-between w-full py-3"
        >
          <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Filter
          </span>
          <SlidersHorizontal size={18} className="text-gray-500" />
        </button>
        <hr className="border-gray-200" />
      </div>

      <div className="flex gap-8 items-start">
        <aside className="hidden md:block w-64 border p-4 rounded-lg sticky top-24 h-fit bg-white shadow-sm">
          <FilterSection />
        </aside>

        <div className="flex-1">
          {filteredRestaurants && filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredRestaurants.map((resto) => (
                <RestaurantCard key={resto.id} restaurant={resto} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                Tidak ada restoran yang cocok dengan filter ini.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Coba atur ulang range harga atau rating.
              </p>
            </div>
          )}
        </div>
      </div>

      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold uppercase tracking-wide">
                Filter
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <FilterSection />
            </div>

            <div className="p-4 border-t bg-white">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-[#C12116] text-white py-3 rounded-full font-bold hover:bg-[#a01812] transition"
              >
                Apply Filter ({filteredRestaurants?.length || 0})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
