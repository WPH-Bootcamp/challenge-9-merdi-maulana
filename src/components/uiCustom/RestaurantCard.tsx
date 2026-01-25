import { Link } from "react-router-dom";
import defaultLogo from "../../assets/All_Restaurant_logo.svg";
// 1. Import tipe Restaurant dari file service kamu
import type { Restaurant } from "../../services/api/restaurantService";
import { FaStar } from "react-icons/fa6";
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";

// 2. Gunakan tipe tersebut pada parameter props
export default function RestaurantCard({
  restaurant,
}: {
  restaurant: Restaurant;
}) {
  if (!restaurant) return null;

  return (
    <Item
      variant="outline"
      asChild
      role="listitem"
      className="hover:shadow-md transition-all duration-200 bg-white border border-gray-100 rounded-xl overflow-hidden"
    >
      <Link to={`/detail/${restaurant.id}`} className="flex p-3 gap-4">
        <ItemMedia
          variant="image"
          className="shrink-0 flex-1 max-w-22.5 h-22.5"
        >
          <img
            src={restaurant.logo || defaultLogo}
            alt={restaurant.name}
            className="w-22.5 h-22.5 object-cover rounded-lg bg-gray-50 border"
          />
        </ItemMedia>

        <ItemContent className="flex flex-col justify-between flex-1  py-1">
          <div className="flex flex-col gap-1 text-left">
            <ItemTitle className="font-extrabold text-base text-gray-900 line-clamp-1">
              {restaurant.name}
            </ItemTitle>
            <div className="flex items-center gap-1 py-0.5 text-black rounded text-sm items-center">
              <FaStar className="text-[#FFAB0D]" /> {restaurant.star}
            </div>

            <ItemDescription className="text-sm text-black mt-1 line-clamp-1">
              {restaurant.place}{" "}
              {restaurant.distance && <span>• {restaurant.distance} Km</span>}
            </ItemDescription>
          </div>
        </ItemContent>
      </Link>
    </Item>
  );
}
