<template>
  <div>
    <div
      :class="[$style.backdrop, sidebarOpen && $style.backdropVisible]"
      aria-hidden="true"
      @click="setSidebar(false)"
    />
    <aside :class="[$style.sidebar, sidebarOpen && $style.open]" aria-label="주요 메뉴">
      <div :class="$style.brand">
        <span :class="$style.brandIcon">
          <BaseIcon name="library" :size="20" />
        </span>
        <span :class="$style.brandText">
          Publishing<span :class="$style.brandAccent">Library</span>
        </span>
      </div>

      <nav :class="$style.nav">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="$style.navItem"
          :active-class="$style.navItemActive"
          :exact="item.to === '/'"
          @click.native="setSidebar(false)"
        >
          <BaseIcon :name="item.icon" :size="18" :class="$style.navIcon" />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <div :class="$style.footer">
        <span :class="$style.footerText">Local-first · v0.1.0</span>
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

<style module>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  z-index: var(--z-sidebar);
  display: flex;
  flex-direction: column;
  background: var(--gradient-sidebar);
  color: var(--color-neutral-300);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}
.brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  height: var(--topbar-height);
  padding: 0 var(--space-5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.brandIcon {
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
.brandText {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-inverse);
  letter-spacing: -0.01em;
}
.brandAccent {
  color: var(--color-brand-300);
}
.nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-4) var(--space-3);
  overflow-y: auto;
}
.navItem {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-neutral-400);
  transition: background var(--transition-fast), color var(--transition-fast),
    transform var(--transition-fast);
}
.navItem:hover {
  background: rgba(255, 255, 255, 0.07);
  color: var(--text-inverse);
}
.navItem:active {
  transform: scale(0.98);
}
.navItemActive {
  background: var(--gradient-brand);
  color: var(--text-inverse);
  box-shadow: var(--shadow-brand);
}
.navItemActive::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  border-radius: var(--radius-full);
  background: var(--color-brand-300);
}
.navItemActive:hover {
  background: var(--gradient-brand);
  color: var(--text-inverse);
}
.navIcon {
  flex-shrink: 0;
}
.footer {
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.footerText {
  font-size: var(--font-size-xs);
  color: var(--color-neutral-500);
}
.backdrop {
  display: none;
}

@media (max-width: 960px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform var(--transition-base);
    box-shadow: var(--shadow-xl);
  }
  .open {
    transform: translateX(0);
  }
  .backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: calc(var(--z-sidebar) - 1);
    background: var(--surface-overlay);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition-base);
  }
  .backdropVisible {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
