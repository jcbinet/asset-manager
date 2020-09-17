import { BaseError } from '@/errors/base.error';

export class DuplicateAssetNameError extends BaseError {

  constructor(name: string) {
    super(`Asset with name: ${name} already exists`, 'asset/duplicate-name');
  }

}
