import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CoinDocument, CoinHistoryDocument } from "../../backend/src/models";

export type ErrorState = {
  error: string | null;
};

const initialState: ErrorState = {
  error: null,
};

export const errorSlice = createSlice({
  name: "errorState",
  initialState,
  reducers: {
    setError: (state: ErrorState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setError } = errorSlice.actions;
export const errorReducer = errorSlice.reducer;
