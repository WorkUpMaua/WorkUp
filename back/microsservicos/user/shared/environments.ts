import { UserRepository } from "./domain/repo/userRepository";
import { UserRepositoryMock } from "./infra/repo/userRepositoryMock";

export enum Stage {
  DEV = "dev",
  TEST = "test"
}

export class Environments {
  private static _testRepoInstance?: UserRepositoryMock;

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
      
    port = parseInt(process.env.PORT || "4001", 10);
    awsRegion = process.env.AWS_REGION || "us-east-1";
    awsKeyID = process.env.AWS_ACCESS_KEY_ID || "key-not-found";
    awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY || "key-not-found";
    s3Bucket = process.env.S3_BUCKET || "default-bucket";
    cdnDomain = process.env.CDN_DOMAIN || "localhost";
    rabbitmqURL = process.env.RABBITMQ_URL || "not-found";

    return new Environments(stage, port, awsRegion, awsKeyID, awsSecretKey, s3Bucket, cdnDomain, rabbitmqURL);
  }

  static getUserRepository(): UserRepository {
    const { stage } = this.getEnvs();
    switch (stage) {
      case Stage.TEST:
        if (!this._testRepoInstance) {
          this._testRepoInstance = new UserRepositoryMock();
        }
        return this._testRepoInstance;

      case Stage.DEV:
        throw new Error("Repositório real ainda não implementado");

      default:
        return new UserRepositoryMock();
    }
  }
}
