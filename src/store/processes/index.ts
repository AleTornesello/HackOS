import { createComposable, Module } from 'vuex-smart-module';
import ProcessesActions from './actions';
import ProcessesGetters from './getters';
import ProcessesMutations from './mutations';
import ProcessesState from './state';

const processesModule = new Module<
  ProcessesState,
  ProcessesGetters,
  ProcessesMutations,
  ProcessesActions
>({
  namespaced: true,
  actions: ProcessesActions,
  getters: ProcessesGetters,
  mutations: ProcessesMutations,
  state: ProcessesState,
});

export default processesModule;

export const useProcesses = createComposable(processesModule);
