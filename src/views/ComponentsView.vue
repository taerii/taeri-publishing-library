<template>
  <TemplateManager
    type="component"
    description="개별 UI 요소를 등록하고 관리합니다."
  />
</template>

<script>
import TemplateManager from '@/components/template/TemplateManager.vue';

export default {
  name: 'ComponentsView',
  components: { TemplateManager },
};
</script>
