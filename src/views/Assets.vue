<template>
  <v-container fluid>
    <v-row>
      <v-col class="flex-grow-0">
        <div class="text-h6">ASSETS</div>
      </v-col>
      <v-col class="flex-grow-0">
        <asset-import>
          <template v-slot:activator="{ on: dialog }">
            <v-tooltip right>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn
                  icon
                  color="primary"
                  v-on="{ ...tooltip, ...dialog }"
                >
                  <v-icon size="28" dark>far fa-plus-square</v-icon>
                </v-btn>
              </template>
              <span>Import asset</span>
            </v-tooltip>
          </template>
        </asset-import>
      </v-col>
      <v-spacer />
    </v-row>
    <asset-list/>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AssetImport from '@/components/assets/asset-import/AssetImportDialog.vue';
import AssetList from '@/components/assets/asset-list/AssetList.vue';

@Component({
  components: { AssetList, AssetImport }
})
export default class Assets extends Vue {

  created() { }

}
</script>
