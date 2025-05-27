import { AluguelRepositoryMock } from './shared/repo/aluguelRepositoryMock';

export class Environments {
  private static _instance: Environments;
  private _repo: AluguelRepositoryMock;

  private constructor() {
    this._repo = new AluguelRepositoryMock();
  }

  public static get instance(): Environments {
    if (!this._instance) {
      this._instance = new Environments();
    }
    return this._instance;
  }

  public get repo(): AluguelRepositoryMock {
    return this._repo;
  }
}