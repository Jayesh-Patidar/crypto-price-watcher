import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configs from './configs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { CoinService } from './services';
import { Coin, CoinHistory, CoinHistorySchema, CoinSchema } from './models';
import { ScheduleModule } from '@nestjs/schedule';
import { CoinController } from './controllers';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: configs,
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        baseURL: config.get<string>('services.liveCoinWatch.url', ''),
        headers: {
          'content-type': 'application/json',
          'x-api-key': config.get<string>('services.liveCoinWatch.apiKey', ''),
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Coin.name, schema: CoinSchema },
      { name: CoinHistory.name, schema: CoinHistorySchema },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, CoinController],
  providers: [AppService, CoinService],
})
export class AppModule {}
