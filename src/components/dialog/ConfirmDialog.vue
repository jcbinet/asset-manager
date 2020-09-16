<template>
  <base-dialog
    :title="title"
    :width="300"
    :remove-close-btn="true"
  >

    <template v-slot:activator="{ on, attrs }">

      <slot name="activator" :on="on" :attrs="attrs"></slot>

    </template>

    <template v-slot:content>

      <slot name="message"></slot>

    </template>

    <template v-slot:actions="{ close }">

      <v-spacer></v-spacer>
      <v-btn class="mr-4" text color="warning" @click="close">Cancel</v-btn>
      <v-btn class="mr-4" text color="primary" @click="confirmed(close)">Confirm</v-btn>

    </template>

  </base-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import BaseDialog from '@/components/dialog/BaseDialog.vue';

@Component({
  components: { BaseDialog }
})
export default class ConfirmDialog extends Vue {

  /**
   * Props
   */

  @Prop() readonly title!: string;

  /**
   * Emitters
   */

  @Emit()
  confirmed(dialogClose: Function): Function {
    return dialogClose;
  }
}
</script>

<style>

</style>
