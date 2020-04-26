import { v2 as cloudinary } from 'cloudinary';
import { Stream } from 'stream';

type File = Promise<{
  mimetype: string;
  createReadStream: () => Stream;
}>;

interface UploadResponse {
  publicId: string;
  contentType: string;
  width: number;
  height: number;
  format: string;
  resourceType: 'image' | 'raw' | 'video';
  bytes: number;
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  const { mimetype, createReadStream } = await file;

  const {
    public_id: publicId,
    width,
    height,
    format,
    resource_type: resourceType,
    bytes,
    // info = null,
  } = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        // categorization: 'google_tagging',
      },
      (error, image) => {
        if (error) {
          return reject(error);
        }
        return resolve(image);
      },
    );

    createReadStream().pipe(uploadStream);
  });

  return {
    publicId,
    contentType: mimetype,
    width,
    height,
    format,
    resourceType,
    bytes,
  };
}

export async function destroy(publicId: string): Promise<void> {
  return cloudinary.uploader.destroy(publicId);
}
