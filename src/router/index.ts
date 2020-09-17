import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Assets from '@/views/Assets.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Assets',
    component: Assets
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
