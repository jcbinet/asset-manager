import Vue from 'vue';
import Vuex from 'vuex';
import { Persist } from '@/store/plugins/persist';
import { AssetModule } from '@/store/modules/asset';

Vue.use(Vuex);

interface StoreType {
  asset: AssetModule;
}

export const Persister = new Persist<StoreType>();

export default new Vuex.Store({
  plugins: [ Persister.plugin ]
});
