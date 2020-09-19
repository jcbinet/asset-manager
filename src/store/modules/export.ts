import { Action, Module, RegisterOptions, VuexModule } from 'vuex-class-modules';
import store from '@/store';
import { Asset } from '@/shared/asset/interfaces/asset';
import path from 'path';
import { app, remote } from 'electron';
import fs from 'fs';
import { spawn } from 'child_process';
import { AssetExportTimeoutError } from '@/errors/assets/asset-export-timeout.error';
import { settingModule } from '@/store/modules/setting';
import { EngineEnum } from '@/shared/setting/enums/engines';

@Module({ generateMutationSetters: true })
export class ExportModule extends VuexModule {

  constructor(options: RegisterOptions) {
    super(options);

    this.createExportStateIfNotExisting();
  }

  // Get path of state used for asset importer plugins
  get getExportStatePath(): string {
    return path.join((app || remote.app).getPath('userData'), 'export-state.json');
  }

  /**
   * Add an asset for export
   *
   * @param asset
   */
  @Action async exportAsset(asset: Asset): Promise<void> {

    // Write asset to export state
    fs.writeFileSync(this.getExportStatePath, JSON.stringify(asset), 'utf8');

    if (settingModule.getEngine === EngineEnum.UnrealEngine) {
      await this.runRemoteUeImportScript(asset.name);
    }
    else {
      // Todo: throw an error for unset settings
    }
  }

  /**
   * Launch remote import script in unreal engine
   *
   * Unreal Engine should be open with remote execution turned on
   * (Project Settings -> Plugins -> Python -> Remote Execution)
   *
   * @private
   */
  private async runRemoteUeImportScript(assetName: string): Promise<void> {

    return new Promise((resolve, reject) => {

      // Run local python script to launch import inside unreal plugin
      const python = spawn('python', ['./src/python/ue_launch_import.py']);

      // Python stderr
      python.stderr.on('data', (data) => {
        console.log('error', data.toString());

        if (data.toString().includes('most likely raised during interpreter shutdown')) resolve();
        else {
          console.log('error', data.toString());
        }
        // Todo: catch error when unreal is not opened

        // Todo: catch error when unreal remote execution is not enabled

        // Todo: throw exception for all other cases
      });

      // Python exit
      python.on('exit', (code) => {
        if (code === 0) resolve();
        else reject();
      });

      // Python close
      python.on('close', (code) => {
        if (code === 0) resolve();
        else reject();
      });


      // Set up a timeout after 20 seconds
      setTimeout(() => {
        reject(new AssetExportTimeoutError(assetName, settingModule.getEngine));
      }, 20000);
    });
  }

  /**
   * Run a check to create thumbnail directory if it does not exist
   *
   * @private
   */
  private createExportStateIfNotExisting(): void {

    if (!fs.existsSync(this.getExportStatePath)) {
      fs.writeFileSync(this.getExportStatePath, JSON.stringify({}));
    }
  }

}

export const exportModule = new ExportModule({ store: store, name: 'export' });
