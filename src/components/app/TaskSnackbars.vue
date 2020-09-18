<template>
  <v-layout>
    <v-snackbar
      top
      right
      outlined
      :color="task.complete ? 'success' : 'primary'"
      :timeout="-1"
      v-for="task in tasks"
      :key="task.uuid"
      v-model="task.displaySnackbar"
    >
      <template v-if="!task.complete && !task.error">
        {{ task.message }}

        <v-progress-linear
          :show="true"
          color="primary"
          height="5"
          indeterminate
          striped
        />
      </template>
      <template v-else-if="task.complete">
        {{ task.type }} complete!
      </template>
      <template v-else-if="task.error">
        {{ task.type }} failed!
      </template>

      <template
        v-slot:action=""
        v-if="task.complete"
      >
        <v-icon color="success" size="18">far fa-check-circle</v-icon>
      </template>
    </v-snackbar>
  </v-layout>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { taskModule } from '@/store/modules/task';
import { Task } from '@/shared/task/task';

@Component
export default class TaskSnackbars extends Vue {

  /**
   * Vuex Computed
   */

  get tasks(): Task[] {
    return taskModule.getTasks;
  }

}
</script>
