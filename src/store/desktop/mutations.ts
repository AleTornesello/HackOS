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

  public setWindowOnEvidence(processId: string) {
    // If is a new process, add it to the array.
    if (
      !this.state.windowZIndexes.some((item) => item.processId === processId)
    ) {
      this.state.windowZIndexes.push({
        processId,
        zIndex: this.state.windowZIndexes.length + 1,
      });
    } else {
      // Update the zIndexes only if the selected process is not
      // already on the top.
      if (
        this.state.windowZIndexes.find((item) => item.processId === processId)
          ?.zIndex !== this.state.windowZIndexes.length
      ) {
        this.state.windowZIndexes.forEach((windowIndexData) => {
          if (windowIndexData.processId === processId) {
            windowIndexData.zIndex = this.state.windowZIndexes.length;
          } else if (windowIndexData.zIndex > 1) {
            // If the window is the lowest, don't decrement it.
            windowIndexData.zIndex--;
          }
        });
      }
    }
  }
}
