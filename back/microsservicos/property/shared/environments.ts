import { PropertyRepositoryMock } from './repo/propertyRepositoryMock';

export class Environments {
  private static _instance: Environments;
  private _repo: PropertyRepositoryMock;

  private constructor() {
    this._repo = new PropertyRepositoryMock();
  }

  public static get instance(): Environments {
    if (!this._instance) {
      this._instance = new Environments();
    }
    return this._instance;
  }

  public get repo(): PropertyRepositoryMock {
    return this._repo;
  }
}
