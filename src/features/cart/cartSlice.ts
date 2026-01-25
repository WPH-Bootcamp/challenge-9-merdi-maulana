import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: number; // Unique cart item ID
  menuId: number; // Menu ID from API for checkout
  name: string;
  price: number;
  image: string; // Tambahkan image agar bisa ditampilkan di halaman checkout
  quantity: number;
  restaurantId: number; // ID restaurant untuk grouping
  restaurantName: string; // Nama restaurant
  restaurantLogo: string; // Logo restaurant
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      // Cari tahu apakah barang sudah ada di keranjang
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (existingItem) {
        // Jika sudah ada, cukup tambah quantity-nya
        existingItem.quantity += 1;
      } else {
        // Jika belum ada, masukkan sebagai item baru dengan quantity awal 1
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    // Untuk tombol minus (-)
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(
        (item: CartItem) => item.id === action.payload,
      );
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          // Jika quantity tinggal 1 dan dikurangi lagi, hapus dari keranjang
          state.items = state.items.filter(
            (i: CartItem) => i.id !== action.payload,
          );
        }
      }
    },

    // Untuk tombol plus (+) yang ada di dalam keranjang
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
