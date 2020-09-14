import { AssetFile } from '@/shared/asset/interfaces/asset-file';

/**
 * Asset interface
 */
export interface Asset {
  uuid: string;
  name: string;
  model?: AssetFile;
  albedo?: AssetFile;
  metalness?: AssetFile;
  roughness?: AssetFile;
  normal?: AssetFile;
  thumbnail?: AssetFile; // Asset file when saved, base64 string in forms
  newThumbnailData: string;
}
