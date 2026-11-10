import Vue from 'vue';
import VueRouter from 'vue-router';
import AppShell from '@/components/layout/AppShell.vue';
import DashboardView from '@/views/DashboardView.vue';
import ComponentsView from '@/views/ComponentsView.vue';
import PageTemplatesView from '@/views/PageTemplatesView.vue';
import SnippetsView from '@/views/SnippetsView.vue';
import FavoritesView from '@/views/FavoritesView.vue';
import CategoriesView from '@/views/CategoriesView.vue';
import SettingsView from '@/views/SettingsView.vue';
import SearchView from '@/views/SearchView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: AppShell,
    children: [
      { path: '', name: 'dashboard', component: DashboardView },
      { path: 'components', name: 'components', component: ComponentsView },
      { path: 'pages', name: 'pages', component: PageTemplatesView },
      { path: 'snippets', name: 'snippets', component: SnippetsView },
      { path: 'favorites', name: 'favorites', component: FavoritesView },
      { path: 'categories', name: 'categories', component: CategoriesView },
      { path: 'settings', name: 'settings', component: SettingsView },
      { path: 'search', name: 'search', component: SearchView },
      { path: '*', name: 'not-found', component: NotFoundView },
    ],
  },
];

export default new VueRouter({
  // GitHub Pages 는 서버 라우팅이 없어 history 모드는 새로고침 시 404 가 난다.
  // hash 모드(/#/components)는 정적 호스팅에서도 새로고침/직접 접근이 동작한다.
  mode: 'hash',
  routes,
  linkActiveClass: 'router-link-active',
});
