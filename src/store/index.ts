import { store } from 'quasar/wrappers';
import { createStore, Module, createComposable } from 'vuex-smart-module';
import VuexPersistence from 'vuex-persist';

import appsModule from './app';

const root = new Module({
  modules: {
    apps: appsModule,
  },
});

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

export default store(function (/* { ssrContext } */) {
  const Store = createStore(root, {
    strict: !!process.env.DEBUGGING,
    plugins: [vuexLocal.plugin],
  });

  return Store;
});

export const useStore = createComposable(root);
