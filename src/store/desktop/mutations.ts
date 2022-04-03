import { Mutations } from 'vuex-smart-module';
import DesktopState from './state';

export default class DesktopMutations extends Mutations<DesktopState> {
  public addAppToBar(appId: string) {
    this.state.appsOnBar.push(appId);
  }

  public removeAppFromBar(appId: string) {
    const index = this.state.appsOnBar.indexOf(appId);
    if (index > -1) {
      this.state.appsOnBar.splice(index, 1);
    }
  }

  public removeAppFromBarAtIndex(index: number) {
    this.state.appsOnBar.splice(index, 1);
  }
}
