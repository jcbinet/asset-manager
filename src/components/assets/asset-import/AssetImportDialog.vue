<template>
  <base-dialog
    :title="titleText"
    @dialog-changed="onDialogChange"
  >
    <template v-slot:activator="{ on, attrs }">

      <slot name="activator" :on="on" :attrs="attrs"></slot>

    </template>

    <template v-slot:content>

      <asset-preview-scene
        ref="preview-scene"
        :asset="asset"
      />

      <v-form ref="form" v-model="formValid">
        <v-chip
          class="mt-4 mb-6"
          label
          :color="asset.newThumbnailData || asset.thumbnail ? 'dark-green' : 'light-blue'"
          @click="captureThumbnail"
        >
          <template>
            <v-icon size="16">fas fa-camera</v-icon>
            <span class="ml-2">
              {{ asset.newThumbnailData || asset.thumbnail ? 'Recapture thumbnail' : 'Capture thumbnail' }}
            </span>
          </template>
        </v-chip>

        <v-text-field
          v-model="asset.name"
          required outlined dense
          label="Name"
          :rules="[
            v => !!v || 'Name is required'
          ]"
        />
        <v-file-input
          v-model="asset.model"
          required outlined dense
          prepend-icon="" label="3D Model" accept=".fbx"
          :rules="[
            v => !!v || '3D Model is required'
          ]"
        />
        <v-file-input
          v-model="asset.albedo"
          required outlined dense
          prepend-icon="" label="Albedo" accept=".png,.jpg,.jpeg"
          :rules="[
            v => !!v || 'Albedo Texture is required'
          ]"
        />
        <v-file-input
          v-model="asset.metalness"
          required outlined dense
          prepend-icon="" label="Metalness" accept=".png,.jpg,.jpeg"
          :rules="[
            v => !!v || 'Metalness Texture is required'
          ]"
        />
        <v-file-input
          v-model="asset.roughness"
          required outlined dense
          prepend-icon="" label="Roughness" accept=".png,.jpg,.jpeg"
          :rules="[
            v => !!v || 'Roughness Texture is required'
          ]"
        />
        <v-file-input
          v-model="asset.normal"
          required outlined dense
          prepend-icon="" label="Normal" accept=".png,.jpg,.jpeg"
          :rules="[
            v => !!v || 'Normal Texture is required'
          ]"
        />
      </v-form>

    </template>

    <template v-slot:actions="{ close }">

      <v-spacer></v-spacer>
      <v-btn class="mr-4" color="primary" @click="formSubmit(close)">{{ actionText }}</v-btn>

    </template>

  </base-dialog>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
import { assetModule } from '@/store/modules/asset';
import { errorModule } from '@/store/modules/error';
import { Asset } from '@/shared/asset/interfaces/asset';
import { AssetFile } from '@/shared/asset/interfaces/asset-file';
import AssetPreviewScene from '@/components/assets/asset-preview-scene/AssetPreviewScene.vue';
import BaseDialog from '@/components/dialog/BaseDialog.vue';

@Component({
  components: { BaseDialog, AssetPreviewScene }
})
export default class AssetImport extends Vue {

  /**
   * Refs
   */

  @Ref('form') readonly form!: HTMLFormElement;
  @Ref('preview-scene') readonly previewScene!: AssetPreviewScene;

  /**
   * Props
   */

  @Prop({ type: Boolean, default: false }) readonly editMode!: boolean;
  @Prop() readonly editAsset!: Asset;

  /**
   * Data
   */

  // Form validity state
  formValid: boolean = true;

  // Asset model
  asset: Asset = {
    uuid: '',
    name: '',
    model: undefined,
    albedo: undefined,
    metalness: undefined,
    roughness: undefined,
    normal: undefined,
    thumbnail: undefined,
    newThumbnailData: ''
  };

  /**
   * Computed
   */

  get titleText(): string {
    return this.editMode ? 'Edit asset' : 'Import asset';
  }

  get actionText(): string {
    return this.editMode ? 'Save' : 'Import';
  }

  /**
   * Methods
   */

  /**
   * Capture thumbnail from asset preview scene
   */
  captureThumbnail() {
    this.asset.newThumbnailData = this.previewScene.getCurrentRenderImage();
  }

  /**
   * Reset the form
   */
  formReset(): void {
    this.form.reset();
    this.asset.uuid = '';
    this.asset.thumbnail = undefined;
    this.asset.newThumbnailData = '';
  }

  /**
   * When form is submitted
   *
   * @param dialogClose
   */
  async formSubmit(dialogClose: Function): Promise<void> {

    if (this.form.validate()) {
      try {

        // Convert files to custom object
        const asset = {
          uuid: this.asset.uuid,
          name: this.asset.name!,
          model: this.convertFile(this.asset.model!),
          albedo: this.convertFile(this.asset.albedo!),
          metalness: this.convertFile(this.asset.metalness!),
          roughness: this.convertFile(this.asset.roughness!),
          normal: this.convertFile(this.asset.normal!),
          thumbnail: this.asset.thumbnail,
          newThumbnailData: this.asset.newThumbnailData
        };

        this.editMode ? await assetModule.updateAsset(asset) : await assetModule.addAsset(asset);

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

    if (!open) return;

    this.$nextTick(() => {
      this.formReset();
      this.previewScene.resetScene();

      this.$nextTick(() => {

        if (this.editMode) {
          this.asset = { ...this.editAsset };
        }
      });
    });
  }

  /**
   * Convert file to custom object since File type cannot be serialized
   *
   * @param file
   */
  convertFile(file: AssetFile): AssetFile {
    return {
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      name: file.name,
      path: file.path,
      size: file.size,
      type: file.type,
      webkitRelativePath: file.webkitRelativePath
    };
  }

}
</script>

<style>

</style>
