import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/features/store";
import { Search, X, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getMyOrders, createReview } from "@/services/api/restaurantService";
import type { Order } from "@/services/api/restaurantService";
import ProfileSidebar from "@/components/uiCustom/ProfileSidebar";

type OrderStatus =
  | "all"
  | "pending"
  | "preparing"
  | "on-the-way"
  | "delivered"
  | "done"
  | "canceled";

export default function MyOrders() {
  const { user } = useSelector((state: RootState) => state.auth);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("all");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const statusTabs: { label: string; value: OrderStatus }[] = [
    { label: "Preparing", value: "preparing" },
    { label: "On the Way", value: "on-the-way" },
    { label: "Delivered", value: "delivered" },
    { label: "Done", value: "done" },
    { label: "Canceled", value: "canceled" },
  ];

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getMyOrders();
        // Ensure data is always an array
        const ordersArray = Array.isArray(data) ? data : [];
        setOrders(ordersArray);
      } catch (err: any) {
        console.error("Failed to fetch orders:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to load orders",
        );
        setOrders([]); // Reset to empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders by status and search
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    const matchesSearch =
      searchQuery === "" ||
      order.restaurant?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleGiveReview = (order: Order) => {
    setSelectedOrder(order);
    setIsReviewModalOpen(true);
    setRating(0);
    setReviewText("");
  };

  const handleSubmitReview = async () => {
    if (!selectedOrder || rating === 0) return;

    setIsSubmittingReview(true);

    try {
      // Get restaurant ID and menu IDs from order structure
      const restaurantId =
        selectedOrder.restaurants?.[0]?.restaurant?.id ||
        selectedOrder.restaurant?.id ||
        0;

      // Flatten menu IDs from restaurants array or use items directly
      const menuIds = selectedOrder.restaurants
        ? selectedOrder.restaurants.flatMap(
            (r) => r.items?.map((item) => item.menuId) || [],
          )
        : selectedOrder.items?.map((item) => item.menuId) || [];

      await createReview({
        transactionId: selectedOrder.transactionId,
        restaurantId,
        star: rating,
        comment: reviewText,
        menuIds,
      });

      setIsReviewModalOpen(false);
      alert("Review submitted successfully!");
    } catch (err: any) {
      console.error("Failed to submit review:", err);
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#C12116]" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-left bg-gray-50 pb-4">
      <div className="max-w-7xl mx-auto p-6 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block lg:col-span-1">
            <ProfileSidebar activePage="my-orders" user={user} />
          </div>

          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            <div className="relative mb-6 lg:max-w-md">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-orange-300"
              />
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide align-middle items-center">
              <h2 className="text-base font-bold flex align-middle items-center h-full shrink-0">
                Status
              </h2>
              <div className="flex gap-2">
                {statusTabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setSelectedStatus(tab.value)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                      selectedStatus === tab.value
                        ? "bg-[#FFECEC] text-[#C12116] border border-[#C12116]"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-orange-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  {orders.length === 0
                    ? "You don't have any orders yet"
                    : "No orders found"}
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            order.restaurants?.[0]?.restaurant?.logo ||
                            order.restaurant?.logo ||
                            "https://placehold.co/40"
                          }
                          alt={
                            order.restaurants?.[0]?.restaurant?.name ||
                            order.restaurant?.name ||
                            "Restaurant"
                          }
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-lg">
                            {order.restaurants?.[0]?.restaurant?.name ||
                              order.restaurant?.name ||
                              "Restaurant"}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {order.restaurants?.flatMap(
                        (rest: any, restIndex: number) =>
                          rest.items?.map((item: any, itemIndex: number) => (
                            <div
                              key={`${restIndex}-${itemIndex}`}
                              className="flex gap-3 items-center"
                            >
                              <img
                                src={item.image || "https://placehold.co/80"}
                                alt={item.menuName}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-semibold text-sm">
                                  {item.menuName}
                                </p>
                                <p className="text-base font-extrabold">
                                  {item.quantity} x Rp
                                  {item.price?.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          )),
                      )}
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-xl font-bold mt-1">
                          Rp
                          {(
                            order.pricing?.totalPrice || order.total
                          )?.toLocaleString()}
                        </p>
                      </div>
                      {order.status === "done" && (
                        <Button
                          onClick={() => handleGiveReview(order)}
                          className="bg-[#C12116] hover:bg-[#a01812] w-full lg:w-auto rounded-full px-8"
                        >
                          Give Review
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Give Review
            </DialogTitle>
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {selectedOrder && (
              <div className="flex items-center gap-3 pb-4 border-b">
                <img
                  src={
                    selectedOrder.restaurants?.[0]?.restaurant?.logo ||
                    selectedOrder.restaurant?.logo ||
                    "https://placehold.co/40"
                  }
                  alt={
                    selectedOrder.restaurants?.[0]?.restaurant?.name ||
                    selectedOrder.restaurant?.name ||
                    "Restaurant"
                  }
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-bold">
                    {selectedOrder.restaurants?.[0]?.restaurant?.name ||
                      selectedOrder.restaurant?.name ||
                      "Restaurant"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Order #{selectedOrder.transactionId}
                  </p>
                </div>
              </div>
            )}

            <div>
              <p className="font-semibold text-center mb-3">Give Rating</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={
                        star <= (hoverRating || rating)
                          ? "fill-[#FFAB0D] text-[#FFAB0D]"
                          : "fill-gray-300 text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <textarea
                placeholder="Please share your thoughts about our service!"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full h-40 p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:border-orange-300"
              />
            </div>

            <Button
              onClick={handleSubmitReview}
              disabled={rating === 0 || isSubmittingReview}
              className="w-full h-12 bg-[#C12116] hover:bg-[#a01812] rounded-2xl text-base font-bold"
            >
              {isSubmittingReview ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </span>
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
