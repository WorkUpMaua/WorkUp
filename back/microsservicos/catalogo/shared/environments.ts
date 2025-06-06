import { CatalogoRepositoryMock } from './repo/catalogoRepositoryMock';

export class Environments {
  private static _instance: Environments;
  private _repo: CatalogoRepositoryMock;

  private constructor() {
    this._repo = new CatalogoRepositoryMock();
  }

  public static get instance(): Environments {
    if (!this._instance) {
      this._instance = new Environments();
    }
    return this._instance;
  }

  public get repo(): CatalogoRepositoryMock {
    return this._repo;
  }
}