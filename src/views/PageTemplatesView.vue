<template>
  <TemplateManager
    type="page"
    description="완성형 웹페이지 템플릿을 관리합니다."
  />
</template>

<script>
import TemplateManager from '@/components/template/TemplateManager.vue';

export default {
  name: 'PageTemplatesView',
  components: { TemplateManager },
};
</script>
