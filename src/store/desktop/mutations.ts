import { Position } from 'src/models/common/Position';
import { Size } from 'src/models/common/Size';
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

  public setWindowPosition(data: { appId: string; newPosition: Position }) {
    const app = this.state.lastAppWindowsGeometry.find(
      (item) => item.appId === data.appId
    );

    if (app) {
      app.position = data.newPosition;
    } else {
      this.state.lastAppWindowsGeometry.push({
        appId: data.appId,
        position: data.newPosition,
        size: {
          height: 0,
          width: 0,
        },
      });
    }
  }

  public setWindowSize(data: { appId: string; newSize: Size }) {
    const app = this.state.lastAppWindowsGeometry.find(
      (item) => item.appId === data.appId
    );

    if (app) {
      app.size = data.newSize;
    } else {
      this.state.lastAppWindowsGeometry.push({
        appId: data.appId,
        position: {
          x: 0,
          y: 0,
        },
        size: data.newSize,
      });
    }
  }
}
