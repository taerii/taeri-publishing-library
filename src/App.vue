<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  created() {
    // 앱 시작 시 IndexedDB 시드 보장 + 데이터 로드 (data 모듈)
    this.$store.dispatch('data/init').catch((e) => {
      this.$store.dispatch('ui/pushToast', {
        message: '데이터 초기화에 실패했습니다: ' + (e && e.message),
        variant: 'error',
        duration: 6000,
      });
    });
  },
};
</script>
