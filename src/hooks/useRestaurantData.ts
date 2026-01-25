import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRestaurants,
  getRestaurantById,
  getRecommendedRestaurants,
  getBestSellerRestaurants,
  searchRestaurants,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getMyOrders,
} from "../services/api/restaurantService";

// ==================== RESTAURANT HOOKS ====================

// Hook untuk mendapatkan semua restaurants
export const useRestaurants = () => {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
  });
};

// Hook untuk mendapatkan restaurant by ID
export const useRestaurant = (id: string | number) => {
  return useQuery({
    queryKey: ["restaurant", id],
    queryFn: () => getRestaurantById(id),
    enabled: !!id,
  });
};

// Hook untuk mendapatkan recommended restaurants
export const useRecommendedRestaurants = () => {
  return useQuery({
    queryKey: ["restaurants", "recommended"],
    queryFn: getRecommendedRestaurants,
  });
};

// Hook untuk mendapatkan best seller restaurants
export const useBestSellerRestaurants = () => {
  return useQuery({
    queryKey: ["restaurants", "best-seller"],
    queryFn: getBestSellerRestaurants,
  });
};

// Hook untuk search restaurants
export const useSearchRestaurants = (name: string) => {
  return useQuery({
    queryKey: ["restaurants", "search", name],
    queryFn: () => searchRestaurants(name),
    enabled: name.length > 0,
  });
};

// ==================== CART HOOKS ====================

// Hook untuk mendapatkan cart
export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });
};

// Hook untuk add to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ menuId, quantity }: { menuId: number; quantity?: number }) =>
      addToCart(menuId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// Hook untuk update cart item
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      updateCartItem(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// Hook untuk remove from cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => removeFromCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// Hook untuk clear cart
export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// ==================== ORDER HOOKS ====================

// Hook untuk mendapatkan orders
export const useMyOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getMyOrders,
  });
};
