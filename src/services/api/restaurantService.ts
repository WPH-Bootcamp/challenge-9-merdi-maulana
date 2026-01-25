import api from "./axios";

// Types
export interface Root {
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
  restaurants: Restaurant[];
  pagination: Pagination;
  filters: Filters;
}

export interface Restaurant {
  id: number;
  name: string;
  star: number;
  place: string;
  logo: string;
  images: string[];
  category: string;
  reviewCount: number;
  menuCount: number;
  priceRange: PriceRange;
  distance: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Filters {
  range: any;
  priceMin: any;
  priceMax: any;
  rating: any;
  category: any;
}

export interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  restaurantId: number;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  userId: number;
  restaurantId: number;
}

export interface RestaurantDetail {
  id: number;
  name: string;
  star: number;
  averageRating: number;
  place: string;
  logo: string;
  images: string[];
  category: string;
  totalMenus: number;
  totalReviews: number;
  menus: MenuDetail[];
  reviews: ReviewDetail[];
}

export interface MenuDetail {
  id: number;
  foodName: string;
  price: number;
  type: string;
  image: string;
}

export interface ReviewDetail {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
}

// ==================== RESTAURANTS ====================

// GET /api/resto - Get restaurants with filters
export const getRestaurants = async () => {
  const response = await api.get("/resto");
  return response.data.data.restaurants;
};

export const getRestaurantDetail = async (
  id: number,
): Promise<RestaurantDetail> => {
  const response = await api.get(`/resto/${id}`);
  return response.data.data;
};

// GET /api/resto/recommended - Get recommended restaurants
export const getRecommendedRestaurants = async (): Promise<Restaurant[]> => {
  const response = await api.get("/resto/recommended");
  return response.data;
};

// GET /api/resto/best-seller - Get best seller restaurants
export const getBestSellerRestaurants = async (): Promise<Restaurant[]> => {
  const response = await api.get("/resto/best-seller");
  return response.data;
};

// GET /api/resto/nearby - Get nearby restaurants
export const getNearbyRestaurants = async (
  lat: number,
  lng: number,
): Promise<Restaurant[]> => {
  const response = await api.get("/resto/nearby", { params: { lat, lng } });
  return response.data;
};

// GET /api/resto/search - Search restaurants by name
export const searchRestaurants = async (
  name: string,
): Promise<Restaurant[]> => {
  const response = await api.get("/resto/search", { params: { name } });
  return response.data;
};

// GET /api/resto/{id} - Get restaurant detail with menus and reviews
export const getRestaurantById = async (
  id: string | number,
): Promise<Restaurant & { menus: Menu[]; reviews: Review[] }> => {
  const response = await api.get(`/resto/${id}`);
  return response.data;
};

// ==================== REVIEWS ====================

// GET /api/review/restaurant/{restaurantId} - Get reviews for a restaurant
export const getRestaurantReviews = async (
  restaurantId: string | number,
): Promise<Review[]> => {
  const response = await api.get(`/review/restaurant/${restaurantId}`);
  return response.data;
};

// Note: createReview moved to ORDERS & REVIEWS section below

// ==================== CART ====================

export interface CartItem {
  id: number;
  menuId: number;
  quantity: number;
  menu: Menu;
}

// GET /api/cart - Get user's cart
export const getCart = async (): Promise<CartItem[]> => {
  const response = await api.get("/cart");
  return response.data;
};

// POST /api/cart - Add item to cart
export const addToCart = async (
  menuId: number,
  quantity: number = 1,
): Promise<CartItem> => {
  const response = await api.post("/cart", { menuId, quantity });
  return response.data;
};

// PUT /api/cart/{id} - Update cart item quantity
export const updateCartItem = async (
  id: number,
  quantity: number,
): Promise<CartItem> => {
  const response = await api.put(`/cart/${id}`, { quantity });
  return response.data;
};

// DELETE /api/cart/{id} - Remove item from cart
export const removeFromCart = async (id: number): Promise<void> => {
  await api.delete(`/cart/${id}`);
};

// DELETE /api/cart - Clear entire cart
export const clearCart = async (): Promise<void> => {
  await api.delete("/cart");
};

// ==================== ORDERS ====================

export interface OrderItem {
  id: number;
  menuId: number;
  menuName: string;
  price: number;
  quantity: number;
  image: string;
  type: string;
}

export interface Order {
  id: number;
  transactionId: string;
  status: string;
  total?: number;
  deliveryFee?: number;
  serviceFee?: number;
  deliveryAddress: string;
  paymentMethod?: string;
  pricing?: {
    subtotal: number;
    serviceFee: number;
    deliveryFee: number;
    totalPrice: number;
  };
  restaurants?: {
    restaurant: {
      id: number;
      name: string;
      logo: string;
    };
    items: OrderItem[];
    subtotal: number;
  }[];
  // Legacy single restaurant format
  restaurant?: {
    id: number;
    name: string;
    logo: string;
  };
  items?: OrderItem[];
  createdAt: string;
}

// POST /api/order/checkout - Create order directly from menu items
export const checkout = async (data: {
  restaurants: {
    restaurantId: number;
    items: { menuId: number; quantity: number }[];
  }[];
  deliveryAddress: string;
  phone: string;
  paymentMethod: string;
}): Promise<Order> => {
  const response = await api.post("/order/checkout", data);
  return response.data?.data || response.data;
};

// GET /api/order/my-order - Get user's orders
export const getMyOrders = async (): Promise<Order[]> => {
  const response = await api.get("/order/my-order");

  // Handle different response formats
  const data = response.data;

  // If response has data.data.transactions array
  if (data?.data?.transactions && Array.isArray(data.data.transactions)) {
    return data.data.transactions;
  }

  // If response has data.data.orders array
  if (data?.data?.orders && Array.isArray(data.data.orders)) {
    return data.data.orders;
  }

  // If response has data.orders array
  if (data?.orders && Array.isArray(data.orders)) {
    return data.orders;
  }

  // If response has data.data array
  if (data?.data && Array.isArray(data.data)) {
    return data.data;
  }

  // If response itself is array
  if (Array.isArray(data)) {
    return data;
  }

  // Default empty array
  return [];
};

// ==================== REVIEWS ====================

export interface ReviewData {
  transactionId: string;
  restaurantId: number;
  star: number;
  comment: string;
  menuIds: number[];
}

export interface ReviewResponse {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  user: { id: number; name: string };
  restaurant: { id: number; name: string };
  transactionId: string;
}

// POST /api/review - Create a review
export const createReview = async (
  data: ReviewData,
): Promise<ReviewResponse> => {
  const response = await api.post("/review", data);
  return response.data.data;
};

// PUT /api/review/{id} - Update a review
export const updateReview = async (
  reviewId: number,
  data: { star: number; comment: string },
): Promise<ReviewResponse> => {
  const response = await api.put(`/review/${reviewId}`, data);
  return response.data.data;
};

// DELETE /api/review/{id} - Delete a review
export const deleteReview = async (reviewId: number): Promise<void> => {
  await api.delete(`/review/${reviewId}`);
};
