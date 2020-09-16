<template>
  <v-snackbar outlined color="error" v-model="showSnackbar">
    {{ getErrorText }}

    <template v-slot:action="{ on: snackbar, attrs }">
      <v-btn
        icon
        color="error"
        dark
        v-bind="attrs"
        @click="closeSnackbar"
      >
        <v-icon size="18">fas fa-times</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { errorModule } from '@/store/modules/error';

@Component
export default class ErrorSnackbar extends Vue {

  /**
   * Data
   */

  showSnackbar: boolean = false;

  /**
   * Vuex Computed
   */

  get getErrorText() {
    return errorModule.getErrorMessage;
  }

  get getErrorUuid() {
    return errorModule.getErrorUuid;
  }

  /**
   * Watchers
   */

  @Watch('getErrorUuid')
  onErrorChange() {
    this.showSnackbar = true;
  }


  /**
   * Methods
   */

  closeSnackbar() {
    this.showSnackbar = false;
  }
}
</script>
