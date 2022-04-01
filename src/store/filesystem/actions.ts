import { Actions } from 'vuex-smart-module';
import FilesystemGetters from './getters';
import FilesystemMutations from './mutations';
import FilesystemState from './state';

export default class FilesystemActions extends Actions<
  FilesystemState,
  FilesystemGetters,
  FilesystemMutations,
  FilesystemActions
> {}
