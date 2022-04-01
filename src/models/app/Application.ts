export interface ApplicationBase {
  id?: string;
  name?: string;
  icon?: string;
  groupId?: string;
}

export class Application {
  public id?: string;
  public name?: string;
  public icon?: string;
  public groupId?: string;

  constructor(data?: ApplicationBase) {
    this.id = data && 'id' in data ? data.id : undefined;
    this.name = data && 'name' in data ? data.name : '';
    this.icon = data && 'icon' in data ? data.icon : '';
    this.groupId = data && 'groupId' in data ? data.groupId : undefined;
  }
}
