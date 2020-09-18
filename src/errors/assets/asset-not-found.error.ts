import { BaseError } from '@/errors/base.error';

export class AssetNotFoundError extends BaseError {

  constructor(uuid: string) {
    super(`Asset with uuid: ${uuid} does not exists`, 'asset/not-found');
  }

}
