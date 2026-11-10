import {
  templateRepo,
  categoryRepo,
  ensureSeedData,
  resetAllData,
} from '@/db';

/**
 * 데이터 캐시 Vuex 모듈.
 *
 * 역할 분리 원칙:
 * - 이 모듈은 IndexedDB(repository)에서 읽은 영속 데이터의 메모리 캐시이다.
 * - 모든 쓰기는 반드시 repository 를 거친 뒤 캐시(state)를 갱신한다.
 * - Vuex 가 IndexedDB 를 직접 다루지 않는다 (DB 접근은 db/repositories 가 전담).
 * - 직렬화 불가능한 객체(Blob, CodeMirror 인스턴스)는 여기 저장하지 않는다.
 */
export default {
  namespaced: true,

  state: () => ({
    /** @type {import('@/constants/schema').Template[]} */
    templates: [],
    /** @type {import('@/constants/schema').Category[]} */
    categories: [],
    initialized: false,
    loading: false,
    error: null,
  }),

  getters: {
    templatesByType: (state) => (type) =>
      state.templates.filter((t) => t.type === type),
    favorites: (state) => state.templates.filter((t) => t.favorite),
    templateById: (state) => (id) =>
      state.templates.find((t) => t.id === id),
    categoriesByType: (state) => (type) =>
      state.categories
        .filter((c) => c.type === type)
        .sort((a, b) => a.order - b.order),
    categoryMap: (state) => {
      const map = {};
      state.categories.forEach((c) => {
        map[c.id] = c.name;
      });
      return map;
    },
    categoryCounts: (state) => {
      const counts = {};
      state.templates.forEach((t) => {
        counts[t.categoryId] = (counts[t.categoryId] || 0) + 1;
      });
      return counts;
    },
  },

  mutations: {
    SET_LOADING(state, v) {
      state.loading = v;
    },
    SET_ERROR(state, v) {
      state.error = v;
    },
    SET_ALL(state, { templates, categories }) {
      state.templates = templates;
      state.categories = categories;
    },
    SET_INITIALIZED(state, v) {
      state.initialized = v;
    },
    ADD_TEMPLATE(state, t) {
      state.templates.push(t);
    },
    UPDATE_TEMPLATE(state, t) {
      const i = state.templates.findIndex((x) => x.id === t.id);
      if (i !== -1) state.templates.splice(i, 1, t);
    },
    REMOVE_TEMPLATE(state, id) {
      state.templates = state.templates.filter((t) => t.id !== id);
    },
    ADD_CATEGORY(state, c) {
      state.categories.push(c);
    },
    UPDATE_CATEGORY(state, c) {
      const i = state.categories.findIndex((x) => x.id === c.id);
      if (i !== -1) state.categories.splice(i, 1, c);
    },
    REMOVE_CATEGORY(state, id) {
      state.categories = state.categories.filter((c) => c.id !== id);
    },
    REASSIGN_CATEGORY(state, { fromId, toId }) {
      state.templates = state.templates.map((t) =>
        t.categoryId === fromId ? { ...t, categoryId: toId } : t
      );
    },
  },

  actions: {
    async init({ state, commit }) {
      if (state.initialized) return;
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        await ensureSeedData();
        const [templates, categories] = await Promise.all([
          templateRepo.getAll(),
          categoryRepo.getAll(),
        ]);
        commit('SET_ALL', { templates, categories });
        commit('SET_INITIALIZED', true);
      } catch (e) {
        commit('SET_ERROR', e instanceof Error ? e.message : '데이터 초기화 실패');
        throw e;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async reload({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const [templates, categories] = await Promise.all([
          templateRepo.getAll(),
          categoryRepo.getAll(),
        ]);
        commit('SET_ALL', { templates, categories });
      } catch (e) {
        commit('SET_ERROR', e instanceof Error ? e.message : '데이터 로드 실패');
        throw e;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async createTemplate({ commit }, draft) {
      const created = await templateRepo.create(draft);
      commit('ADD_TEMPLATE', created);
      return created;
    },

    async updateTemplate({ commit }, { id, patch }) {
      const updated = await templateRepo.update(id, patch);
      if (updated) commit('UPDATE_TEMPLATE', updated);
      return updated;
    },

    async deleteTemplate({ commit }, id) {
      await templateRepo.remove(id);
      commit('REMOVE_TEMPLATE', id);
    },

    async toggleFavorite({ state, commit }, id) {
      const favorite = await templateRepo.toggleFavorite(id);
      if (favorite === undefined) return;
      const existing = state.templates.find((t) => t.id === id);
      if (existing) {
        commit('UPDATE_TEMPLATE', {
          ...existing,
          favorite,
          updatedAt: Date.now(),
        });
      }
    },

    async createCategory({ commit }, draft) {
      const created = await categoryRepo.create(draft);
      commit('ADD_CATEGORY', created);
      return created;
    },

    async updateCategory({ commit }, { id, patch }) {
      const updated = await categoryRepo.update(id, patch);
      if (updated) commit('UPDATE_CATEGORY', updated);
      return updated;
    },

    async resetData({ dispatch }) {
      await resetAllData();
      await dispatch('reload');
    },

    async deleteCategory({ commit }, { id, reassignToId }) {
      // 사용 중 카테고리 보호: 소속 템플릿을 다른 카테고리로 이전 후 삭제
      if (reassignToId) {
        await templateRepo.reassignCategory(id, reassignToId);
        commit('REASSIGN_CATEGORY', { fromId: id, toId: reassignToId });
      }
      await categoryRepo.remove(id);
      commit('REMOVE_CATEGORY', id);
    },
  },
};
