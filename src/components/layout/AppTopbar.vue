<template>
  <header :class="$style.topbar">
    <BaseButton
      :class="$style.menuButton"
      variant="ghost"
      size="md"
      icon-only
      aria-label="메뉴 열기"
      @click="toggleSidebar"
    >
      <BaseIcon name="menu" :size="20" />
    </BaseButton>

    <form :class="$style.search" role="search" @submit.prevent="submitSearch">
      <BaseInput
        v-model="query"
        type="search"
        placeholder="템플릿, 태그, 설명 통합 검색..."
        aria-label="통합 검색"
      >
        <template #left>
          <BaseIcon name="search" :size="16" />
        </template>
      </BaseInput>
    </form>

    <div :class="$style.actions">
      <!-- 주요 액션은 각 화면에서 확장 -->
    </div>
  </header>
</template>

<script>
import { mapActions } from 'vuex';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseIcon from '@/components/common/BaseIcon.vue';

export default {
  name: 'AppTopbar',
  components: { BaseButton, BaseInput, BaseIcon },
  data() {
    return { query: '' };
  },
  methods: {
    ...mapActions('ui', ['toggleSidebar']),
    submitSearch() {
      const q = this.query.trim();
      if (q) this.$router.push({ path: '/search', query: { q } });
    },
  },
};
</script>

<style module>
.topbar {
  position: sticky;
  top: 0;
  z-index: var(--z-topbar);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  height: var(--topbar-height);
  padding: 0 var(--space-6);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
  border-bottom: 1px solid var(--border-subtle);
}
.menuButton {
  display: none;
}
.search {
  flex: 1;
  max-width: 520px;
}
.actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-left: auto;
}
@media (max-width: 960px) {
  .menuButton {
    display: inline-flex;
  }
  .topbar {
    padding: 0 var(--space-4);
  }
}
</style>
