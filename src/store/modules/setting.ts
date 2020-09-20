import { Action, Module, RegisterOptions, VuexModule } from 'vuex-class-modules';
import { exec } from 'child_process';
import fs from 'fs';
import store, { Persister } from '@/store';
import { UeSettings } from '@/shared/setting/interfaces/ue-settings';
import { EngineEnum, UeVersionPluginRepo } from '@/shared/setting/enums/engines';

@Module({ generateMutationSetters: true })
export class SettingModule extends VuexModule {

  private engine: EngineEnum = EngineEnum.UnrealEngine;

  private ueSettings: UeSettings = {
    ueVersion: '',
    uePath: undefined,
    ueProjectPath: undefined,
    ueExportDirectoryName: 'Assets'
  };

  constructor(options: RegisterOptions) {
    super(options);

    this.loadState();
  }

  /**
   * Retrieve and load persisted state when module is registered
   *
   * @private
   */
  private loadState(): void {
    const state = Persister.getPersistedState('setting');

    this.engine = state.engine || this.engine;
    this.ueSettings = state.ueSettings || this.ueSettings;
  }

  // Export engine
  get getEngine(): EngineEnum {
    return this.engine;
  }

  // Unreal engine specific export settings
  get getUnrealEngineSettings(): UeSettings {
    return this.ueSettings;
  }

  /**
   * Update engine used
   *
   * @param engine
   */
  @Action updateEngine(engine: EngineEnum): void {
    this.engine = engine;
  }

  /**
   * Update settings related to unreal engine
   *
   * @param settings
   */
  @Action updateUeSettings(settings: UeSettings): void {
    this.ueSettings = settings;

    if (this.ueSettings.uePath && this.ueSettings.ueVersion) {

      // Validate plugin exists else install it
      if (!this.isPluginInstalled()) {
        const pluginRepo = UeVersionPluginRepo.get(this.ueSettings.ueVersion);

        // Todo: Convert this to a task
        exec(`cd ${this.ueSettings.uePath} && git clone ${pluginRepo} AssetManager`, (error, stdout, stderr) => {
          if (error) console.log('error', error);
          if (stderr) console.log('stderr', stderr);
          if (stdout) console.log('stdout', stdout);
        });
      }
    }
  }

  /**
   * Returns whether plugin is installed
   */
  isPluginInstalled(): boolean {
    return fs.existsSync(`${this.ueSettings.uePath}\\AssetManager`);
  }

}

export const settingModule = new SettingModule({ store: store, name: 'setting' });
