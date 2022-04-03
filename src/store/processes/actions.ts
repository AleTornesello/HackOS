import { Actions } from 'vuex-smart-module';
import ProcessesGetters from './getters';
import ProcessesMutations from './mutations';
import ProcessesState from './state';

export default class ProcessesActions extends Actions<
  ProcessesState,
  ProcessesGetters,
  ProcessesMutations,
  ProcessesActions
> {}
