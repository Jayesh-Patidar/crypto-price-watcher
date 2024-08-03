import { useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAppSelector, useAppDispatch } from "@/store";
import { CoinDocument, CoinHistoryDocument } from "../../backend/src/models";
import { setCode, setCoins, setHistory } from "@/slices";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import axios from "@/lib/axios";

export default function Home() {
  const dispatch = useAppDispatch();

  const coinsState = useAppSelector((state) => state.coinState.coins);
  const coinCodeState = useAppSelector((state) => state.coinState.code);
  const coinHistoryState = useAppSelector((state) => state.coinState.history);

  const rows = coinHistoryState.map((history, index) => ({
    ...history,
    index: ++index,
  }));

  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "#",
      type: "number",
      width: 5,
    },
    {
      field: "totalSupply",
      headerName: "Total Supply",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "maxSupply",
      headerName: "Max Supply",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "rate",
      headerName: "Rate",
      type: "number",
      width: 95,
      editable: true,
    },
    {
      field: "volume",
      headerName: "Volume",
      type: "number",
      width: 120,
      editable: true,
    },
    {
      field: "cap",
      headerName: "Cap",
      type: "number",
      width: 140,
      editable: true,
    },
    {
      field: "allTimeHighUSD",
      headerName: "All Time High in USD",
      type: "number",
      width: 145,
      editable: true,
    },
    {
      field: "delta.hour",
      headerName: "Delta Hour",
      type: "number",
      width: 90,
      editable: true,
      valueGetter: (_, row: CoinHistoryDocument): number => row.delta.hour,
    },
    {
      field: "delta.day",
      headerName: "Delta Day",
      type: "number",
      width: 90,
      editable: true,
      valueGetter: (_, row: CoinHistoryDocument): number => row.delta.day,
    },
    {
      field: "delta.week",
      headerName: "Delta Week",
      type: "number",
      width: 90,
      editable: true,
      valueGetter: (_, row: CoinHistoryDocument): number => row.delta.week,
    },
    {
      field: "delta.month",
      headerName: "Delta Month",
      type: "number",
      width: 90,
      editable: true,
      valueGetter: (_, row: CoinHistoryDocument): number => row.delta.month,
    },
    {
      field: "delta.quarter",
      headerName: "Delta Quarter",
      type: "number",
      width: 100,
      editable: true,
      valueGetter: (_, row: CoinHistoryDocument): number => row.delta.quarter,
    },
    {
      field: "delta.year",
      headerName: "Delta Year",
      type: "number",
      width: 90,
      editable: true,
      valueGetter: (_, row: CoinHistoryDocument): number => row.delta.year,
    },
    {
      field: "createdAt",
      headerName: "Pulled At",
      type: "dateTime",
      width: 180,
      editable: true,
      valueGetter: (_, row: CoinHistoryDocument): Date =>
        new Date(row.createdAt),
    },
  ];

  useEffect(() => {
    axios.get<{ coins: CoinDocument[] }>("/coin").then((response) => {
      if (response && response.status === 200) {
        dispatch(setCoins(response.data.coins));
      }
    });
  }, []);

  const fetchCoinHistory = async () => {
    if (coinCodeState) {
      const response = await axios.get<{
        histories: CoinHistoryDocument[];
      }>(`/coin/${coinCodeState.toLowerCase()}`);

      if (response && response.status === 200) {
        dispatch(setHistory(response.data.histories));
      }
    }
  };

  useEffect(() => {
    fetchCoinHistory();

    setInterval(
      async () => {
        fetchCoinHistory();
      },
      5 * 60 * 1000 // Poll every 5 minutes
    );
  }, [coinCodeState]);

  return (
    <Box className="p-24">
      <div className="flex">
        <FormControl className="w-80">
          <InputLabel id="coin-label">Coin</InputLabel>
          <Select
            labelId="coin-label"
            id="coin"
            label="Coin"
            value={coinCodeState || ""}
            onChange={(event: SelectChangeEvent) =>
              dispatch(setCode(event.target.value))
            }
          >
            {coinsState.map((coin) => (
              <MenuItem key={coin.code} value={coin.code}>
                {coin.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {coinHistoryState.length ? (
        <div className="pt-24">
          <DataGrid rows={rows} columns={columns} hideFooter />
        </div>
      ) : (
        ""
      )}
    </Box>
  );
}
