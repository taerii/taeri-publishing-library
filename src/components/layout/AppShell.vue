<template>
  <div class="shell">
    <AppSidebar />
    <div class="shell-wrap">
      <AppTopbar />
      <main class="shell-cont">
        <router-view />
      </main>
    </div>
    <ToastHost />
  </div>
</template>

<script>
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';
import ToastHost from '@/components/common/ToastHost.vue';

export default {
  name: 'AppShell',
  components: { AppSidebar, AppTopbar, ToastHost },
};
</script>

<style scoped>
.shell {
  min-height: 100%;
}
.shell-wrap {
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left var(--transition-base);
}
.shell-cont {
  flex: 1;
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}
@media (max-width: 960px) {
  .shell-wrap {
    margin-left: 0;
  }
  .shell-cont {
    padding: var(--space-6) var(--space-4);
  }
}
</style>
