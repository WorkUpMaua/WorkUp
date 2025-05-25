import { UserRepositoryMock } from "./shared/repo/userRepositoryMock";

export class Environments {
  private static _instance: Environments;
  private _repo: UserRepositoryMock;

  private constructor() {
    this._repo = new UserRepositoryMock();
  }

  public static get instance(): Environments {
    if (!this._instance) {
      this._instance = new Environments();
    }
    return this._instance;
  }

  public get repo(): UserRepositoryMock {
    return this._repo;
  }
}