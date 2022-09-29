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

@Injectable()
export class AdminService {
  public constructor(
    @Inject(FIREBASE_ADMIN_INSTANCE_TOKEN)
    protected readonly options: AdminModuleOptions,
  ) { }
  public applicationDefault(httpAgent?: Agent) {
    return applicationDefault(httpAgent);
  }
  public deleteApp(app: App): Promise<void> {
    return deleteApp(app);
  }
  public get getApps(): App[] {
    return getApps();
  }
  public get getApp(): App {
    return getApp();
  }
  public admin() {
    Admin.initializeApp({
      ...this.options,
      credential: Admin.credential.cert(this.options.credential)
    });
    return Admin;
  }
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

  public get appRef(): App {
    return this.initializeApp();
  }
  public initializeApp(): App {
    let options: AdminModuleOptions = undefined;
    if ('credential' in this.options) {
      options.credential = this.options.credential;
    }
    if ('databaseAuthVariableOverride' in this.options) {
      options.databaseAuthVariableOverride = this.options.databaseAuthVariableOverride;
    }
    if ('databaseURL' in this.options) {
      options.databaseURL = this.options.databaseURL;
    }
    if ('httpAgent' in this.options) {
      options.httpAgent = this.options.httpAgent;
    }
    if ('projectId' in this.options) {
      options.projectId = this.options.projectId;
    }
    if ('serviceAccountId' in this.options) {
      options.serviceAccountId = this.options.serviceAccountId;
    }
    if ('storageBucket' in this.options) {
      options.storageBucket = this.options.storageBucket;
    }
    if (!options && this.options.credential) {
      return Admin.initializeApp({
        credential: Admin.credential.cert(this.options.credential)
      });
    }
    return this.admin().initializeApp({
      ...options,
      credential: Admin.credential.cert(this.options.credential)
    });

  }
}
