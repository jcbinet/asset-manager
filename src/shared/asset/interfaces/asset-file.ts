/**
 * Asset file interface
 *
 * Since native File object cannot be serialized,
 * we cast to this interface to be able to do so
 */
export interface AssetFile {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  path: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}
