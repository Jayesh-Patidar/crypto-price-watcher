export type CoinType = {
  name: string;
  code: string;
  symbol: string | null;
  age: number;
  png64: string;
  exchanges: number;
  markets: number;
  pairs: number;
  allTimeHighUSD: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number | null;
  rate: number;
  volume: number;
  cap: number;
  delta: {
    hour: number;
    day: number;
    week: number;
    month: number;
    quarter: number;
    year: number;
  };
};
