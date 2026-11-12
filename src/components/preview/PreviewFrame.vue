<template>
  <div class="preview" :class="{ full: fullscreen }">
    <div class="preview-head">
      <DeviceSwitcher v-model="device" />
      <div class="preview-act">
        <BaseButton variant="ghost" size="sm" icon-only aria-label="미리보기 새로고침" @click="refresh">
          <BaseIcon name="code" :size="15" />
        </BaseButton>
        <BaseButton
          variant="ghost"
          size="sm"
          :aria-label="fullscreen ? '전체화면 종료' : '전체화면'"
          @click="toggleFullscreen"
        >
          {{ fullscreen ? '종료' : '전체화면' }}
        </BaseButton>
      </div>
    </div>

    <div class="preview-cont">
      <div class="preview-box" :style="deviceStyle">
        <iframe
          ref="frame"
          class="preview-frame"
          title="템플릿 미리보기"
          sandbox="allow-scripts"
          :srcdoc="srcdoc"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import DeviceSwitcher from './DeviceSwitcher.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseIcon from '@/components/common/BaseIcon.vue';
import { buildPreviewDocument } from '@/utils/previewDocument';

const DEVICE_WIDTH = {
  pc: '100%',
  tablet: '768px',
  mobile: '375px',
};

/**
 * iframe sandbox 기반 미리보기 (독립 재사용 컴포넌트, Phase 3).
 *
 * 보안: sandbox="allow-scripts" 만 부여하고 allow-same-origin 은 제외한다.
 *   → 미리보기 스크립트는 opaque origin 에서 실행되어 메인 앱의
 *     IndexedDB/localStorage/쿠키 등에 접근할 수 없다.
 *
 * 실시간 갱신: template 이 바뀌면 srcdoc 재계산 → iframe 교체.
 *   상위(TemplateDetail)가 입력 디바운스를 담당하므로 과도한 재렌더를 피한다.
 */
export default {
  name: 'PreviewFrame',
  components: { DeviceSwitcher, BaseButton, BaseIcon },
  props: {
    template: { type: Object, required: true },
  },
  data() {
    return {
      device: 'pc',
      fullscreen: false,
      reloadKey: 0,
    };
  },
  computed: {
    srcdoc() {
      // reloadKey 를 참조해 강제 새로고침 시 재계산되도록 함
      void this.reloadKey;
      return buildPreviewDocument(this.template);
    },
    deviceStyle() {
      const width = DEVICE_WIDTH[this.device] || '100%';
      return this.device === 'pc'
        ? { width: '100%', height: '100%' }
        : { width, maxWidth: '100%', height: '100%' };
    },
  },
  beforeDestroy() {
    this.setBodyScroll(true);
  },
  methods: {
    refresh() {
      // srcdoc 를 비웠다가 다시 넣어 완전 재실행
      const frame = this.$refs.frame;
      if (frame) {
        frame.srcdoc = '';
        this.reloadKey += 1;
        this.$nextTick(() => {
          frame.srcdoc = this.srcdoc;
        });
      }
    },
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;
      this.setBodyScroll(!this.fullscreen);
    },
    setBodyScroll(enabled) {
      document.body.style.overflow = enabled ? '' : 'hidden';
    },
  },
};
</script>

<style scoped>
.preview {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 320px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--surface-sunken);
}
.preview.full {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  border-radius: 0;
  min-height: 100vh;
}
.preview-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  background: var(--surface-raised);
  border-bottom: 1px solid var(--border-subtle);
}
.preview-act {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
.preview-cont {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: var(--space-4);
  overflow: auto;
}
.preview-box {
  height: 100%;
  background: var(--surface-raised);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  transition: width var(--transition-base);
  overflow: hidden;
}
.preview-frame {
  width: 100%;
  height: 100%;
  min-height: 300px;
  border: none;
  background: #fff;
  display: block;
}
</style>
