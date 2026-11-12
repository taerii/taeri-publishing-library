<template>
  <div>
    <div
      class="sidebar-dim"
      :class="{ on: sidebarOpen }"
      aria-hidden="true"
      @click="setSidebar(false)"
    />
    <aside class="sidebar" :class="{ on: sidebarOpen }" aria-label="주요 메뉴">
      <div class="sidebar-brand">
        <span class="sidebar-logo">
          <BaseIcon name="library" :size="20" />
        </span>
        <span class="sidebar-ttl">
          Publishing<span class="sidebar-accent">Library</span>
        </span>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="sidebar-link"
          active-class="on"
          :exact="item.to === '/'"
          @click.native="setSidebar(false)"
        >
          <BaseIcon :name="item.icon" :size="18" class="sidebar-i" />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="sidebar-foot">
        <span class="sidebar-txt">Local-first · v0.1.0</span>
      </div>
    </aside>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import BaseIcon from '@/components/common/BaseIcon.vue';
import { NAV_ITEMS } from '@/constants/navigation';

export default {
  name: 'AppSidebar',
  components: { BaseIcon },
  data() {
    return { navItems: NAV_ITEMS };
  },
  computed: {
    ...mapState('ui', ['sidebarOpen']),
  },
  methods: {
    ...mapActions('ui', ['setSidebar']),
  },
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  z-index: var(--z-sidebar);
  display: flex;
  flex-direction: column;
  background: var(--surface-sidebar);
  color: var(--text-secondary);
  border-right: 1px solid var(--border-subtle);
}
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  height: var(--topbar-height);
  padding: 0 var(--space-5);
  border-bottom: 1px solid var(--border-subtle);
}
.sidebar-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  background: var(--gradient-brand);
  color: var(--text-inverse);
  box-shadow: var(--shadow-brand);
}
.sidebar-ttl {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  letter-spacing: -0.01em;
}
.sidebar-accent {
  color: var(--color-brand-600);
}
.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-4) var(--space-3);
  overflow-y: auto;
}
.sidebar-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  transition: background var(--transition-fast), color var(--transition-fast),
    transform var(--transition-fast);
}
.sidebar-link:hover {
  background: var(--color-primary-light); /* #FCE8EF */
  color: var(--color-primary-hover); /* #A9365D (글자 + 아이콘) */
}
.sidebar-link:active {
  transform: scale(0.98);
}
/* 선택된 메뉴: 호버해도 핑크 채움 + 흰 글씨 유지 */
.sidebar-link.on,
.sidebar-link.on:hover {
  background: var(--gradient-brand);
  color: var(--text-inverse);
}
.sidebar-link.on {
  box-shadow: var(--shadow-brand);
}
.sidebar-link.on::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  border-radius: var(--radius-full);
  background: var(--color-brand-600);
}
.sidebar-i {
  flex-shrink: 0;
}
.sidebar-foot {
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--border-subtle);
}
.sidebar-txt {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}
.sidebar-dim {
  display: none;
}

@media (max-width: 960px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform var(--transition-base);
    box-shadow: var(--shadow-xl);
  }
  .sidebar.on {
    transform: translateX(0);
  }
  .sidebar-dim {
    display: block;
    position: fixed;
    inset: 0;
    z-index: calc(var(--z-sidebar) - 1);
    background: var(--surface-overlay);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition-base);
  }
  .sidebar-dim.on {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
