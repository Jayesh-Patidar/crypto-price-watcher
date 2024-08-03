import { Controller, Get, Logger, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CoinResponse } from 'src/responses';
import { CoinService } from 'src/services';

@Controller('coin')
export class CoinController {
  constructor(private coinService: CoinService) {}

  @Get()
  async getAllCoins(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const coins = await this.coinService.getAllCoins();

    return res.json({
      coins: coins.map((coin) => new CoinResponse(coin).transform()),
    });
  }

  @Get(':code')
  async getCoinHistory(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const { code } = req.params;

    const coinHistories = await this.coinService.getCoinHistory(code);

    return res.json({
      histories: coinHistories.map((coinHistory) =>
        new CoinResponse(coinHistory).transform(),
      ),
    });
  }
}
