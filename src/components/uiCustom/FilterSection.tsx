import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/features/store";
import {
  setPriceRange,
  toggleRating,
  setDistance,
} from "@/features/filters/filtersSlice";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

// Distance options
const distanceOptions = [
  { id: "nearby", label: "Nearby", value: 0 },
  { id: "1km", label: "Within 1 km", value: 1 },
  { id: "3km", label: "Within 3 km", value: 3 },
  { id: "5km", label: "Within 5 km", value: 5 },
];

export default function FilterSection() {
  const dispatch = useDispatch();
  const { priceRange, ratings, distance } = useSelector(
    (state: RootState) => state.filters,
  );

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === "" ? 0 : Number(e.target.value);
    dispatch(setPriceRange({ ...priceRange, min: val }));
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === "" ? 1000000 : Number(e.target.value);
    dispatch(setPriceRange({ ...priceRange, max: val }));
  };

  return (
    <div className="space-y-6">
      {/* --- DISTANCE FILTER --- */}
      <div>
        <h5 className="font-bold text-sm mb-4">Distance</h5>
        <div className="flex flex-col gap-3">
          {distanceOptions.map((option) => (
            <div key={option.id} className="flex items-center gap-3">
              <Checkbox
                id={`distance-${option.id}`}
                checked={distance === option.value}
                onCheckedChange={() => dispatch(setDistance(option.value))}
                className="w-5 h-5 rounded border-gray-300 data-[state=checked]:bg-[#C12116] data-[state=checked]:border-[#C12116]"
              />
              <Label
                htmlFor={`distance-${option.id}`}
                className="text-sm cursor-pointer text-gray-700"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* --- PRICE FILTER --- */}
      <div>
        <h5 className="font-bold text-sm mb-4">Price</h5>
        <div className="flex flex-col gap-3">
          {/* Min Price */}
          <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
            <span className="px-4 py-3 text-gray-500 text-sm font-medium bg-gray-100">
              Rp
            </span>
            <input
              type="number"
              className="flex-1 bg-gray-100 py-3 pr-4 text-sm outline-none placeholder:text-gray-400"
              placeholder="Minimum Price"
              value={priceRange.min || ""}
              onChange={handleMinPriceChange}
            />
          </div>
          {/* Max Price */}
          <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
            <span className="px-4 py-3 text-gray-500 text-sm font-medium bg-gray-100">
              Rp
            </span>
            <input
              type="number"
              className="flex-1 bg-gray-100 py-3 pr-4 text-sm outline-none placeholder:text-gray-400"
              placeholder="Maximum Price"
              value={priceRange.max === 1000000 ? "" : priceRange.max}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* --- RATING FILTER --- */}
      <div>
        <h5 className="font-bold text-sm mb-4">Rating</h5>
        <div className="flex flex-col gap-3">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-3">
              <Checkbox
                id={`rating-${star}`}
                checked={ratings.includes(star)}
                onCheckedChange={() => dispatch(toggleRating(star))}
                className="w-5 h-5 rounded-full border-gray-300 data-[state=checked]:bg-[#C12116] data-[state=checked]:border-[#C12116]"
              />
              <Label
                htmlFor={`rating-${star}`}
                className="text-sm cursor-pointer flex items-center gap-1"
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-gray-700">{star}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
