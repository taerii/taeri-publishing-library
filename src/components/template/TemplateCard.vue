<template>
  <BaseCard
    interactive
    class="tcard"
    role="button"
    tabindex="0"
    @click="$emit('open', template.id)"
    @keydown.enter.native="$emit('open', template.id)"
  >
    <div v-if="thumbUrl" class="tcard-thumb">
      <img :src="thumbUrl" :alt="template.title + ' 썸네일'" loading="lazy" />
    </div>

    <div class="tcard-head">
      <div class="tcard-row">
        <h3 class="tcard-ttl">{{ template.title || '(제목 없음)' }}</h3>
        <button
          type="button"
          class="tcard-fav"
          :class="{ on: template.favorite }"
          :aria-label="template.favorite ? '즐겨찾기 해제' : '즐겨찾기 추가'"
          :aria-pressed="String(template.favorite)"
          @click.stop="$emit('toggle-favorite', template.id)"
        >
          <BaseIcon name="star" :size="18" />
        </button>
      </div>
      <p v-if="template.description" class="tcard-desc">
        {{ template.description }}
      </p>
    </div>

    <div class="tcard-meta">
      <BaseTag variant="brand">{{ categoryName }}</BaseTag>
      <BaseTag v-if="template.responsive" variant="success">Responsive</BaseTag>
      <BaseTag v-for="tag in visibleTags" :key="tag">#{{ tag }}</BaseTag>
      <BaseTag v-if="hiddenTagCount > 0">+{{ hiddenTagCount }}</BaseTag>
    </div>

    <div class="tcard-foot">
      <span class="tcard-langs">
        <span v-if="template.html" class="tcard-lang">HTML</span>
        <span v-if="template.css" class="tcard-lang">CSS</span>
        <span v-if="template.javascript" class="tcard-lang">JS</span>
      </span>
      <time class="time" :datetime="updatedIso">{{ updatedText }}</time>
    </div>
  </BaseCard>
</template>

<script>
import BaseCard from '@/components/common/BaseCard.vue';
import BaseTag from '@/components/common/BaseTag.vue';
import BaseIcon from '@/components/common/BaseIcon.vue';
import { formatRelative } from '@/utils/date';
import { assetRepo } from '@/db';

/**
 * 템플릿 목록 카드 (표시 전용).
 * 상위에서 전달한 template 과 categoryName 을 렌더하고,
 * open / toggle-favorite 이벤트만 방출한다 (상태 변경 책임 없음).
 */
export default {
  name: 'TemplateCard',
  components: { BaseCard, BaseTag, BaseIcon },
  props: {
    template: { type: Object, required: true },
    categoryName: { type: String, default: '미분류' },
  },
  data() {
    return { thumbUrl: '' };
  },
  watch: {
    'template.thumbnailAssetId': {
      immediate: true,
      handler() {
        this.loadThumb();
      },
    },
  },
  beforeDestroy() {
    if (this.thumbUrl) URL.revokeObjectURL(this.thumbUrl);
  },
  computed: {
    visibleTags() {
      return (this.template.tags || []).slice(0, 3);
    },
    hiddenTagCount() {
      return Math.max(0, (this.template.tags || []).length - 3);
    },
    updatedText() {
      return formatRelative(this.template.updatedAt);
    },
    updatedIso() {
      return new Date(this.template.updatedAt).toISOString();
    },
  },
  methods: {
    async loadThumb() {
      if (this.thumbUrl) {
        URL.revokeObjectURL(this.thumbUrl);
        this.thumbUrl = '';
      }
      const id = this.template.thumbnailAssetId;
      if (!id) return;
      try {
        const asset = await assetRepo.getById(id);
        if (asset && asset.blob) {
          this.thumbUrl = URL.createObjectURL(asset.blob);
        }
      } catch {
        /* 썸네일 로드 실패는 무시 */
      }
    },
  },
};
</script>

<!-- card / time 은 styles/common.css 의 공통 클래스 -->
<style scoped>
.tcard {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  height: 100%;
}
.tcard-thumb {
  margin: calc(var(--space-5) * -1) calc(var(--space-5) * -1) 0;
  height: 140px;
  overflow: hidden;
  background: var(--surface-sunken);
}
.tcard-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.tcard-head {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.tcard-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-2);
}
.tcard-ttl {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  word-break: break-all;
}
.tcard-fav {
  flex-shrink: 0;
  display: inline-flex;
  padding: 4px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background var(--transition-fast);
}
.tcard-fav:hover {
  background: var(--surface-sunken);
  color: var(--color-warning);
}
.tcard-fav.on {
  color: var(--color-warning);
}
.tcard-fav.on svg {
  fill: var(--color-warning);
}
.tcard-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.tcard-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: auto;
}
.tcard-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-subtle);
}
.tcard-langs {
  display: flex;
  gap: var(--space-1);
}
.tcard-lang {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  color: var(--text-secondary);
}
</style>
