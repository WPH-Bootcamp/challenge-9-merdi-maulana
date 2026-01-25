import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "@/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";
import logo from "@/assets/Logo (1).svg";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    paymentMethod = "Bank Rakyat Indonesia",
    itemsTotal = 100000,
    deliveryFee = 10000,
    serviceFee = 1000,
    total = 111000,
    totalItems = 2,
  } = location.state || {};

  useEffect(() => {
    // Clear cart items for this restaurant after successful payment
    // For now, we'll just clear the entire cart
    // You can modify this to only clear items from specific restaurantId
    dispatch(clearCart());
  }, [dispatch]);

  // Format current date and time
  const currentDate = new Date().toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Foody Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold">Foody</h1>
          </div>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          {/* Success Icon */}
          <div className="flex justify-center mb-2">
            <div className="w-15 h-20 rounded-full flex items-center justify-center">
              <FaCheckCircle className="w-20 h-20 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-lg font-extrabold text-center mb-2">
            Payment Success
          </h2>
          <p className="text-black text-center text-sm  mb-8">
            Your payment has been successfully processed.
          </p>

          {/* Payment Details */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date</span>
              <span className="font-semibold">{currentDate}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold">{paymentMethod}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Price ({totalItems} items)</span>
              <span className="font-semibold">
                Rp{itemsTotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-semibold">
                Rp{deliveryFee.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service Fee</span>
              <span className="font-semibold">
                Rp{serviceFee.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Total */}
          <div className="border-t-2 border-dashed pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-2xl">
                Rp{total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => navigate("/my-order")}
            className="w-full h-12 bg-[#C12116] hover:bg-[#a01812] rounded-2xl text-base font-bold"
          >
            See My Orders
          </Button>
        </div>
      </div>
    </div>
  );
}
