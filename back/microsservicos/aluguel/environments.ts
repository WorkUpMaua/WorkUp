import { AluguelRepositoryMock } from './shared/repo/aluguelRepositoryMock';
import { CatalogoRepositoryMock } from './shared/repo/catalogoRepositoryMock';
import { UserRepositoryMock } from './shared/repo/userRepositoryMock';

export class Environments {
  private static _instance: Environments;
  private _repoAluguel: AluguelRepositoryMock;
  private _repoUser: UserRepositoryMock;
  private _repoCatalogo: CatalogoRepositoryMock;

  private constructor() {
    this._repoAluguel = new AluguelRepositoryMock();
    this._repoUser = new UserRepositoryMock();
    this._repoCatalogo = new CatalogoRepositoryMock();
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

  public get repoUser(): UserRepositoryMock {
    return this._repoUser;
  }

  public get repoCatalogo(): CatalogoRepositoryMock {
    return this._repoCatalogo;
  }
}