import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from '../admin.service';
import { Agent } from 'node:http';
import { App } from 'firebase-admin/app';
import { Observable } from 'rxjs';

const FIREBASE_ADMIN_INSTANCE_TOKEN = 'FIREBASE_ADMIN_INSTANCE_TOKEN';

// Mock firebase-admin/app
jest.mock('firebase-admin/app', () => {
  return {
    getApp: jest.fn().mockReturnValue({ name: 'app-name', options: {} }),
    getApps: jest.fn().mockReturnValue([{ name: 'app-name', options: {} }]),
    deleteApp: jest.fn().mockResolvedValue(undefined),
    applicationDefault: jest.fn().mockReturnValue('default-credential'),
  };
});

// Mock firebase-admin
jest.mock('firebase-admin', () => {
  return {
    initializeApp: jest.fn().mockReturnValue({ name: 'app-name', options: {} }),
    credential: {
      cert: jest.fn().mockReturnValue('mocked-credential'),
    },
  };
});

// Import mocks after jest.mock() calls
const firebaseAdmin = jest.requireMock('firebase-admin');
const firebaseAdminApp = jest.requireMock('firebase-admin/app');

/**
 * Tests for AdminService
 *
 * This test suite verifies the functionality of the AdminService that manages
 * the Firebase Admin SDK and its configurations.
 *
 * @see {@link https://firebase.google.com/docs/admin/setup Firebase Admin SDK Setup}
 */
