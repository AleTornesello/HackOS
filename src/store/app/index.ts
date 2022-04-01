import { createComposable, Module } from 'vuex-smart-module';
import AppsActions from './actions';
import AppsGetters from './getters';
import AppsMutations from './mutations';
import AppsState from './state';

const appsModule = new Module<
  AppsState,
  AppsGetters,
  AppsMutations,
  AppsActions
>({
  namespaced: true,
  actions: AppsActions,
  getters: AppsGetters,
  mutations: AppsMutations,
  state: AppsState,
});

export default appsModule;

export const useApps = createComposable(appsModule);
