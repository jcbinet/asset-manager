import { Module, VuexModule, Action, RegisterOptions } from 'vuex-class-modules';
import path from 'path';
import { app, remote } from 'electron';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import store, { Persister } from '@/store';
import { Asset } from '@/shared/asset/interfaces/asset';
import { DuplicateAssetNameError } from '@/errors/assets/duplicate-asset-name.error';
import { AssetNotFoundError } from '@/errors/assets/asset-not-found.error';

@Module({ generateMutationSetters: true })
export class AssetModule extends VuexModule {

  private assets: Asset[] = [];

  constructor(options: RegisterOptions) {
    super(options);

    this.loadState();
  }

  /*
   * Retrieve and load persisted state when module is registered
   */
  loadState() {
    const state = Persister.getPersistedState('asset') || { assets: [] };
    this.assets = state.assets;
  }


  // Get asset
  get getAssets(): Asset[] {
    return this.assets;
  }

  // Get path used for asset thumbnails
  get getAssetThumbnailPath(): string {
    return path.join((app || remote.app).getPath('userData'), 'thumbnails')
  }

  /**
   * Add a new asset
   * - Validates duplicate asset name
   * - Generates uuid
   * - Saves thumbnail if defined
   * - Mutate asset array
   *
   * @param asset
   */
  @Action async addAsset(asset: Asset): Promise<void> {

    this.validateDuplicateAssetName(this.assets, asset);

    asset.uuid = uuid();

    if (asset.newThumbnailData) {
      this.saveAssetThumbnail(asset);
    }

    this.assets = [...this.assets, asset];
  }

  /**
   * Update an asset
   * - Validates duplicate asset name
   * - Validates asset exists
   * - Saves thumbnail if defined
   * - Mutate asset array
   *
   * @param asset
   */
  @Action async updateAsset(asset: Asset): Promise<void> {

    this.validateDuplicateAssetName(this.assets, asset);

    const assetToUpdate = this.assets.find(a => a.uuid === asset.uuid);

    if (!assetToUpdate) {
      throw new AssetNotFoundError(asset.uuid);
    }

    if (asset.newThumbnailData) {
      this.saveAssetThumbnail(asset);
    }

    this.assets = [...this.assets.filter(a => a.uuid !== asset.uuid), asset];
  }

  /**
   * Delete an asset
   * - Validates asset exists
   * - Mutate asset array
   *
   * @param uuid
   */
  @Action async deleteAsset(uuid: string): Promise<void> {

    const assetToUpdate = this.assets.find(a => a.uuid === uuid);

    if (!assetToUpdate) {
      throw new AssetNotFoundError(uuid);
    }

    this.assets = this.assets.filter(a => a.uuid !== uuid);
  }

  /**
   * Validate if there is already an asset with same name
   *
   * @param assets
   * @param asset
   */
  validateDuplicateAssetName(assets: Asset[], asset: Asset): void {

    assets.find((a: Asset) => {
      if (asset.name === a.name && asset.uuid !== a.uuid) {
        throw new DuplicateAssetNameError(asset.name);
      }
    });
  }

  /**
   * Save asset thumbnail to file
   *
   * @param asset
   */
  saveAssetThumbnail(asset: Asset): void {

    // Remove previous thumbnail if it exists
    if (asset.thumbnail) {
      fs.unlinkSync(asset.thumbnail.path);
    }

    // Save new thumbnail
    const date = new Date();
    const filename = `${uuid()}.png`;
    const filepath = path.join(this.getAssetThumbnailPath, filename);

    const buffer = new Buffer((asset.newThumbnailData).replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const filesize = buffer.length;

    fs.writeFileSync(filepath, buffer);

    asset.newThumbnailData = '';
    asset.thumbnail = {
      lastModified: date.getTime(),
      lastModifiedDate: date,
      name: filename,
      path: filepath,
      size: filesize,
      type: 'image/png',
      webkitRelativePath: ''
    };
  }
}

export const assetModule = new AssetModule({ store: store, name: 'asset' })
