import { Position } from 'src/models/common/Position';
import { Size } from 'src/models/common/Size';

export default class DesktopState {
  public apps: string[] = ['49f95bc4-abd0-4297-b331-4c1e7557e5b6'];

  public windowZIndexes: { processId: string; zIndex: number }[] = [];

  public appsOnBar: string[] = [];

  public lastAppWindowsGeometry: {
    appId: string;
    position: Position;
    size: Size;
  }[] = [];
}
