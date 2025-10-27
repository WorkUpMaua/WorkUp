import { AluguelRepositoryMock } from './repo/aluguelRepositoryMock'

export class Environments {
  private static _instance: Environments;
  private _repoAluguel: AluguelRepositoryMock;

  private constructor() {
    this._repoAluguel = new AluguelRepositoryMock();
  }

  public static get instance(): Environments {
    if (!this._instance) {
      this._instance = new Environments();
    }
    return this._instance;
  }

  public get repoAluguel(): AluguelRepositoryMock {
    return this._repoAluguel;
  }
}