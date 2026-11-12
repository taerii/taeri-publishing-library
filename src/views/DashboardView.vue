<template>
  <div class="dashboard">
    <PageHeader title="Dashboard" description="등록된 템플릿 현황을 한눈에 확인합니다." />

    <!-- 통계 카드: 클릭하면 해당 메뉴로 이동 -->
    <section class="dashboard-section">
      <div class="dashboard-grp">
        <BaseCard
          v-for="s in stats"
          :key="s.key"
          class="dashboard-box"
          :class="{ 'type-02': s.primary }"
          interactive
          role="link"
          tabindex="0"
          :aria-label="s.label + ' ' + s.value + '개, 이동'"
          @click="$router.push(s.to)"
          @keydown.enter.native="$router.push(s.to)"
        >
          <span class="i i-box"><BaseIcon :name="s.icon" :size="20" /></span>
          <span class="dashboard-info">
            <strong class="dashboard-num">{{ s.value }}</strong>
            <span class="dashboard-txt">{{ s.label }}</span>
          </span>
        </BaseCard>
      </div>
    </section>

    <section class="dashboard-section type-02">
      <div class="dashboard-grp">
        <!-- 최근 템플릿 (등록순 / 수정순 전환) -->
        <BaseCard class="dashboard-box">
          <div class="dashboard-head">
            <h2 class="dashboard-ttl">최근 템플릿</h2>
            <div class="dashboard-seg" role="group" aria-label="정렬 기준">
              <button
                type="button"
                class="dashboard-btn"
                :class="{ on: recentTab === 'created' }"
                :aria-pressed="String(recentTab === 'created')"
                @click="recentTab = 'created'"
              >
                등록순
              </button>
              <button
                type="button"
                class="dashboard-btn"
                :class="{ on: recentTab === 'updated' }"
                :aria-pressed="String(recentTab === 'updated')"
                @click="recentTab = 'updated'"
              >
                수정순
              </button>
            </div>
          </div>

          <!-- 항상 6줄 높이를 차지해서 탭 전환/항목 수와 상관없이 카드 높이가 변하지 않음 -->
          <div class="dashboard-cont">
            <ul v-if="recent.length" class="dashboard-list">
              <li v-for="t in recent" :key="t.id">
                <button type="button" class="dashboard-item" @click="go(t)">
                  <span class="i i-box i-sm">
                    <BaseIcon :name="typeIcon[t.type]" :size="16" />
                  </span>
                  <span class="dashboard-info">
                    <strong class="dashboard-ttl type-02">{{ t.title }}</strong>
                    <span class="dashboard-desc">
                      {{ typeLabel[t.type] }} · {{ categoryMap[t.categoryId] || '미분류' }}
                    </span>
                  </span>
                  <time class="time" :datetime="iso(timeOf(t))">
                    {{ recentTab === 'created' ? '등록' : '수정' }}
                    {{ rel(timeOf(t)) }}
                  </time>
                </button>
              </li>
            </ul>
            <p v-else class="dashboard-empty">{{ recentEmptyText }}</p>
          </div>
        </BaseCard>

        <!-- 자주 사용하는 카테고리 (막대 그래프) -->
        <BaseCard class="dashboard-box">
          <div class="dashboard-head">
            <h2 class="dashboard-ttl">자주 사용하는 카테고리</h2>
          </div>

          <ul v-if="topCategories.length" class="dashboard-list type-02">
            <li v-for="c in topCategories" :key="c.id">
              <div class="dashboard-info type-02">
                <span class="dashboard-txt">{{ c.name }}</span>
                <span class="dashboard-txt type-02">{{ c.count }}</span>
              </div>
              <div class="bar" aria-hidden="true">
                <span class="bar-fill" :style="{ width: barWidth(c.count) + '%' }"></span>
              </div>
            </li>
          </ul>
          <p v-else class="dashboard-empty">사용 중인 카테고리가 없습니다.</p>
        </BaseCard>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PageHeader from '@/components/layout/PageHeader.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import BaseIcon from '@/components/common/BaseIcon.vue';
