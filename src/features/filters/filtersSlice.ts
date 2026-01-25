import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  category: string;
  priceRange: { min: number; max: number };
  searchQuery: string;
  ratings: number[];
  distance: number | null; // Distance in km (0 = nearby, 1, 3, 5, null = all)
}

const initialState: FiltersState = {
  category: "",
  priceRange: { min: 0, max: 1000000 },
  searchQuery: "",
  ratings: [],
  distance: null,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setPriceRange: (
      state,
      action: PayloadAction<{ min: number; max: number }>,
    ) => {
      state.priceRange = action.payload;
    },
    toggleRating: (state, action: PayloadAction<number>) => {
      const rating = action.payload;
      if (state.ratings.includes(rating)) {
        state.ratings = state.ratings.filter((r) => r !== rating);
      } else {
        state.ratings.push(rating);
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setDistance: (state, action: PayloadAction<number | null>) => {
      // Toggle: if same distance, set to null (deselect)
      state.distance =
        state.distance === action.payload ? null : action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setCategory,
  setPriceRange,
  setSearchQuery,
  toggleRating,
  setDistance,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
