import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/features/store";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from "@/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuantityControl from "@/components/uiCustom/QuantityControl";

export default function MyCart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const itemsByRestaurant = cartItems.reduce(
    (acc, item) => {
      const restaurantId = item.restaurantId;
      if (!acc[restaurantId]) {
        acc[restaurantId] = {
          restaurantId: item.restaurantId,
          restaurantName: item.restaurantName,
          restaurantLogo: item.restaurantLogo,
          items: [],
        };
      }
      acc[restaurantId].items.push(item);
      return acc;
    },
    {} as Record<
      number,
      {
        restaurantId: number;
        restaurantName: string;
        restaurantLogo: string;
        items: typeof cartItems;
      }
    >,
  );

  const restaurants = Object.values(itemsByRestaurant);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <p className="text-gray-500 mb-4">Keranjangmu masih kosong nih.</p>
        <Button onClick={() => navigate("/")} className="bg-orange-500">
          Cari Makan Yuk!
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 pt-24 max-w-3xl mx-auto min-h-screen bg-white">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">My Cart</h1>
      </div>

      <div className="space-y-8">
        {restaurants.map((restaurant) => {
          const restaurantTotal = restaurant.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
          );

          return (
            <div
              key={restaurant.restaurantId}
              className="border rounded-2xl p-4 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                <img
                  src={restaurant.restaurantLogo}
                  alt={restaurant.restaurantName}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <h2 className="font-bold text-lg flex-1">
                  {restaurant.restaurantName}
                </h2>
                <button
                  onClick={() => navigate(`/detail/${restaurant.restaurantId}`)}
                  className="text-orange-500 text-sm"
                >
                  →
                </button>
              </div>

              <div className="space-y-4 mb-4">
                {restaurant.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1 text-left">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-sm md:text-base text-gray-800">
                          {item.name}
                        </h3>
                      </div>
                      <p className="text-black font-bold mt-1">
                        Rp{item.price.toLocaleString()}
                      </p>
                    </div>

                    <QuantityControl
                      quantity={item.quantity}
                      onIncrement={() => dispatch(incrementQuantity(item.id))}
                      onDecrement={() => dispatch(decrementQuantity(item.id))}
                    />
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 md:flex md:flex-row md:justify-between">
                <div className="flex justify-between flex-col  items-start mb-4">
                  <span className="">Total</span>
                  <span className="text-xl font-bold text-black">
                    Rp{restaurantTotal.toLocaleString()}
                  </span>
                </div>
                <Button
                  onClick={() => {
                    navigate("/checkout", {
                      state: { restaurantId: restaurant.restaurantId },
                    });
                  }}
                  className="w-full md:w-60 h-12 bg-[#C12116] rounded-full text-base font-bold"
                >
                  Checkout
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
