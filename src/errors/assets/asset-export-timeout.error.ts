import { BaseError } from '@/errors/base.error';

export class AssetExportTimeoutError extends BaseError {

  constructor(name: string, engine: string) {
    super(`Export of asset ${name} to ${engine} timed out`, 'asset/export-timeout');
  }

}
