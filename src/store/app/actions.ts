import { Actions } from 'vuex-smart-module';
import AppsGetters from './getters';
import AppsMutations from './mutations';
import AppsState from './state';

export default class AppsActions extends Actions<
  AppsState,
  AppsGetters,
  AppsMutations,
  AppsActions
> {}
