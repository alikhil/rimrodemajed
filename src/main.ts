import Vue from 'vue';
import VueGoodWizard from 'vue-good-wizard';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(VueGoodWizard);


new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
