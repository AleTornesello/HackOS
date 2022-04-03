import { Getters } from 'vuex-smart-module';
import ProcessesState from './state';

export default class ProcessesGetters extends Getters<ProcessesState> {
  get processes() {
    return this.state.processes;
  }
}
