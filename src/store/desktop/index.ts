import { createComposable, Module } from 'vuex-smart-module';
import DesktopActions from './actions';
import DesktopGetters from './getters';
import DesktopMutations from './mutations';
import DesktopState from './state';

const desktopModule = new Module<
  DesktopState,
  DesktopGetters,
  DesktopMutations,
  DesktopActions
>({
  namespaced: true,
  actions: DesktopActions,
  getters: DesktopGetters,
  mutations: DesktopMutations,
  state: DesktopState,
});

export default desktopModule;

export const useDesktop = createComposable(desktopModule);
