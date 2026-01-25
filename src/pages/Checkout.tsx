import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/features/store";
import { clearCart } from "@/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, Plus, Minus } from "lucide-react";
import {
  incrementQuantity,
  decrementQuantity,
} from "@/features/cart/cartSlice";
import { checkout } from "@/services/api/restaurantService";
import BNI from "@/assets/BNI.svg";
import BRI from "@/assets/BRI.svg";
import BCA from "@/assets/BCA.svg";
import Mandiri from "@/assets/Mandiri.svg";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const restaurantId = location.state?.restaurantId;

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);

  // Filter items by restaurant if restaurantId is provided
  const filteredItems = restaurantId
    ? cartItems.filter((item) => item.restaurantId === restaurantId)
    : cartItems;

  const [selectedPayment, setSelectedPayment] = useState("BNI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get restaurant info from first item
  const restaurantInfo = filteredItems[0]
    ? {
        name: filteredItems[0].restaurantName,
        logo: filteredItems[0].restaurantLogo,
        id: filteredItems[0].restaurantId,
      }
    : null;

  // Calculate totals
  const itemsTotal = filteredItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const deliveryFee = 10000;
  const serviceFee = 1000;
  const total = itemsTotal + deliveryFee + serviceFee;
  const totalItems = filteredItems.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  const paymentMethods = [
    { id: "BNI", name: "Bank Negara Indonesia", logo: BNI },
    { id: "BRI", name: "Bank Rakyat Indonesia", logo: BRI },
    { id: "BCA", name: "Bank Central Asia", logo: BCA },
    { id: "Mandiri", name: "Mandiri", logo: Mandiri },
  ];

  const handleBuy = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Build delivery address from user profile
      const deliveryAddress = user
        ? `${user.name}, ${user.phone}, ${user.email}`
        : "Default Address";

      // Group items by restaurant and format for API
      // API expects: { restaurants: [{ restaurantId, menus: [{menuId, quantity}] }], deliveryAddress }
      const restaurantsMap = new Map<
        number,
        { menuId: number; quantity: number }[]
      >();

      filteredItems.forEach((item) => {
        const restId = item.restaurantId;
        if (!restaurantsMap.has(restId)) {
          restaurantsMap.set(restId, []);
        }
        restaurantsMap.get(restId)!.push({
          menuId: item.menuId || item.id,
          quantity: item.quantity,
        });
      });

      const restaurants = Array.from(restaurantsMap.entries()).map(
        ([restaurantId, items]) => ({
          restaurantId,
          items,
        }),
      );

      // Get selected payment method name
      const paymentMethodName =
        paymentMethods.find((p) => p.id === selectedPayment)?.name ||
        "BNI Bank Negara Indonesia";

      const checkoutData = {
        restaurants,
        deliveryAddress,
        phone: user?.phone || "0812-3456-7890",
        paymentMethod: paymentMethodName,
      };

      // Call checkout API
      const orderResponse = await checkout(checkoutData);

      // Clear cart after successful order
      dispatch(clearCart());

      // Navigate to success page with order details
      navigate("/payment-success", {
        state: {
          paymentMethod: paymentMethods.find((p) => p.id === selectedPayment)
            ?.name,
          itemsTotal,
          deliveryFee,
          serviceFee,
          total,
          totalItems,
          restaurantId,
          orderId: orderResponse?.id,
          transactionId: orderResponse?.transactionId,
          items: filteredItems,
          restaurantInfo,
        },
      });
    } catch (err: any) {
      console.error("Checkout error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Validation errors:", err.response?.data?.errors);

      // Handle validation errors array
      const errorData = err.response?.data;
      let errorMessage = "Failed to process order. Please try again.";

      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorMessage = errorData.errors.join(", ");
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }

      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <p className="text-gray-500 mb-4">No items to checkout</p>
        <Button onClick={() => navigate("/myCart")} className="bg-orange-500">
          Back to Cart
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 pt-20">
        <h1 className="text-2xl font-bold mb-2 text-left">Checkout</h1>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Section */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm text-left">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="text-red-600" size={20} />
                <h2 className="font-bold text-lg">Delivery Address</h2>
              </div>
              {user ? (
                <>
                  <p className=" font-semibold">{user.name}</p>
                  <p className=" text-sm mt-1">
                    Jl. Sudirman No. 25, Jakarta Pusat, 10220
                  </p>
                  <p className=" text-sm mt-1">{user.phone}</p>
                </>
              ) : (
                <>
                  <p className="">Jl. Sudirman No. 25, Jakarta Pusat, 10220</p>
                  <p className=" text-sm mt-1">0812-3456-7890</p>
                </>
              )}
              <button
                onClick={() => navigate("/profile")}
                className="mt-4 px-4 py-2 w-30 border border-gray-300 rounded-full text-sm font-bold hover:bg-gray-50"
              >
                Change
              </button>
            </div>

            {/* Restaurant Items */}
            {restaurantInfo && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={restaurantInfo.logo}
                      alt={restaurantInfo.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <h2 className="font-bold text-lg">{restaurantInfo.name}</h2>
                  </div>
                  <button
                    onClick={() => navigate(`/detail/${restaurantInfo.id}`)}
                    className="text-sm font-bold border px-4 py-2 rounded-full hover:text-orange-500"
                  >
                    Add item
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div className="flex-1 flex justify-between items-center text-left">
                        <div>
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <p className="text-base font-extrabold">
                            Rp{item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => dispatch(decrementQuantity(item.id))}
                            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-bold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch(incrementQuantity(item.id))}
                            className="w-8 h-8 rounded-full bg-[#C12116] text-white flex items-center justify-center hover:bg-[#a01812]"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-extrabold text-base mb-4 text-left">
                Payment Method
              </h2>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedPayment === method.id
                        ? "border-[#C12116] bg-red-50/30"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={method.logo}
                        alt={method.name}
                        className="w-10 h-10 object-contain"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {method.name}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPayment === method.id
                            ? "border-[#C12116]"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPayment === method.id && (
                          <div className="w-3 h-3 rounded-full bg-[#C12116]" />
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-extrabold text-base mb-4 text-left">
                Payment Summary
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="">Price ( {totalItems} items)</span>
                  <span className="font-medium">
                    Rp{itemsTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="">Delivery Fee</span>
                  <span className="font-medium">
                    Rp{deliveryFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="">Service Fee</span>
                  <span className="font-medium">
                    Rp{serviceFee.toLocaleString()}
                  </span>
                </div>
                <div className="pt-3 flex justify-between items-center">
                  <span className="font-bold text-base">Total</span>
                  <span className="font-bold text-xl">
                    Rp{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleBuy}
                disabled={isProcessing}
                className="w-full mt-6 h-12 bg-[#C12116] hover:bg-[#a01812] rounded-full text-base font-bold"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Buy"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