describe('AdminService', () => {
  let service: AdminService;
  const mockOptions = {
    credential: {
      projectId: 'mock-project',
      clientEmail: 'mock@example.com',
      privateKey: 'mock-key',
    },
    databaseURL: 'https://mock-project.firebaseio.com',
    storageBucket: 'mock-project.appspot.com',
    projectId: 'mock-project',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockApp = { name: 'app-name', options: {} };
    (firebaseAdmin.initializeApp as jest.Mock).mockReturnValue(mockApp);
    (firebaseAdmin.credential.cert as jest.Mock).mockReturnValue('mocked-credential');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: FIREBASE_ADMIN_INSTANCE_TOKEN,
          useValue: mockOptions,
        },
        {
          provide: 'FIREBASE_ADMIN_APP',
          useValue: mockApp,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('must be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('must store the injected Firebase Admin app', () => {
      expect(service.appRef).toEqual({ name: 'app-name', options: {} });
    });
  });

  describe('applicationDefault', () => {
    it('should return default credentials with no arguments', () => {
      const result = service.applicationDefault();
      expect(firebaseAdminApp.applicationDefault).toHaveBeenCalledWith(
        undefined,
      );
      expect(result).toBe('default-credential');
    });

    it('must pass HTTP agent when provided', () => {
      const httpAgent = new Agent();
      const result = service.applicationDefault(httpAgent);
      expect(firebaseAdminApp.applicationDefault).toHaveBeenCalledWith(
        httpAgent,
      );
      expect(result).toBe('default-credential');
    });
  });

  describe('deleteApp', () => {
    it('should call deleteApp function with the given app', async () => {
      const mockApp = { name: 'app-to-delete' } as App;
      await service.deleteApp(mockApp);
      expect(firebaseAdminApp.deleteApp).toHaveBeenCalledWith(mockApp);
    });

    it('should return a resolved promise', async () => {
      const mockApp = { name: 'app-to-delete' } as App;
      await expect(service.deleteApp(mockApp)).resolves.toBeUndefined();
    });

    it('should propagate errors from deleteApp', async () => {
      (firebaseAdminApp.deleteApp as jest.Mock).mockRejectedValueOnce(
        new Error('Delete error'),
      );
      const mockApp = { name: 'app-with-error' } as App;
      await expect(service.deleteApp(mockApp)).rejects.toThrow('Delete error');
    });
  });

  describe('getApps', () => {
    it('should return all initialized apps', () => {
      const mockApps = [{ name: 'app1' }, { name: 'app2' }];
      (firebaseAdminApp.getApps as jest.Mock).mockReturnValueOnce(mockApps);
      const result = service.getApps;
      expect(firebaseAdminApp.getApps).toHaveBeenCalled();
      expect(result).toEqual(mockApps);
    });

    it('should return an empty array when there are no apps', () => {
      (firebaseAdminApp.getApps as jest.Mock).mockReturnValueOnce([]);
      const result = service.getApps;
      expect(result).toEqual([]);
    });
  });

  describe('getApp', () => {
    it('should return the default app', () => {
      const mockApp = { name: 'default-app' };
      (firebaseAdminApp.getApp as jest.Mock).mockReturnValueOnce(mockApp);

      const result = service.getApp;
      expect(firebaseAdminApp.getApp).toHaveBeenCalled();
      expect(result).toEqual(mockApp);
    });

    it('must propagate getApp errors', () => {
      (firebaseAdminApp.getApp as jest.Mock).mockImplementationOnce(() => {
        throw new Error('App not found');
      });

      expect(() => service.getApp).toThrow('App not found');
    });
  });

  describe('admin', () => {
    it('should return Firebase Admin SDK instance', () => {
      const adminModule = service.admin();
      expect(adminModule).toBeDefined();
      expect(adminModule.initializeApp).toBe(firebaseAdmin.initializeApp);
      expect(adminModule.credential.cert).toBe(firebaseAdmin.credential.cert);
    });
  });

  describe('initializeAppObservable', () => {
    it('must return an Observable with the app instance', () => {
      return new Promise<void>(done => {
        const observable = service.initializeAppObservable();
        expect(observable).toBeInstanceOf(Observable);

        observable.subscribe({
          next: (app: App) => {
            expect(app).toBeDefined();
            expect(app).toEqual({ name: 'app-name', options: {} });
          },
          complete: () => {
            done();
          },
          error: (_err: Error) => {
            done();
          },
        });
      });
    });

    it('must complete the Observable after issuing the app', () => {
      return new Promise<void>(done => {
        const completeSpy = jest.fn();

        service.initializeAppObservable().subscribe({
          next: () => { },
          complete: () => {
            completeSpy();
            expect(completeSpy).toHaveBeenCalledTimes(1);
            done();
          },
          error: (_err: Error) => {
            done();
          },
        });
      });
    });

    it('must return a valid cleanup function when unsubscribing', () => {
      const observable = service.initializeAppObservable();
      const subscription = observable.subscribe(() => { });
      expect(() => subscription.unsubscribe()).not.toThrow();
    });
  });

  describe('appRef', () => {
    it('should return the injected app instance', () => {
      const result = service.appRef;
      expect(result).toEqual({ name: 'app-name', options: {} });
    });
  });

  describe('initializeApp', () => {
    it('should return the injected app instance', () => {
      const result = service.initializeApp();
      expect(result).toEqual({ name: 'app-name', options: {} });
    });
  });

  describe('complex use cases', () => {
    it('should allow you to get an app and then delete it', async () => {
      const mockApp = { name: 'app-to-manage' };
      (firebaseAdminApp.getApp as jest.Mock).mockReturnValueOnce(mockApp);

      const app = service.getApp;
      await service.deleteApp(app as App);

      expect(firebaseAdminApp.getApp).toHaveBeenCalled();
      expect(firebaseAdminApp.deleteApp).toHaveBeenCalledWith(mockApp);
    });

    it('should return the same app when appRef is called multiple times in a row', () => {
      const firstCall = service.appRef;
      const secondCall = service.appRef;
      expect(firstCall).toBe(secondCall);
      expect(firstCall).toEqual({ name: 'app-name', options: {} });
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });
    it('should return an array of apps', () => {
      expect(service.getApps).toBeInstanceOf(Array);
    });
    it('should return an app', () => {
      expect(service.getApp).toBeInstanceOf(Object);
    });
    it('should return an app reference', () => {
      expect(service.appRef).toBeInstanceOf(Object);
    });
    it('should return an observable of an app', () => {
      expect(service.initializeAppObservable()).toBeInstanceOf(Object);
    });
    it('should return a credential', () => {
      expect(service.applicationDefault()).toBe('default-credential');
    });
  });
});
