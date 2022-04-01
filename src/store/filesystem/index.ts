import { createComposable, Module } from 'vuex-smart-module';
import FilesystemActions from './actions';
import FilesystemGetters from './getters';
import FilesystemMutations from './mutations';
import FilesystemState from './state';

const filesystemModule = new Module<
  FilesystemState,
  FilesystemGetters,
  FilesystemMutations,
  FilesystemActions
>({
  namespaced: true,
  actions: FilesystemActions,
  getters: FilesystemGetters,
  mutations: FilesystemMutations,
  state: FilesystemState,
});

export default filesystemModule;

export const useFilesystem = createComposable(filesystemModule);
