import { store } from 'quasar/wrappers';
import { createStore, Module, createComposable } from 'vuex-smart-module';
import VuexPersistence from 'vuex-persist';

import appsModule from './app';
import filesystemModule from './filesystem';
import desktopModule from './desktop';
import processesModule from './processes';

const root = new Module({
  modules: {
    apps: appsModule,
    filesystem: filesystemModule,
    desktop: desktopModule,
    processes: processesModule,
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
