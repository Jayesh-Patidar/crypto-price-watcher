import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CoinService } from './services';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
  });

  const config = app.get(ConfigService, { strict: false });

  const coinService = app.get(CoinService);

  await coinService.populateCoins();

  await app.listen(config.get('app.port'));
}
bootstrap();
