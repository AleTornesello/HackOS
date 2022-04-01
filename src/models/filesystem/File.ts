export interface FileBase {
  id?: string;
  name?: string;
  owner?: string;
  group?: string;
  parentId?: string;
}

export class File {
  public id?: string;
  public name?: string;
  public owner?: string;
  public group?: string;
  public parentId?: string;

  constructor(file?: FileBase) {
    this.id = file && 'id' in file ? file.id : undefined;
    this.name = file && 'name' in file ? file.name : '';
    this.owner = file && 'owner' in file ? file.owner : undefined;
    this.group = file && 'group' in file ? file.group : undefined;
    this.parentId = file && 'parentId' in file ? file.parentId : undefined;
  }
}
