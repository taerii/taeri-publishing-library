<template>
  <div>
    <PageHeader title="Settings" description="데이터 백업, 복원, 초기화를 관리합니다." />

    <!-- 저장 데이터 현황 -->
    <BaseCard :class="$style.section">
      <h2 :class="$style.sectionTitle">저장 데이터</h2>
      <div :class="$style.stats">
        <div :class="$style.stat">
          <span :class="$style.statValue">{{ templates.length }}</span>
          <span :class="$style.statLabel">템플릿</span>
        </div>
        <div :class="$style.stat">
          <span :class="$style.statValue">{{ categories.length }}</span>
          <span :class="$style.statLabel">카테고리</span>
        </div>
        <div :class="$style.stat">
          <span :class="$style.statValue">{{ favorites.length }}</span>
          <span :class="$style.statLabel">즐겨찾기</span>
        </div>
      </div>
      <p :class="$style.note">
        이 앱은 브라우저 IndexedDB에 데이터를 저장합니다. 브라우저 데이터 삭제 시
        함께 지워질 수 있으니 정기적으로 백업하세요.
      </p>
    </BaseCard>

    <!-- 내보내기 -->
    <BaseCard :class="$style.section">
      <h2 :class="$style.sectionTitle">내보내기</h2>
      <p :class="$style.desc">전체 데이터를 파일로 저장합니다. 팀 공유에도 사용할 수 있습니다.</p>
      <div :class="$style.actions">
        <BaseButton variant="secondary" :disabled="busy" @click="onExportJson">
          JSON 내보내기
        </BaseButton>
        <BaseButton variant="secondary" :disabled="busy" @click="onExportZip">
          ZIP 백업 (이미지 포함)
        </BaseButton>
      </div>
    </BaseCard>

    <!-- 가져오기 -->
    <BaseCard :class="$style.section">
      <h2 :class="$style.sectionTitle">가져오기 / 복원</h2>
      <p :class="$style.desc">백업 파일을 불러옵니다. ID가 충돌할 때 처리 방식을 선택하세요.</p>
      <BaseSelect
        v-model="strategy"
        label="ID 충돌 시"
        :options="strategyOptions"
        :class="$style.strategy"
      />
      <div :class="$style.actions">
        <BaseButton variant="secondary" :disabled="busy" @click="onImportJson">
          JSON 가져오기
        </BaseButton>
        <BaseButton variant="secondary" :disabled="busy" @click="onImportZip">
          ZIP 복원
        </BaseButton>
      </div>
    </BaseCard>

    <!-- 초기화 -->
    <BaseCard :class="[$style.section, $style.danger]">
      <h2 :class="$style.sectionTitle">데이터 초기화</h2>
      <p :class="$style.desc">
        모든 템플릿과 카테고리를 삭제하고 기본 상태로 되돌립니다. 되돌릴 수 없습니다.
      </p>
      <BaseButton variant="danger" :disabled="busy" @click="resetStep = 1">
        전체 데이터 초기화
      </BaseButton>
    </BaseCard>

    <!-- 초기화 2단계 확인 -->
    <BaseModal :open="resetStep > 0" title="데이터 초기화 확인" size="sm" @close="cancelReset">
      <div v-if="resetStep === 1">
        <p :class="$style.confirmMsg">
          정말 모든 데이터를 삭제하시겠습니까? 템플릿 {{ templates.length }}개가
          영구 삭제됩니다.
        </p>
        <p :class="$style.warnText">계속하기 전에 백업을 권장합니다.</p>
      </div>
      <div v-else>
        <p :class="$style.confirmMsg">
          확인을 위해 아래에 <strong>DELETE</strong>를 입력하세요.
        </p>
        <BaseInput v-model="confirmText" placeholder="DELETE" />
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="cancelReset">취소</BaseButton>
        <BaseButton v-if="resetStep === 1" variant="danger" @click="resetStep = 2">
          계속
        </BaseButton>
        <BaseButton
          v-else
          variant="danger"
          :disabled="confirmText !== 'DELETE' || busy"
          @click="doReset"
        >
          초기화
        </BaseButton>
      </template>
    </BaseModal>

    <!-- 가져오기 결과 -->
    <BaseModal :open="resultOpen" title="가져오기 완료" size="sm" @close="resultOpen = false">
      <ul v-if="importResult" :class="$style.resultList">
        <li>템플릿: 추가 {{ importResult.templates.added }}, 덮어씀 {{ importResult.templates.overwritten }}, 건너뜀 {{ importResult.templates.skipped }}, 신규ID {{ importResult.templates.renamed }}</li>
        <li>카테고리: 추가 {{ importResult.categories.added }}, 덮어씀 {{ importResult.categories.overwritten }}, 건너뜀 {{ importResult.categories.skipped }}, 신규ID {{ importResult.categories.renamed }}</li>
      </ul>
      <template #footer>
        <BaseButton variant="primary" @click="resultOpen = false">확인</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import PageHeader from '@/components/layout/PageHeader.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseSelect from '@/components/common/BaseSelect.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import {
  downloadBlob,
  backupFilename,
  pickFile,
  readFileAsText,
} from '@/utils/download';

