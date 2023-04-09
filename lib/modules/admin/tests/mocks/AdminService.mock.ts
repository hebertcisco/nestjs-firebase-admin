import { Observable } from 'rxjs';
import type { App } from 'firebase-admin/app';
import type { AppOptions, Credential } from 'firebase-admin/app';

import { Agent } from 'node:http';

export class AdminServiceMock {
  private name = 'mock';
  private options: AppOptions = {
    credential: null,
    databaseURL: 'https://mock.firebaseio.com',
    storageBucket: 'mock.appspot.com',
    projectId: 'mock',
    httpAgent: new Agent(),
  } as unknown as AppOptions;

  public applicationDefault(): Credential {
    return this.options.credential as Credential;
  }
  public deleteApp(app: App): Promise<void> {
    test(app.name);
    return Promise.resolve();
  }
  public get getApps(): App[] {
    return [this.initializeApp()];
  }
  public get getApp(): App {
    return this.initializeApp();
  }
  public initializeApp(): App {
    return {
      name: this.name,
      options: this.options,
    };
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
