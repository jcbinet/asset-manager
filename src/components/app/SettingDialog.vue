<template>
  <base-dialog
    title="Settings"
  >

    <template v-slot:activator="{ on, attrs }">

      <slot name="activator" :on="on" :attrs="attrs"></slot>

    </template>

    <template v-slot:content>

      <v-tabs vertical>
        <v-tab>
          Export
        </v-tab>
        <v-tab>
          Theme
        </v-tab>

        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <v-select
                :items="exportEngines"
                label="Engine"
                v-model="selectedEngine"
                outlined
                dense
              />

              <template v-if="selectedEngine === 'Unreal Engine'">
                <v-select
                  :items="engineVersions.get(selectedEngine)"
                  label="Engine Version"
                  outlined
                  dense
                />
              </template>

            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>

            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>

    </template>

    <template v-slot:actions="{ close }">

      <v-spacer></v-spacer>
      <v-btn class="mr-4" color="primary" @click="close">Save</v-btn>

    </template>

  </base-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { EngineEnum, Engines, EngineVersions } from '@/shared/setting/enums/engines';
import BaseDialog from '@/components/dialog/BaseDialog.vue';

@Component({
  components: { BaseDialog }
})
export default class SettingDialog extends Vue {

  /**
   * Data
   */

  exportEngines = Engines;
  engineVersions = EngineVersions;
  selectedEngine = EngineEnum.UnrealEngine;

  /**
   * Methods
   */
}
</script>

<style>

</style>
