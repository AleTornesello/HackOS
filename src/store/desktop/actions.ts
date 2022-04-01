import { Actions } from 'vuex-smart-module';
import DesktopGetters from './getters';
import DesktopMutations from './mutations';
import DesktopState from './state';

export default class DesktopActions extends Actions<
  DesktopState,
  DesktopGetters,
  DesktopMutations,
  DesktopActions
> {}
