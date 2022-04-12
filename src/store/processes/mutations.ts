import { Application } from 'src/models/app/Application';
import { Process } from 'src/models/processes/Process';
import { Mutations } from 'vuex-smart-module';
import ProcessesState from './state';

export default class ProcessesMutations extends Mutations<ProcessesState> {
  public createNewProcess(data: { id: string; app: Application }) {
    this.state.processes.push(
      new Process({ id: data.id, application: data.app })
    );
  }

  public stopProcess(id: string) {
    const processIndex = this.state.processes.findIndex((p) => p.id === id);
    if (processIndex > -1) {
      this.state.processes.splice(processIndex, 1);
    }
  }
}
