import { S3Client } from "@aws-sdk/client-s3";
import { Environments } from "../../../environments";

const env = Environments.getEnvs();

console.log(env.awsRegion)

export const s3 = new S3Client({
  region: env.awsRegion,
  credentials: env.awsKeyID
    ? {
        accessKeyId: env.awsKeyID,
        secretAccessKey: env.awsSecretKey,
      }
    : undefined,
});
