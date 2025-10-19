import { s3 } from "./s3Client";
import { Upload } from "@aws-sdk/lib-storage";
import { Environments } from "../../environments";
import mime from "mime";

const env = Environments.getEnvs();

export async function uploadCatalogoPictures(
  catalogoId: string,
  files: Express.Multer.File[]
) {
  const uploads = files.map(async (file, index) => {
    const ext = mime.getExtension(file.mimetype) || "bin";
    const key = `${catalogoId}/pic${index + 1}.${ext}`;

    const upload = new Upload({
      client: s3,
      params: {
        Bucket: env.s3Bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
    });

    await upload.done();

    return `https://${env.cdnDomain}/${key}`;
  });

  return Promise.all(uploads);
}
