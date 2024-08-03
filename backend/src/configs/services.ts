import { registerAs } from '@nestjs/config';

export default registerAs('services', () => ({
  liveCoinWatch: {
    url: process.env.LIVE_COIN_WATCH_URL || '',
    apiKey: process.env.LIVE_COIN_WATCH_API_KEY || '',
  },
}));
