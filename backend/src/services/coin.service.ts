import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AxiosError } from 'axios';
import { Model } from 'mongoose';
import { catchError, firstValueFrom } from 'rxjs';
import { Coin, CoinDocument, CoinHistory } from 'src/models';
import { CoinType } from 'src/typings';

@Injectable()
export class CoinService {
  private readonly logger = new Logger(CoinService.name);

  constructor(
    private httpService: HttpService,
    @InjectModel(Coin.name) private coinModel: Model<Coin>,
    @InjectModel(CoinHistory.name) private coinHistoryModel: Model<CoinHistory>,
  ) {}

  async populateCoins(): Promise<void> {
    const areCoinsPopulated = await this.coinModel.countDocuments();

    if (areCoinsPopulated > 0) {
      return;
    }

    this.logger.log('Started populating the coins!!!');

    const { data: coins = [] } = await firstValueFrom(
      this.httpService
        .post<CoinType[]>('/coins/list', {
          currency: 'USD',
          sort: 'rank',
          order: 'ascending',
          offset: 0,
          limit: 5,
          meta: true,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    coins.forEach((coin) =>
      this.coinModel.create({
        name: coin.name,
        code: coin.code,
        symbol: coin.symbol,
        age: coin.age,
        png64: coin.png64,
      }),
    );

    this.logger.log('Completed populating the coins!!!');
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async populateCoinsHistory() {
    this.logger.log('Started populating the coins history!!!');

    const coins = await this.getAllCoins();

    const coinsDetails = await Promise.all(
      coins.map((coin) =>
        firstValueFrom(
          this.httpService
            .post<CoinType>('/coins/single', {
              currency: 'USD',
              code: coin.code,
              meta: true,
            })
            .pipe(
              catchError((error: AxiosError) => {
                this.logger.error(error.response.data);
                throw 'An error happened!';
              }),
            ),
        ),
      ),
    );

    coinsDetails.forEach(({ data: coinDetail }, index) =>
      this.coinHistoryModel.create({
        code: coins[index].code,
        exchanges: coinDetail.exchanges,
        markets: coinDetail.markets,
        pairs: coinDetail.pairs,
        allTimeHighUSD: coinDetail.allTimeHighUSD,
        circulatingSupply: coinDetail.circulatingSupply,
        totalSupply: coinDetail.totalSupply,
        maxSupply: coinDetail.maxSupply,
        rate: coinDetail.rate,
        volume: coinDetail.volume,
        cap: coinDetail.cap,
        delta: coinDetail.delta,
        createdAt: new Date(),
      }),
    );

    this.logger.log('Completed populating coins history!!!');
  }

  getAllCoins(): Promise<CoinDocument[]> {
    return this.coinModel.find<CoinDocument>();
  }

  getCoinHistory(code: string): Promise<CoinDocument[]> {
    return this.coinHistoryModel
      .find<CoinDocument>({ code: code.toUpperCase() })
      .sort({ createdAt: -1 })
      .limit(20);
  }
}
