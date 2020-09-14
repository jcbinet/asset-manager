import { Action, Module, RegisterOptions, VuexModule } from 'vuex-class-modules';
import store, { Persister } from '@/store';
import { UeSettings } from '@/shared/setting/interfaces/ue-settings';
import { EngineEnum } from '@/shared/setting/enums/engines';

@Module({ generateMutationSetters: true })
export class SettingModule extends VuexModule {

  private engine: EngineEnum = EngineEnum.UnrealEngine;

  ueSettings: UeSettings = {
    ueVersion: '',
    uePath: '',
    ueProjectPath: '',
    ueExportDirectoryName: 'Assets'
  }

  constructor(options: RegisterOptions) {
    super(options);

    this.loadState();
  }

  /*
   * Retrieve and load persisted state when module is registered
   */
  loadState() {
    const state = Persister.getPersistedState('setting');

    this.ueSettings = state.ueSettings;
  }

  /**
   * Update settings related to unreal engine
   *
   * @param settings
   */
  @Action updateUeSettings(settings: UeSettings) {
    this.ueSettings = settings;
  }

}

export const assetModule = new SettingModule({ store: store, name: 'setting' })
