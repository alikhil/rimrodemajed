import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: '',
    lastname: '',
  },
  mutations: {
    setName(state, newName: string) {
      state.name = newName;
    },
  },
  actions: {

  },
});
