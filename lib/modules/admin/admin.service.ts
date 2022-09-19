import { Inject } from '@nestjs/common';

import { Observable } from 'rxjs';
import {
  initializeApp,
  getApp,
  getApps,
  deleteApp,
  applicationDefault,
} from 'firebase-admin/app';
import type { App } from 'firebase-admin/app';

import { FIREBASE_ADMIN_INSTANCE_TOKEN } from './admin.constants';
import type { AdminModuleOptions } from './types';

export class AdminService {
  public constructor(
    @Inject(FIREBASE_ADMIN_INSTANCE_TOKEN)
    protected readonly options: AdminModuleOptions,
  ) {}
  public applicationDefault() {
    return applicationDefault();
  }
  public deleteApp(app: App) {
    return deleteApp(app);
  }
  public get getApps() {
    return getApps();
  }
  public get getApp() {
    return getApp();
  }

  public initializeApp(): App {
    return initializeApp({
      ...this.options,
    });
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
}
