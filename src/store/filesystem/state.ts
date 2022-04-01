import { File } from 'src/models/filesystem/File';
import { Folder } from 'src/models/filesystem/Folder';

export default class FilesystemState {
  public files: File[] = [
    new File({
      id: 'd0f2db9e-adbb-43ca-911e-d805f92201cf',
      name: 'README.md',
      owner: 'root',
      group: 'root',
      parentId: 'd5f3c15c-3b2c-49c6-8d4f-55088a4a8bf0',
    }),
  ];

  public folders: Folder[] = [
    new Folder({
      id: 'd5f3c15c-3b2c-49c6-8d4f-55088a4a8bf0',
      name: '',
      owner: 'root',
      group: 'root',
    }),
  ];
}
