import { uid } from 'quasar';
import { Application } from 'src/models/app/Application';
import { Actions } from 'vuex-smart-module';
import ProcessesGetters from './getters';
import ProcessesMutations from './mutations';
import ProcessesState from './state';

export default class ProcessesActions extends Actions<
  ProcessesState,
  ProcessesGetters,
  ProcessesMutations,
  ProcessesActions
> {
  public addAppAsProcess(app: Application): Promise<string> {
    const id = uid();
    this.mutations.createNewProcess({ id, app });
    return Promise.resolve(id);
  }
}
