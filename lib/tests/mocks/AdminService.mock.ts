import { Observable } from 'rxjs';
import { Agent } from 'node:http';
import type { ServiceAccount } from 'firebase-admin/app';
import type { AppOptions, Credential } from 'firebase-admin/app';
import type { App } from 'firebase-admin/app';

// Extends the App interface to include the delete method
declare module 'firebase-admin/app' {
  interface App {
    delete(): Promise<void>;
  }
}

/**
 * Mock implementation of AdminService for testing purposes.
 *
 * This mock simulates the behavior of the Firebase Admin SDK
 * without making actual calls. Provides predictable responses
 * for testing Firebase admin operations.
 */
export class AdminServiceMock {
  private name = 'mock';
  private readonly mockAdmin: any;
  private apps: App[] = [];

  private options: AppOptions = {
    credential: null,
    databaseURL: 'https://mock.firebaseio.com',
    storageBucket: 'mock.appspot.com',
    projectId: 'mock',
    httpAgent: new Agent(),
  } as unknown as AppOptions;

  constructor() {
    this.mockAdmin = {
      initializeApp: jest.fn().mockImplementation(options => {
        const app = {
          name: this.name,
          options: options || this.options,
          delete: jest.fn().mockResolvedValue(undefined),
        };
        this.apps.push(app);
        return app;
      }),
      credential: {
        cert: jest.fn().mockImplementation((credential: ServiceAccount) => {
          return credential;
        }),
      },
      app: jest.fn().mockImplementation((name?: string) => {
        const app = this.apps.find(a => a.name === (name || this.name));
        if (!app) {
          throw new Error(`App named "${name || '[DEFAULT]'}" does not exist`);
        }
        return app;
      }),
    };

    // Initialize a default app
    this.mockAdmin.initializeApp(this.options);
  }

  /**
   * Gets the default credentials for the application.
   */
  public applicationDefault(httpAgent?: Agent): Credential {
    return this.options.credential as Credential;
  }

  /**
   * Deletes a Firebase Admin app instance.
   */
  public deleteApp(app: App): Promise<void> {
    const index = this.apps.findIndex(a => a === app);
    if (index >= 0) {
      this.apps.splice(index, 1);
    }
    return app.delete();
  }

  /**
   * Gets all initialized Firebase Admin app instances.
   */
  public get getApps(): App[] {
    return [...this.apps];
  }

  /**
   * Gets the default Firebase Admin app instance.
   */
  public get getApp(): App {
    if (this.apps.length === 0) {
      throw new Error("No Firebase app '[DEFAULT]' has been created");
    }
    return this.apps[0];
  }

  /**
   * Gets the Firebase Admin SDK instance.
   */
  public admin() {
    return this.mockAdmin;
  }

  /**
   * Initializes a new Firebase Admin app instance.
   * */
  public initializeApp(): App {
    return this.mockAdmin.initializeApp(this.options);
  }

  /**
   * Creates an Observable that emits the initialized Firebase Admin app instance.
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
   */
  public get appRef(): App {
    return this.initializeApp();
  }

  /**
   * Resets all mocks to their initial state.
   * Useful for cleaning between tests.
   */
  public resetMocks() {
    this.apps = [];
    this.mockAdmin.initializeApp.mockClear();
    this.mockAdmin.credential.cert.mockClear();
    this.mockAdmin.app.mockClear();

    // Reset a default app
    this.mockAdmin.initializeApp(this.options);
  }

  /**
   * Simulates an error in a specific method.
   */
  public simulateError(method: string, error: Error) {
    if (method === 'initializeApp') {
      this.mockAdmin.initializeApp.mockImplementationOnce(() => {
        throw error;
      });
    } else if (method === 'deleteApp') {
      const app = this.getApp;
      app.delete = jest.fn().mockRejectedValueOnce(error);
    } else if (method === 'getApp') {
      this.apps = []; // Force App Not Found Error
    }
  }
}
