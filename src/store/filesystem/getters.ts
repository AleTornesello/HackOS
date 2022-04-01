import { File } from 'src/models/filesystem/File';
import { Folder } from 'src/models/filesystem/Folder';
import { Getters } from 'vuex-smart-module';
import FilesystemState from './state';

export default class FilesystemGetters extends Getters<FilesystemState> {
  childrenOfFolder(folderId: string): (File | Folder)[] {
    const files: File[] = this.state.files.filter(
      (file) => file.parentId === folderId
    );
    const folders: Folder[] = this.state.folders.filter(
      (folder) => folder.parentId === folderId
    );

    return [...folders, ...files];
  }
}