// 백업/ZIP 서비스는 Settings 에서만 쓰이므로 지연 로딩 (JSZip 초기 번들 제외)
const loadBackup = () => import('@/services/backup');
const loadZipBackup = () => import('@/services/zipBackup');

export default {
  name: 'SettingsView',
  components: {
    PageHeader,
    BaseCard,
    BaseButton,
    BaseSelect,
    BaseModal,
    BaseInput,
  },
  data() {
    return {
      busy: false,
      strategy: 'skip',
      strategyOptions: [
        { value: 'skip', label: '건너뛰기 (기존 유지)' },
        { value: 'overwrite', label: '덮어쓰기 (가져온 값으로)' },
        { value: 'rename', label: '신규 ID로 추가 (둘 다 유지)' },
      ],
      resetStep: 0,
      confirmText: '',
      resultOpen: false,
      importResult: null,
    };
  },
  computed: {
    ...mapState('data', ['templates', 'categories']),
    ...mapGetters('data', ['favorites']),
  },
  methods: {
    ...mapActions('data', ['reload', 'resetData']),
    toast(message, variant) {
      this.$store.dispatch('ui/pushToast', { message, variant });
    },
    async onExportJson() {
      this.busy = true;
      try {
        const { exportJson } = await loadBackup();
        const json = await exportJson();
        downloadBlob(json, backupFilename('json'), 'application/json');
        this.toast('JSON 내보내기 완료', 'success');
      } catch (e) {
        this.toast('내보내기 실패: ' + (e && e.message), 'error');
      } finally {
        this.busy = false;
      }
    },
    async onExportZip() {
      this.busy = true;
      try {
        const { exportZip } = await loadZipBackup();
        const blob = await exportZip();
        downloadBlob(blob, backupFilename('zip'), 'application/zip');
        this.toast('ZIP 백업 완료', 'success');
      } catch (e) {
        this.toast('백업 실패: ' + (e && e.message), 'error');
      } finally {
        this.busy = false;
      }
    },
    async onImportJson() {
      const file = await pickFile('application/json,.json');
      if (!file) return;
      this.busy = true;
      try {
        const text = await readFileAsText(file);
        const payload = JSON.parse(text);
        const { importPayload } = await loadBackup();
        const result = await importPayload(payload, this.strategy);
        await this.reload();
        this.importResult = result;
        this.resultOpen = true;
        this.toast('JSON 가져오기 완료', 'success');
      } catch (e) {
        this.toast('가져오기 실패: ' + (e && e.message), 'error');
      } finally {
        this.busy = false;
      }
    },
    async onImportZip() {
      const file = await pickFile('application/zip,.zip');
      if (!file) return;
      this.busy = true;
      try {
        const { importZip } = await loadZipBackup();
        const result = await importZip(file, this.strategy);
        await this.reload();
        this.importResult = result;
        this.resultOpen = true;
        this.toast('ZIP 복원 완료', 'success');
      } catch (e) {
        this.toast('복원 실패: ' + (e && e.message), 'error');
      } finally {
        this.busy = false;
      }
    },
    cancelReset() {
      this.resetStep = 0;
      this.confirmText = '';
    },
    async doReset() {
      if (this.confirmText !== 'DELETE') return;
      this.busy = true;
      try {
        await this.resetData();
        this.toast('데이터를 초기화했습니다.', 'success');
      } catch (e) {
        this.toast('초기화 실패: ' + (e && e.message), 'error');
      } finally {
        this.busy = false;
        this.cancelReset();
      }
    },
  },
};
</script>

<style module>
.section {
  margin-bottom: var(--space-4);
}
.sectionTitle {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-2);
}
.desc {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-4);
}
.note {
  margin-top: var(--space-4);
  padding: var(--space-3);
  background: var(--color-info-bg);
  color: var(--color-info);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
}
.stats {
  display: flex;
  gap: var(--space-8);
}
.stat {
  display: flex;
  flex-direction: column;
}
.statValue {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-brand);
}
.statLabel {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
.actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}
.strategy {
  max-width: 280px;
  margin-bottom: var(--space-4);
}
.danger {
  /* 테두리 대신 은은한 붉은 그림자로 위험 구역 표시 */
  box-shadow: 0 2px 12px rgba(214, 69, 69, 0.14), 0 1px 2px rgba(214, 69, 69, 0.08);
}
.confirmMsg {
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}
.warnText {
  color: var(--color-warning);
  font-size: var(--font-size-sm);
}
.resultList {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
