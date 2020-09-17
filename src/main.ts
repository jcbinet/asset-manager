import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import '@babel/polyfill';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@fortawesome/fontawesome-free/css/all.css';
import router from '@/router';
import store from '@/store';

Vue.config.productionTip = false;

// Stylesheets
import '@/styles/reset.css';
import '@/styles/global.css';

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
