import { Getters } from 'vuex-smart-module';
import DesktopState from './state';

export default class DesktopGetters extends Getters<DesktopState> {
  get apps() {
    return this.state.apps;
  }
}
