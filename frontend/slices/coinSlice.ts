import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CoinDocument, CoinHistoryDocument } from "../../backend/src/models";

export type CoinState = {
  code: string | null;
  coins: CoinDocument[];
  history: CoinHistoryDocument[];
};

const initialState: CoinState = {
  code: null,
  coins: [],
  history: [],
};

export const coinSlice = createSlice({
  name: "coinState",
  initialState,
  reducers: {
    setCode: (state: CoinState, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setCoins: (state: CoinState, action: PayloadAction<CoinDocument[]>) => {
      state.coins = action.payload;
    },
    setHistory: (
      state: CoinState,
      action: PayloadAction<CoinHistoryDocument[]>
    ) => {
      state.history = action.payload;
    },
  },
});

export const { setCode, setCoins, setHistory } = coinSlice.actions;
export const coinReducer = coinSlice.reducer;
