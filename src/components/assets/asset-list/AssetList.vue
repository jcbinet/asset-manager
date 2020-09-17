<template>
  <v-row>
    <v-col v-for="asset in assets" :key="asset.name" class="flex-grow-0">
      <v-lazy
        :options="{
          threshold: .5
        }"
      >
        <v-card
          class="mx-auto"
          width="300"
        >

          <img
            v-if="asset.thumbnail"
            class="thumbnail-img"
            :src="`safe-file-protocol://${asset.thumbnail.path}`"
            :alt="`${asset.name}`"
          />
          <v-img
            v-else
            class="thumbnail-img"
            src="@/assets/default-thumbnail.png"
            :alt="`${asset.name}`"
          />

          <v-card-title>
            {{ asset.name }}
          </v-card-title>

          <v-card-subtitle>
            TAGS
          </v-card-subtitle>

          <v-card-actions>
            <v-btn text>Export</v-btn>

            <asset-import edit-mode :edit-asset="asset">
              <template v-slot:activator="{ on: dialog, attrs }">
                <v-btn
                  color="primary"
                  text
                  v-bind="attrs"
                  v-on="dialog"
                >
                  Edit
                </v-btn>
              </template>
            </asset-import>

            <v-spacer/>

            <confirm-dialog
              title="Delete Asset"
              @confirmed="onAssetDeleteConfirm(asset.uuid, $event)"
            >
              <template v-slot:activator="{ on: dialog }">
                <v-tooltip left>
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn
                      icon
                      color="secondary"
                      v-on="{ ...tooltip, ...dialog }"
                    >
                      <v-icon size="20">fas fa-trash-alt</v-icon>
                    </v-btn>
                  </template>
                  <span>Delete asset</span>
                </v-tooltip>
              </template>

              <template v-slot:message>
                Do you really want to remove the asset
                <strong class="font-weight-bold font-italic">{{ asset.name }}</strong>
                ?
              </template>
            </confirm-dialog>
          </v-card-actions>
        </v-card>
      </v-lazy>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { assetModule } from '@/store/modules/asset';
import { errorModule } from '@/store/modules/error';
import AssetImport from '@/components/assets/asset-import/AssetImportDialog.vue';
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue';

@Component({
  components: { ConfirmDialog, AssetImport }
})
export default class AssetList extends Vue {

  /**
   * Vuex Computed
   */

  get assets() {
    return assetModule.getAssets;
  }

  /**
   * Methods
   */

  /**
   * When asset delete is confirmed
   *
   * @param uuid
   * @param dialogClose
   */
  async onAssetDeleteConfirm(uuid: string, dialogClose: Function) {

    try {

      // Mutate assets in store
      await assetModule.deleteAsset(uuid);

      dialogClose();
    }
    catch (error) {
      errorModule.handleError(error);
    }
  }

}
</script>

<style scoped>
.thumbnail-img {
  max-width: 100%;
  height: 150px;
}
</style>
