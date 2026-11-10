<template>
  <EmptyState
    title="페이지를 찾을 수 없습니다"
    description="요청하신 페이지가 존재하지 않거나 이동되었습니다."
  >
    <template #icon>
      <BaseIcon name="file-question" :size="28" />
    </template>
    <template #action>
      <BaseButton variant="primary" @click="$router.push('/')">
        대시보드로 이동
      </BaseButton>
    </template>
  </EmptyState>
</template>

<script>
import EmptyState from '@/components/common/EmptyState.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseIcon from '@/components/common/BaseIcon.vue';

export default {
  name: 'NotFoundView',
  components: { EmptyState, BaseButton, BaseIcon },
};
</script>
