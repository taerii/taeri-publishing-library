import { createId } from '@/utils/id';

/**
 * 전역 UI 상태 전용 Vuex 모듈.
 * 사이드바 열림 상태, 토스트 알림 큐 등 화면 상태만 담당한다.
 * 영속 데이터(템플릿/카테고리)는 data 모듈에서 관리한다.
 */
export default {
  namespaced: true,

  state: () => ({
    sidebarOpen: false,
    /** @type {{id:string,message:string,variant:string,duration:number}[]} */
    toasts: [],
  }),

  mutations: {
    SET_SIDEBAR(state, open) {
      state.sidebarOpen = open;
    },
    TOGGLE_SIDEBAR(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    ADD_TOAST(state, toast) {
      state.toasts.push(toast);
    },
    REMOVE_TOAST(state, id) {
      state.toasts = state.toasts.filter((t) => t.id !== id);
    },
  },

  actions: {
    setSidebar({ commit }, open) {
      commit('SET_SIDEBAR', open);
    },
    toggleSidebar({ commit }) {
      commit('TOGGLE_SIDEBAR');
    },
    pushToast({ commit }, payload) {
      const toast = {
        id: createId(),
        message: typeof payload === 'string' ? payload : payload.message,
        variant: (payload && payload.variant) || 'info',
        duration: (payload && payload.duration) || 3200,
      };
      commit('ADD_TOAST', toast);
      return toast.id;
    },
    dismissToast({ commit }, id) {
      commit('REMOVE_TOAST', id);
    },
  },
};
