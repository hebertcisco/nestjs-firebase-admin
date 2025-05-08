import { Inject, Injectable } from '@nestjs/common';

import { Observable } from 'rxjs';
import {
  getApp,
  getApps,
  deleteApp,
  applicationDefault,
} from 'firebase-admin/app';

import Admin from 'firebase-admin';

import type { App } from 'firebase-admin/app';
import type { Agent } from 'node:http';

import { FIREBASE_ADMIN_INSTANCE_TOKEN } from './admin.constants';
import type { AdminModuleOptions } from './types';

/**
 * Service for managing Firebase Admin SDK instances and configurations.
 *
 * This service provides a wrapper around the Firebase Admin SDK's core functionality,
 * offering methods to initialize, manage, and access Firebase Admin instances.
 *
 * @see {@link https://firebase.google.com/docs/admin/setup Firebase Admin SDK Setup}
 * @see {@link https://firebase.google.com/docs/reference/admin/node/firebase-admin Firebase Admin SDK Reference}
 *
 * @example
 * ```typescript
 * // Initialize Firebase Admin
 * const adminService = new AdminService(options);
 *
 * // Get Firebase Admin instance
 * const admin = adminService.admin();
 *
 * // Get initialized app
 * const app = adminService.getApp;
 * ```
 */
@Injectable()
export class AdminService {
  /**
   * Creates an instance of AdminService and initializes Firebase Admin SDK.
   *
   * @param options - Configuration options for Firebase Admin SDK
   * @see {@link https://firebase.google.com/docs/admin/setup#initialize-sdk Initialize SDK}
   */
  public constructor(
    @Inject(FIREBASE_ADMIN_INSTANCE_TOKEN)
    protected readonly options: AdminModuleOptions,
  ) {
    Admin.initializeApp({
      ...this.options,
      credential: Admin.credential.cert(this.options.credential),
    });
  }

  /**
   * Gets the default application credentials.
   *
   * @param httpAgent - Optional HTTP agent for the credentials
   * @returns The default application credentials
   * @see {@link https://firebase.google.com/docs/admin/setup#initialize-sdk Initialize SDK}
   */
  public applicationDefault(httpAgent?: Agent) {
    return applicationDefault(httpAgent);
  }

  /**
   * Deletes a Firebase Admin app instance.
   *
   * @param app - The Firebase Admin app instance to delete
   * @returns Promise that resolves when the app is deleted
   * @see {@link https://firebase.google.com/docs/reference/admin/node/firebase-admin.app#deleteapp Firebase Admin deleteApp}
   */
  public deleteApp(app: App): Promise<void> {
    return deleteApp(app);
  }

  /**
   * Gets all initialized Firebase Admin app instances.
   *
   * @returns Array of initialized Firebase Admin app instances
   * @see {@link https://firebase.google.com/docs/reference/admin/node/firebase-admin.app#getapps Firebase Admin getApps}
   */
  public get getApps(): App[] {
    return getApps();
  }

  /**
   * Gets the default Firebase Admin app instance.
   *
   * @returns The default Firebase Admin app instance
   * @see {@link https://firebase.google.com/docs/reference/admin/node/firebase-admin.app#getapp Firebase Admin getApp}
   */
  public get getApp(): App {
    return getApp();
  }

  /**
   * Gets the Firebase Admin SDK instance.
   *
   * @returns The Firebase Admin SDK instance
   * @see {@link https://firebase.google.com/docs/reference/admin/node/firebase-admin Firebase Admin SDK}
   */
  public admin() {
    return Admin;
  }

  /**
   * Creates an Observable that emits the initialized Firebase Admin app instance.
   *
   * @returns Observable that emits the Firebase Admin app instance
   * @see {@link https://firebase.google.com/docs/reference/admin/node/firebase-admin.app#initializeapp Firebase Admin initializeApp}
   */
  public initializeAppObservable<T = App>(): Observable<App> {
    return new Observable<App>(subscriber => {
      subscriber.next(this.appRef);
      subscriber.complete();
      return () => {
        if (this.appRef.name) {
          return this.appRef;
        }
        return this.getApp;
      };
    });
  }

  /**
   * Gets the initialized Firebase Admin app instance.
   *
   * @returns The initialized Firebase Admin app instance
   * @see {@link https://firebase.google.com/docs/reference/admin/node/firebase-admin.app#initializeapp Firebase Admin initializeApp}
   */
  public get appRef(): App {
    return this.initializeApp();
  }

  /**
   * Initializes a new Firebase Admin app instance.
   *
   * @returns The initialized Firebase Admin app instance
   * @see {@link https://firebase.google.com/docs/reference/admin/node/firebase-admin.app#initializeapp Firebase Admin initializeApp}
   */
  public initializeApp(): App {
    return this.admin().initializeApp({
      ...this.options,
      credential: Admin.credential.cert(this.options.credential),
    });
  }
}
