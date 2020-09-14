<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon size="20">fas fa-cube</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Assets</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Asset Manager</v-toolbar-title>
      <v-spacer />
      <setting-dialog>
        <template v-slot:activator="{ on: dialog }">
          <v-tooltip left>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                icon
                height="32"
                width="32"
                v-on="{ ...tooltip, ...dialog }"
              >
                <v-icon size="18" dark>fas fa-cog</v-icon>
              </v-btn>
            </template>
            <span>Settings</span>
          </v-tooltip>
        </template>
      </setting-dialog>
    </v-app-bar>

    <v-main>
      <v-container fluid px-6 py-4>
        <router-view />
      </v-container>
    </v-main>

    <error-snackbar />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SettingDialog from '@/components/app/SettingDialog.vue';
import ErrorSnackbar from '@/components/errors/ErrorSnackbar.vue';

@Component({
  components: { ErrorSnackbar, SettingDialog }
})
export default class App extends Vue {

  drawer: boolean = false;

  created() {
    this.$vuetify.theme.dark = true;
  }
}
</script>

<style>

</style>
