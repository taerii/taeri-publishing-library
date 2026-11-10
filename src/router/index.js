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
  mode: 'history',
  routes,
  linkActiveClass: 'router-link-active',
});
