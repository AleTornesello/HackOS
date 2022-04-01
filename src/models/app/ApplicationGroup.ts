export interface ApplicationGroupBase {
  id?: string;
  name?: string;
}

export class ApplicationGroup {
  public id?: string;
  public name?: string;

  constructor(data?: ApplicationGroupBase) {
    this.id = data && 'id' in data ? data.id : undefined;
    this.name = data && 'name' in data ? data.name : '';
  }
}
