import { Position } from 'src/models/common/Position';
import { Size } from 'src/models/common/Size';
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

  get lastAppWindowsGeometry() {
    return this.state.lastAppWindowsGeometry;
  }

  lastAppWindowPositionByAppId(
    appId: string | undefined
  ): Position | undefined {
    if (!appId) return undefined;

    return this.state.lastAppWindowsGeometry.find(
      (geometry) => geometry.appId === appId
    )?.position;
  }

  lastAppWindowSizeByAppId(appId: string | undefined): Size | undefined {
    if (!appId) return undefined;

    return this.state.lastAppWindowsGeometry.find(
      (geometry) => geometry.appId === appId
    )?.size;
  }
}
