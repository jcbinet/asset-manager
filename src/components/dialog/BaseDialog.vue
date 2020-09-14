<template>
  <v-dialog v-model="dialog" persistent max-width="600px">

    <!-- Activator slot -->
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>

    <v-card>
      <!-- Dialog title & close button -->
      <v-card-title>
        <div class="text-h6">{{ title }}</div>
        <v-spacer/>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              @click="closeDialog"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon dark>fas fa-times</v-icon>
            </v-btn>
          </template>
          <span>Close</span>
        </v-tooltip>
      </v-card-title>

      <!-- Dialog content || form -->
      <v-card-text class="base-dialog-content">
        <slot name="content"></slot>
      </v-card-text>

      <!-- Dialog actions -->
      <v-card-actions>
        <slot name="actions" :close="closeDialog"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class BaseDialog extends Vue {

  /**
   * Props
   */
  @Prop() readonly title!: string;

  /**
   * Data
   */

  // Dialog state
  dialog: boolean = false;

  /**
   * Hooks
   */
  @Emit()
  dialogChanged(dialog: boolean): boolean {
    return dialog;
  }

  /**
   * Watchers
   */

  @Watch('dialog')
  onDialogChange(open: boolean) {
    this.dialogChanged(open);
  }

  /**
   * Methods
   */

  /**
   * Close the dialog
   */
  closeDialog(): void {
    this.dialog = false;
  }
}
</script>

<style>
.v-dialog {
  overflow-y: hidden;
}
</style>
