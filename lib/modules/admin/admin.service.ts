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
  ) {
    Admin.initializeApp({
      ...this.options,
      credential: Admin.credential.cert(this.options.credential),
    });
  }
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
    return this.admin().initializeApp({
      ...this.options,
      credential: Admin.credential.cert(this.options.credential),
    });
  }
}
