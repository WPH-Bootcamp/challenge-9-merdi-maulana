import { useState } from "react";
import { CarouselDetail } from "../components/uiCustom/CarouselDetail";
import { useParams, useNavigate } from "react-router-dom";
import {
  getRestaurantDetail,
  type RestaurantDetail,
} from "@/services/api/restaurantService";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/features/store";
import {
  addToCart,
  incrementQuantity,
  decrementQuantity,
} from "@/features/cart/cartSlice";
import {
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";
import { FaStar } from "react-icons/fa6";
import { FiShare2 } from "react-icons/fi";
import defaultAvatar from "../assets/defaultAvatar.png";
import { FaBagShopping } from "react-icons/fa6";
import QuantityControl from "@/components/uiCustom/QuantityControl";

const formatReviewDate = (dateString: string) => {
  const date = new Date(dateString);
  const datePart = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${datePart}, ${timePart}`;
};

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const restaurantId = Number(id);
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // State untuk filter kategori menu
  const [selectedType, setSelectedType] = useState<string>("all");

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const {
    data: restaurant,
    isLoading,
    isError,
    error,
  } = useQuery<RestaurantDetail>({
    queryKey: ["restaurants", restaurantId],
    queryFn: () => getRestaurantDetail(restaurantId),
    enabled: !!restaurantId,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin text-orange-500 w-10 h-10" />
      </div>
    );

  if (isError)
    return (
      <p className="text-red-500 text-center p-10">
        Error: {(error as Error).message}
      </p>
    );

  if (!restaurant)
    return <p className="text-center p-10">Data tidak ditemukan</p>;

  // Logika Filter Menu
  const filteredMenus = restaurant.menus.filter((menu) => {
    if (selectedType === "all") return true;
    return menu.type.toLowerCase() === selectedType.toLowerCase();
  });

  const handleGoToCart = () => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk melakukan checkout");
      return; // Stop here if not logged in
    }
    navigate("/myCart");
  };

  return (
    <div className="p-6 md:px-30">
      <div>
        <div className="md:hidden">
          <CarouselDetail images={restaurant.images} />
        </div>
        <div className="hidden mt-12 md:grid grid-cols-2 gap-2 h-[400px] overflow-hidden rounded-2xl">
          {/* Left: Large image */}
          <div className="h-full overflow-hidden">
            <img
              src={restaurant.images[0]}
              alt={restaurant.name}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
          {/* Right: 1 top + 2 bottom */}
          <div className="flex flex-col gap-2 h-full overflow-hidden">
            <div className="flex-1 min-h-0 overflow-hidden">
              <img
                src={restaurant.images[1]}
                alt={restaurant.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
              <div className="overflow-hidden">
                <img
                  src={restaurant.images[2]}
                  alt={restaurant.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="overflow-hidden">
                <img
                  src={restaurant.images[3]}
                  alt={restaurant.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-6">
        <ItemMedia
          variant="image"
          className="shrink-0 w-20 h-20 md:w-30 md:h-30"
        >
          <img
            src={restaurant.logo}
            alt={restaurant.name}
            className="w-full h-full object-cover rounded-lg bg-gray-50 border shadow-sm"
          />
        </ItemMedia>

        <ItemContent className="flex-1">
          <ItemTitle className="font-extrabold text-lg md:text-3xl text-gray-900 line-clamp-1">
            {restaurant.name}
          </ItemTitle>
          <div className="flex items-center gap-1 text-sm md:text-lg font-medium mt-1">
            <FaStar className="text-[#FFAB0D]" /> {restaurant.star}
          </div>
          <ItemDescription className="text-sm md:text-lg text-left text-gray-500 mt-0.5 line-clamp-1">
            {restaurant.place}
          </ItemDescription>
        </ItemContent>

        <button className="flex items-center justify-center border md:px-6 p-2.5 rounded-full hover:bg-gray-50 transition-colors">
          <FiShare2 className="text-black h-5 w-5" />
          <p className="hidden md:block font-bold ml-4">Share</p>
        </button>
      </div>
      {/* Filter Menu Section */}
      <div className="mt-8">
        <h2 className="text-xl font-extrabold mb-4 text-left">Menu</h2>

        {/* Tombol Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {["all", "food", "drink"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-5 py-2 rounded-full text-sm font-bold capitalize transition-all border whitespace-nowrap ${
                selectedType === type
                  ? "bg-[#FFECEC] text-[#C12116] border-[#C12116]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-200"
              }`}
            >
              {type === "all" ? "All Menu" : type}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredMenus.length > 0 ? (
            filteredMenus.map((menu) => {
              const itemInCart = cartItems.find((item) => item.id === menu.id);
              return (
                <div
                  key={menu.id}
                  className="border text-left rounded-xl flex flex-col justify-between bg-white hover:shadow-md transition-shadow"
                >
                  <div className="w-full h-40 md:h-71 overflow-hidden">
                    <img
                      src={menu.image}
                      alt={menu.foodName}
                      className="w-full h-full object-cover rounded-t-lg shadow-sm"
                    />
                  </div>
                  <div className="flex-1 flex flex-col mt-2 md:flex-row md:justify-between">
                    <div className="flex gap-4 flex-col">
                      <div className="flex-1 px-3">
                        <p className="font-base text-sm text-gray-800">
                          {menu.foodName}
                        </p>
                        <p className="text-sm font-extrabold mt-1">
                          Rp{menu.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      {!itemInCart ? (
                        <button
                          onClick={() =>
                            dispatch(
                              addToCart({
                                id: menu.id,
                                menuId: menu.id,
                                name: menu.foodName,
                                price: menu.price,
                                image: menu.image,
                                restaurantId: restaurant.id,
                                restaurantName: restaurant.name,
                                restaurantLogo: restaurant.logo,
                              }),
                            )
                          }
                          className="bg-[#C12116] w-full m-3 text-white px-6 py-1.5 rounded-full text-sm font-bold hover:bg-orange-600 transition-colors shadow-sm"
                        >
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center m-3">
                          <QuantityControl
                            quantity={itemInCart.quantity}
                            onIncrement={() =>
                              dispatch(incrementQuantity(menu.id))
                            }
                            onDecrement={() =>
                              dispatch(decrementQuantity(menu.id))
                            }
                            size="sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-10 text-gray-400">
              Menu kategori {selectedType} tidak tersedia.
            </div>
          )}
        </div>
      </div>
      {/* Review Section */}
      <div className="mt-12">
        <div className="flex flex-col items-baseline gap-2 mb-6">
          <h2 className="text-xl font-bold">Review</h2>
          <p className="text-sm text-neutral-950 font-extrabold flex items-center gap-1">
            <FaStar className="text-[#FFAB0D]" /> {restaurant.star} (
            {restaurant.totalReviews} Ulasan)
          </p>
        </div>

        <div className="space-y-6 md:grid md:grid-cols-2 md:gap-4">
          {restaurant.reviews.map((review) => (
            <div
              key={review.id}
              className="border-b pb-6 last:border-0 md:shadow md:p-4 shadow-xs px-2 rounded-2xl"
            >
              <div className="flex items-center text-left gap-3 mb-3">
                <img
                  src={review.user.avatar ? review.user.avatar : defaultAvatar}
                  className="w-12 h-12 rounded-full border font-extrabold text-base"
                  alt={review.user.name}
                />
                <div className="flex-1 ">
                  <p className="text-sm font-bold text-neutral-950">
                    {review.user.name}
                  </p>
                  <p className="text-[11px] mt-2 text-neutral-950 font-medium">
                    {formatReviewDate(review.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-base ${i < review.star ? "text-[#FFAB0D]" : "text-gray-200"}`}
                  />
                ))}
              </div>
              <p className="text-black text-sm leading-relaxed pt-2 rounded-lg text-left">
                "{review.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Floating Cart Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-50">
          <button
            onClick={handleGoToCart}
            className="w-full bg-white text-black p-4 rounded-2xl flex justify-between items-center shadow-2xl hover:bg-orange-600 transition-all active:scale-95"
          >
            <div className="flex flex-col items-start">
              <span className="font-extrabold text-sm flex items-center">
                <FaBagShopping className="scale-120 mr-2" /> {totalQuantity}{" "}
                Items
              </span>
              <span className="text-base opacity-100 font-extrabold mt-2">
                Rp{totalPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center bg-[#C12116] rounded-full gap-3 px-4 py-2 text-white w-40 justify-center font-bold">
              <p>Checkout</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
