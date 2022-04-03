import { Application } from 'src/models/app/Application';
import { Mutations } from 'vuex-smart-module';
import ProcessesState from './state';
import { uid } from 'quasar';
import { Process } from 'src/models/processes/Process';

export default class ProcessesMutations extends Mutations<ProcessesState> {
  public addAppAsProcess(app: Application) {
    this.state.processes.push(
      new Process({
        id: uid(),
        application: app,
      })
    );
  }
}
