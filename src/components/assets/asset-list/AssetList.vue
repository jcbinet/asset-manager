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
            class="thumbnail-img"
            :src="`safe-file-protocol://${asset.thumbnail.path}`"
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

          </v-card-actions>
        </v-card>
      </v-lazy>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { assetModule } from '@/store/modules/asset';
import AssetImport from '@/components/assets/asset-import/AssetImportDialog.vue';

@Component({
  components: { AssetImport }
})
export default class AssetList extends Vue {

  /**
   * Computed
   */
  get assets() {
    return assetModule.getAssets;
  }

}
</script>

<style scoped>
.thumbnail-img {
  max-width: 100%;
}
</style>
