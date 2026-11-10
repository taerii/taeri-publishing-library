import Vue from 'vue';
import Vuex from 'vuex';
import ui from './modules/ui';
import data from './modules/data';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    ui,
    data,
  },
});
