import { Getters } from 'vuex-smart-module';
import AppsState from './state';

export default class AppsGetters extends Getters<AppsState> {
  get apps() {
    return this.state.apps;
  }
}
