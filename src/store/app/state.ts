import { Application } from 'src/models/app/Application';

export default class AppsState {
  public apps: Application[] = [
    new Application({
      id: '49f95bc4-abd0-4297-b331-4c1e7557e5b6',
      name: 'Terminal',
      icon: '/apps/icons/terminal.png',
    }),
  ];
}
