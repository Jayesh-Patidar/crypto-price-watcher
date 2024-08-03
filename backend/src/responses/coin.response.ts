import { CoinDocument } from 'src/models';

export class CoinResponse {
  constructor(protected coin: CoinDocument) {}

  transform() {
    return {
      ...this.coin.toJSON(),
      id: this.coin.id,
      _id: undefined,
    };
  }
}
