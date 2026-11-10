<template>
  <TemplateManager
    type="snippet"
    description="반복 사용하는 공통 코드를 관리합니다."
  />
</template>

<script>
import TemplateManager from '@/components/template/TemplateManager.vue';

export default {
  name: 'SnippetsView',
  components: { TemplateManager },
};
</script>
