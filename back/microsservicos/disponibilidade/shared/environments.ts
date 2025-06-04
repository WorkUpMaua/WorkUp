import { DisponibilidadeRepositoryMock } from "./repo/disponibilidadeRepositoryMock";


export class Environments {
  private static _instance: Environments;
  private _repo: DisponibilidadeRepositoryMock;

  private constructor() {
    this._repo = new DisponibilidadeRepositoryMock();
  }

  public static get instance(): Environments {
    if (!this._instance) {
      this._instance = new Environments();
    }
    return this._instance;
  }

  public get repo(): DisponibilidadeRepositoryMock {
    return this._repo;
  }
}