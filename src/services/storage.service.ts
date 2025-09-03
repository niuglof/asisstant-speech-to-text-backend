import { Storage } from '@google-cloud/storage';
import path from 'path';

export class StorageService {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE, // Optional: for service account key file
    });
    this.bucketName = process.env.DOCUMENTS_BUCKET || 'docflow-documents';
  }

  async uploadFile(buffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(fileName);

      const stream = file.createWriteStream({
        metadata: {
          contentType: mimeType,
        },
        public: false, // Set to true if you want files to be publicly accessible
      });

      return new Promise((resolve, reject) => {
        stream.on('error', (err) => {
          reject(new Error(`Upload error: ${err.message}`));
        });

        stream.on('finish', async () => {
          try {
            // Generate a signed URL that expires in 1 hour
            const [signedUrl] = await file.getSignedUrl({
              action: 'read',
              expires: Date.now() + 60 * 60 * 1000, // 1 hour
            });
            resolve(signedUrl);
          } catch (error) {
            reject(new Error(`Error generating signed URL: ${error}`));
          }
        });

        stream.end(buffer);
      });
    } catch (error) {
      throw new Error(`Storage upload failed: ${error}`);
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(fileName);
      
      await file.delete();
    } catch (error) {
      throw new Error(`Storage delete failed: ${error}`);
    }
  }

  async getFile(fileName: string): Promise<Buffer> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(fileName);
      
      const [buffer] = await file.download();
      return buffer;
    } catch (error) {
      throw new Error(`Storage download failed: ${error}`);
    }
  }

  async fileExists(fileName: string): Promise<boolean> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(fileName);
      
      const [exists] = await file.exists();
      return exists;
    } catch (error) {
      return false;
    }
  }

  async getSignedUrl(fileName: string, expiresInMinutes: number = 60): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(fileName);
      
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + expiresInMinutes * 60 * 1000,
      });
      
      return signedUrl;
    } catch (error) {
      throw new Error(`Error generating signed URL: ${error}`);
    }
  }

  // Alternative implementation for local development using file system
  async uploadFileLocal(buffer: Buffer, fileName: string): Promise<string> {
    const fs = require('fs').promises;
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    
    try {
      // Ensure upload directory exists
      await fs.mkdir(uploadPath, { recursive: true });
      
      const filePath = path.join(uploadPath, fileName);
      await fs.writeFile(filePath, buffer);
      
      // Return local file URL
      return `file://${path.resolve(filePath)}`;
    } catch (error) {
      throw new Error(`Local upload failed: ${error}`);
    }
  }

  // Get the appropriate upload method based on environment
  async uploadFileWithFallback(buffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    const useLocalStorage = process.env.NODE_ENV === 'development' && !process.env.GOOGLE_CLOUD_PROJECT_ID;
    
    if (useLocalStorage) {
      return await this.uploadFileLocal(buffer, fileName);
    } else {
      return await this.uploadFile(buffer, fileName, mimeType);
    }
  }
}