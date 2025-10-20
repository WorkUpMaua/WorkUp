import { DisponibilidadeRepositoryMock } from "./infra/repo/disponibilidadeRepositoryMock";

export enum Stage {
  DEV = "dev",
  TEST = "test"
}

export class Environments {
  private static _testRepoInstance?: DisponibilidadeRepositoryMock;

  private constructor(
    public readonly stage: Stage,
    public readonly port: number,
    public readonly awsRegion: string,
    public readonly awsKeyID: string,
    public readonly awsSecretKey: string,
    public readonly s3Bucket: string,
    public readonly cdnDomain: string,
    public readonly rabbitmqURL: string
  ) {}

  static getEnvs(): Environments {
    let port, awsRegion, awsKeyID, awsSecretKey, s3Bucket, cdnDomain, rabbitmqURL;
    const stageEnv = process.env.STAGE?.toLowerCase() ?? "test";
    const stage = Object.values(Stage).includes(stageEnv as Stage)
      ? (stageEnv as Stage)
      : Stage.TEST;
      
    port = parseInt(process.env.DISPONIBILIDADE_PORT || "4003", 10);
    awsRegion = process.env.AWS_REGION || "us-east-1";
    awsKeyID = process.env.AWS_ACCESS_KEY_ID || "key-not-found";
    awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY || "key-not-found";
    s3Bucket = process.env.S3_BUCKET || "default-bucket";
    cdnDomain = process.env.CDN_DOMAIN || "localhost";
    rabbitmqURL = process.env.RABBITMQ_URL || "not-found";

    return new Environments(stage, port, awsRegion, awsKeyID, awsSecretKey, s3Bucket, cdnDomain, rabbitmqURL);
  }

  static getDisponibilidadeRepo() {
    const { stage } = this.getEnvs();
    switch (stage) {
      case Stage.TEST:
        if (!this._testRepoInstance) {
          this._testRepoInstance = new DisponibilidadeRepositoryMock();
        }
        return this._testRepoInstance;

      case Stage.DEV:
        throw new Error("Repositório real ainda não implementado");

      default:
        return new DisponibilidadeRepositoryMock();
    }
  }
}
