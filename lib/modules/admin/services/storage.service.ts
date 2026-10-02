import { Inject, Injectable } from '@nestjs/common';
import { getDownloadURL, getStorage, Storage } from 'firebase-admin/storage';
import type { File } from '@google-cloud/storage';
import type { App } from 'firebase-admin/app';
import { FIREBASE_ADMIN_APP } from '../constants/admin.constants';

/** Injectable wrapper for Firebase Cloud Storage. */
@Injectable()
export class StorageService {
  private readonly storage: Storage;

  constructor(@Inject(FIREBASE_ADMIN_APP) app: App) {
    this.storage = getStorage(app);
  }

  get service(): Storage {
    return this.storage;
  }

  /** Returns a reference to a configured or explicitly named bucket. */
  bucket(name?: string): ReturnType<Storage['bucket']> {
    return this.storage.bucket(name);
  }

  /** Returns a file reference without requiring callers to access the SDK directly. */
  file(path: string, bucketName?: string): File {
    return this.bucket(bucketName).file(path);
  }

  /** Uploads a local file and returns its Storage file reference. */
  async upload(
    localPath: string,
    destination?: string,
    bucketName?: string,
  ): Promise<File> {
    const bucket = this.bucket(bucketName);
    const [file] = await bucket.upload(
      localPath,
      destination ? { destination } : undefined,
    );
    return file;
  }

  /** Gets a signed download URL using Firebase Admin's helper. */
  getDownloadURL(file: File): Promise<string> {
    return getDownloadURL(file);
  }
}
