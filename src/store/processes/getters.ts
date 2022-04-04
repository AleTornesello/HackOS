import { Process } from 'src/models/processes/Process';
import { Getters } from 'vuex-smart-module';
import ProcessesState from './state';

export default class ProcessesGetters extends Getters<ProcessesState> {
  get processes() {
    return this.state.processes;
  }

  runningAppInstances(appId: string): Process[] {
    return this.getters.processes.filter(
      (process) => process.application.id === appId
    );
  }
}
