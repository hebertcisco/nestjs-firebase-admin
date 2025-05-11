import { Injectable, Inject } from '@nestjs/common';
import {
  getFirestore,
  Firestore,
  CollectionReference,
  DocumentReference,
  Query,
  DocumentData,
  SetOptions,
  UpdateData,
  WithFieldValue,
} from 'firebase-admin/firestore';
import { FIREBASE_ADMIN_INSTANCE_TOKEN } from '../constants/admin.constants';
import type { AdminModuleOptions } from '../types';
import { App } from 'firebase-admin/app';

/**
 * Service for interacting with Firestore.
 *
 * This service provides a wrapper around the Firebase Admin SDK's Firestore functionality,
 * offering a clean and type-safe interface for Firestore operations.
 *
 * @see {@link https://firebase.google.com/docs/firestore Firestore Admin SDK}
 */
@Injectable()
export class FirestoreService {
  private app: App;
  private firestore: Firestore;

  constructor(
    @Inject(FIREBASE_ADMIN_INSTANCE_TOKEN)
    protected readonly options: AdminModuleOptions,
    @Inject('FIREBASE_ADMIN_APP')
    private readonly firebaseApp: App,
  ) {
    this.app = firebaseApp;
    this.firestore = getFirestore();
  }

  /**
   * Get a reference to a collection.
   * @param path Collection path
   */
  collection<T = DocumentData>(path: string): CollectionReference<T> {
    return this.firestore.collection(path) as CollectionReference<T>;
  }

  /**
   * Get a reference to a document.
   * @param path Document path
   */
  doc<T = DocumentData>(path: string): DocumentReference<T> {
    return this.firestore.doc(path) as DocumentReference<T>;
  }

  /**
   * Get a document's data.
   * @param path Document path
   */
  async get<T = DocumentData>(path: string): Promise<T | null> {
    const docSnap = await this.doc<T>(path).get();
    return docSnap.exists ? (docSnap.data() as T) : null;
  }

  /**
   * Set a document's data (overwrite).
   * @param path Document path
   * @param data Data to set
   * @param options Firestore set options
   */
  async set<T = DocumentData>(
    path: string,
    data: WithFieldValue<T>,
    options?: SetOptions,
  ): Promise<void> {
    if (options) {
      await this.doc<T>(path).set(data, options);
    } else {
      await this.doc<T>(path).set(data);
    }
  }

  /**
   * Update a document's data (partial update).
   * @param path Document path
   * @param data Data to update
   */
  async update<T = DocumentData>(
    path: string,
    data: Record<string, any>,
  ): Promise<void> {
    if (!data || typeof data !== 'object') {
      throw new Error('Update data must be a non-null object');
    }
    await this.doc<T>(path).update(data);
  }

  /**
   * Delete a document.
   * @param path Document path
   */
  async delete(path: string): Promise<void> {
    await this.doc(path).delete();
  }

  /**
   * Add a document to a collection (auto-ID).
   * @param collectionPath Collection path
   * @param data Data to add
   * @returns The new document reference
   */
  async add<T = DocumentData>(
    collectionPath: string,
    data: WithFieldValue<T>,
  ): Promise<DocumentReference<T>> {
    return await this.collection<T>(collectionPath).add(data);
  }

  /**
   * Query a collection with constraints.
   * @param collectionPath Collection path
   * @param constraints Query constraints (e.g. where, orderBy, limit, etc.)
   * @returns Array of documents
   */
  async query<T = DocumentData>(
    collectionPath: string,
    ...constraints: any[]
  ): Promise<T[]> {
    let q: Query<T> = this.collection<T>(collectionPath);
    if (constraints.length) {
      for (const constraint of constraints) {
        q = constraint(q);
      }
    }
    const snap = await (q as Query<T>).get();
    return snap.docs.map(doc => doc.data() as T);
  }
}
