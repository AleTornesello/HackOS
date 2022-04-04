import { Getters } from 'vuex-smart-module';
import DesktopState from './state';

export default class DesktopGetters extends Getters<DesktopState> {
  get apps() {
    return this.state.apps;
  }

  get appsOnBar() {
    return this.state.appsOnBar;
  }

  get windowZIndexes() {
    return this.state.windowZIndexes;
  }

  windowZIndex(processId: string): number {
    return (
      this.state.windowZIndexes.find(
        (windowIndexData) => windowIndexData.processId === processId
      )?.zIndex || 0
    );
  }
}
