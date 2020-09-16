<template>
  <base-dialog
    title="Settings"
    @dialog-changed="onDialogChange"
  >

    <template v-slot:activator="{ on, attrs }">

      <slot name="activator" :on="on" :attrs="attrs"></slot>

    </template>

    <template v-slot:content>

      <v-tabs vertical>
        <v-tab>
          Export
        </v-tab>

        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <v-form ref="form" v-model="formValid">
                <v-select
                  :items="exportEngines"
                  v-model="engine"
                  label="Engine"
                  outlined
                  dense
                />

                <template v-if="isUnrealEngine">
                  <v-select
                    :items="engineVersions.get(engine)"
                    v-model="ueSettings.ueVersion"
                    label="Engine Version"
                    outlined
                    dense
                  />

                  <v-text-field
                    :value="ueSettings.uePath"
                    required outlined dense
                    @keydown.enter="getUeFolderPath('uePath')"
                    @click.prevent="getUeFolderPath('uePath')"
                    label="Installation Folder"
                    :rules="[
                      v => !!v || 'Installation Folder is required'
                    ]"
                  />

                  <v-text-field
                    :value="ueSettings.ueProjectPath"
                    required outlined dense
                    @click.prevent="getUeFolderPath('ueProjectPath')"
                    label="Project Location"
                    :rules="[
                      v => !!v || 'Project Location is required'
                    ]"
                  />

                  <v-text-field
                    v-model="ueSettings.ueExportDirectoryName"
                    required outlined dense
                    label="Directory Name"
                    :rules="[
                      v => !!v || 'Directory Name is required'
                    ]"
                  />
                </template>
              </v-form>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>

    </template>

    <template v-slot:actions="{ close }">

      <v-spacer></v-spacer>
      <v-btn class="mr-4" color="primary" @click="formSubmit(close)">Save</v-btn>

    </template>

  </base-dialog>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import { remote } from 'electron';
import { EngineEnum, Engines, EngineVersions } from '@/shared/setting/enums/engines';
import BaseDialog from '@/components/dialog/BaseDialog.vue';
import { settingModule } from '@/store/modules/setting';
import { errorModule } from '@/store/modules/error';

@Component({
  components: { BaseDialog }
})
export default class SettingDialog extends Vue {

  /**
   * Refs
   */

  @Ref('form') readonly form!: HTMLFormElement;

  /**
   * Data
   */

  // Form validity state
  formValid: boolean = true;

  exportEngines = Engines;
  engineVersions = EngineVersions;
  engine = settingModule.getEngine;
  ueSettings = { ...settingModule.getUnrealEngineSettings };

  /**
   * Computed
   */

  isUnrealEngine() {
    return this.engine = EngineEnum.UnrealEngine;
  }


  /**
   * Methods
   */

  /**
   * Display directory dialog from electron to retrieve directory path
   *
   * @param property
   */
  async getUeFolderPath(property: string): Promise<void> {

    const pathArray = await remote.dialog.showOpenDialog({ properties: ['openDirectory'] });
    const directoryPath = pathArray.filePaths[0];

    if (directoryPath) {
      this.$set(this.ueSettings, property, directoryPath);
    }
  }

  /**
   * Reset the form
   */
  formReset(): void {

    this.$set(this, 'engine', settingModule.getEngine);
    this.$set(this, 'ueSettings', { ...settingModule.getUnrealEngineSettings });
  }

  /**
   * When form is submitted
   *
   * @param dialogClose
   */
  async formSubmit(dialogClose: Function): Promise<void> {

    if (this.form.validate()) {
      try {

        // Mutate settings in store
        settingModule.updateEngine(this.engine);
        settingModule.updateUeSettings(this.ueSettings);

        dialogClose();
      }
      catch (error) {
        errorModule.handleError(error);
      }
    }
  }

  /**
   * When dialog is opened/closed
   *
   * @param open
   */
  onDialogChange(open: boolean) {

    if (!open) {
      this.formReset();
    }
  }
}
</script>

<style>

</style>
