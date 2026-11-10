import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles/global.css';

Vue.config.productionTip = false;

// 전역 에러 처리: 예기치 못한 에러를 토스트로 사용자에게 안내 (요구사항 13)
Vue.config.errorHandler = (err, vm, info) => {
  // eslint-disable-next-line no-console
  console.error('[Vue error]', err, info);
  try {
    store.dispatch('ui/pushToast', {
      message: '예기치 못한 오류가 발생했습니다. 다시 시도해 주세요.',
      variant: 'error',
      duration: 5000,
    });
  } catch (e) {
    /* store 미초기화 등 예외는 무시 */
  }
};

window.addEventListener('unhandledrejection', (event) => {
  // eslint-disable-next-line no-console
  console.error('[Unhandled rejection]', event.reason);
  try {
    store.dispatch('ui/pushToast', {
      message: '처리 중 오류가 발생했습니다.',
      variant: 'error',
      duration: 5000,
    });
  } catch (e) {
    /* noop */
  }
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
