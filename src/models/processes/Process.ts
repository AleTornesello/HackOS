import { Application } from '../app/Application';

export interface ProcessBase {
  id: string;
  name?: string;
  application: Application;
}

export class Process {
  public id: string;
  public name: string;
  public application: Application;

  constructor(process: ProcessBase) {
    this.id = process.id;
    this.name = process.name || process.application.name || '';
    this.application = process.application;
  }
}
