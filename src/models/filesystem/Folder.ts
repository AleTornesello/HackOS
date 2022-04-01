import { File, FileBase } from './File';

export type FolderBase = FileBase;

export class Folder extends File {
  constructor(folder?: FolderBase) {
    super(folder);
  }
}