import { formatRelative } from '@/utils/date';
import { TEMPLATE_TYPES } from '@/constants/templateTypes';

export default {
  name: 'DashboardView',
  components: { PageHeader, BaseCard, BaseIcon },
  data() {
    return {
      recentTab: 'created',
      typeIcon: { component: 'component', page: 'template', snippet: 'code' },
      typeLabel: {
        component: 'UI Component',
        page: 'Page Template',
        snippet: 'Code Snippet',
      },
    };
  },
  computed: {
    ...mapState('data', ['templates']),
    ...mapGetters('data', ['favorites', 'categoryMap', 'categoryCounts']),
    stats() {
      const byType = (type) => this.templates.filter((t) => t.type === type).length;
      return [
        { key: 'all', label: '전체 템플릿', value: this.templates.length, icon: 'dashboard', to: '/search', primary: true },
        { key: 'component', label: 'UI Components', value: byType('component'), icon: 'component', to: '/components' },
        { key: 'page', label: 'Page Templates', value: byType('page'), icon: 'template', to: '/pages' },
        { key: 'snippet', label: 'Code Snippets', value: byType('snippet'), icon: 'code', to: '/snippets' },
        { key: 'fav', label: '즐겨찾기', value: this.favorites.length, icon: 'star', to: '/favorites' },
      ];
    },
    /**
     * 최근 템플릿: 유형(컴포넌트/페이지/스니펫)별로 최신 2개씩 뽑아 섞어서 보여준다.
     * - 등록순: 모든 템플릿 대상, 등록 시각(createdAt) 최신순
     * - 수정순: 등록 이후 실제로 수정된 것만(updatedAt 이 createdAt 보다 1초 넘게 뒤),
     *           수정 시각(updatedAt) 최신순
     * 시각이 같으면 컴포넌트 → 페이지 → 스니펫 순서가 번갈아 유지된다.
     */
    recent() {
      const key = this.recentTab === 'created' ? 'createdAt' : 'updatedAt';
      let pool = this.templates;
      if (this.recentTab === 'updated') {
        pool = pool.filter((t) => t.updatedAt - t.createdAt > 1000);
      }
      const byTimeDesc = (a, b) => b[key] - a[key];
      const PER_TYPE = 2;
      const perType = ['component', 'page', 'snippet'].map((type) =>
        pool.filter((t) => t.type === type).sort(byTimeDesc).slice(0, PER_TYPE)
      );
      const merged = [];
      for (let i = 0; i < PER_TYPE; i += 1) {
        perType.forEach((list) => {
          if (list[i]) merged.push(list[i]);
        });
      }
      return merged.sort(byTimeDesc); // 안정 정렬: 동률이면 번갈아 순서 유지
    },
    recentEmptyText() {
      return this.recentTab === 'updated' && this.templates.length > 0
        ? '아직 수정한 템플릿이 없습니다. 템플릿을 수정하면 여기에 표시돼요.'
        : '아직 등록된 템플릿이 없습니다.';
    },
    topCategories() {
      const counts = this.categoryCounts;
      return Object.keys(counts)
        .map((id) => ({ id, name: this.categoryMap[id] || '미분류', count: counts[id] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);
    },
    maxCount() {
      return Math.max(1, ...this.topCategories.map((c) => c.count));
    },
  },
  methods: {
    rel(ts) {
      return formatRelative(ts);
    },
    /** 현재 탭 기준 시각 (등록순: 등록 시각, 수정순: 수정 시각) */
    timeOf(t) {
      return this.recentTab === 'created' ? t.createdAt : t.updatedAt;
    },
    iso(ts) {
      return new Date(ts).toISOString();
    },
    go(t) {
      this.$router.push(TEMPLATE_TYPES[t.type].route);
    },
    barWidth(count) {
      // 최소 6% 는 보이도록 해서 값이 작아도 막대가 사라지지 않게 함
      return Math.max(6, Math.round((count / this.maxCount) * 100));
    },
  },
};
</script>

<!--
  클래스 규칙: {화면}-{역할}  (section > grp > box > list / ttl > txt > desc)
  - 같은 이름이 둘 이상이면 type-02 로 구분 (반드시 .dashboard-box.type-02 처럼 짝지어 사용)
  - 상태는 on
  - i / time / bar 는 styles/common.css 의 공통 클래스
-->
<style scoped>
/* ---------- section / grp ---------- */
.dashboard-section {
  margin-bottom: var(--space-6);
}
.dashboard-section.type-02 {
  margin-bottom: 0;
}
.dashboard-grp {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: var(--space-4);
}
.dashboard-section.type-02 .dashboard-grp {
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  align-items: stretch; /* 두 카드의 높이를 같게 맞춤 */
}
@media (max-width: 960px) {
  .dashboard-section.type-02 .dashboard-grp {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* ---------- box ---------- */
.dashboard-box {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}
.dashboard-section.type-02 .dashboard-box {
  gap: var(--space-4);
}
/* 맨 앞 "전체 템플릿" 카드: 진한 핑크 채움 + 흰 글씨 (대비 약 4.6:1 이상) */
.dashboard-box.type-02 {
  background: var(--gradient-brand);
}
.dashboard-box.type-02 .i-box {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}
.dashboard-box.type-02 .dashboard-num,
.dashboard-box.type-02 .dashboard-txt {
  color: #ffffff;
}

/* ---------- head / ttl / txt / desc ---------- */
.dashboard-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}
.dashboard-ttl {
  font-size: var(--font-size-lg);
}
/* 목록 항목 제목 */
.dashboard-ttl.type-02 {
  font-size: inherit;
  font-weight: var(--font-weight-medium);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dashboard-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
/* 카테고리 이름 + 개수 한 줄 */
.dashboard-info.type-02 {
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
}
.dashboard-num {
  font-size: 32px;
  font-weight: var(--font-weight-bold);
  line-height: 1;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}
.dashboard-txt {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}
.dashboard-info.type-02 .dashboard-txt {
  color: var(--text-primary);
}
.dashboard-info.type-02 .dashboard-txt.type-02 {
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-hover);
}
.dashboard-desc {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}
.dashboard-empty {
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  padding: var(--space-4) 0;
}

/* ---------- seg / btn : 등록순 / 수정순 전환 ---------- */
.dashboard-seg {
  display: inline-flex;
  padding: 3px;
  gap: 2px;
  background: var(--surface-sunken);
  border-radius: var(--radius-md);
}
.dashboard-btn {
  padding: var(--space-1) var(--space-3);
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}
.dashboard-btn.on {
  background: var(--surface-raised);
  color: var(--color-primary-hover);
  box-shadow: var(--shadow-xs);
}

/* ---------- cont / list / item ---------- */
/* 최근 템플릿 영역: 한 줄 높이를 고정하고, 6줄 분량의 최소 높이를 확보 */
.dashboard-cont {
  --dash-row-h: 56px;
  --dash-row-gap: 2px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: calc(var(--dash-row-h) * 6 + var(--dash-row-gap) * 5);
}
.dashboard-cont .dashboard-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-4);
}
.dashboard-list {
  display: flex;
  flex-direction: column;
  gap: var(--dash-row-gap, 2px);
}
/* 카테고리 목록 */
.dashboard-list.type-02 {
  gap: var(--space-4);
}
.dashboard-list.type-02 > li {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.dashboard-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  height: var(--dash-row-h, 56px);
  padding: 0 var(--space-3);
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  text-align: left;
  cursor: pointer;
  color: var(--text-primary);
  transition: background var(--transition-fast);
}
.dashboard-item:hover {
  background: var(--color-primary-light);
}
.dashboard-item:hover .i-box {
  background: var(--surface-raised);
}
.dashboard-item .dashboard-info {
  flex: 1;
  min-width: 0;
  gap: 2px;
}
</style>
