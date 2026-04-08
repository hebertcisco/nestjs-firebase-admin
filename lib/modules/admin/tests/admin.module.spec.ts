import { AdminModule } from '../admin.module';
import {
  ADMIN_MODULE_OPTIONS,
  FIREBASE_ADMIN_INSTANCE_TOKEN,
  FIREBASE_ADMIN_APP,
  ADMIN_MODULE_ID,
} from '../constants/admin.constants';
import { AdminService } from '../services/admin.service';
import { DatabaseService } from '../services/database.service';
import { MessagingService } from '../services/messaging.service';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';

// Mock firebase-admin
jest.mock('firebase-admin', () => ({
  __esModule: true,
  default: {
    initializeApp: jest.fn().mockReturnValue({ name: '[DEFAULT]', options: {} }),
    credential: {
      cert: jest.fn().mockReturnValue('mocked-credential'),
    },
  },
}));

const Admin = jest.requireMock('firebase-admin').default;

describe('AdminModule', () => {
  const mockOptions = {
    credential: {
      projectId: 'test-project',
      clientEmail: 'test@example.com',
      privateKey: 'test-key',
    },
    databaseURL: 'https://test-project.firebaseio.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should return a DynamicModule with all providers and exports', () => {
      const result = AdminModule.register(mockOptions as any);

      expect(result.module).toBe(AdminModule);
      expect(Admin.initializeApp).toHaveBeenCalledWith({
        ...mockOptions,
        credential: 'mocked-credential',
      });
      expect(Admin.credential.cert).toHaveBeenCalledWith(mockOptions.credential);

      const providerTokens = result.providers!.map((p: any) => p.provide || p);
      expect(providerTokens).toContain(ADMIN_MODULE_OPTIONS);
      expect(providerTokens).toContain(FIREBASE_ADMIN_INSTANCE_TOKEN);
      expect(providerTokens).toContain(FIREBASE_ADMIN_APP);
      expect(providerTokens).toContain(ADMIN_MODULE_ID);
      expect(providerTokens).toContain(AdminService);
      expect(providerTokens).toContain(DatabaseService);
      expect(providerTokens).toContain(MessagingService);
      expect(providerTokens).toContain(FirestoreService);
      expect(providerTokens).toContain(AuthService);

      expect(result.exports).toContain(AdminService);
      expect(result.exports).toContain(DatabaseService);
      expect(result.exports).toContain(MessagingService);
      expect(result.exports).toContain(FirestoreService);
      expect(result.exports).toContain(AuthService);
      expect(result.exports).toContain(FIREBASE_ADMIN_INSTANCE_TOKEN);
      expect(result.exports).toContain(FIREBASE_ADMIN_APP);
    });
  });

  describe('registerAsync', () => {
    it('should create a DynamicModule with useFactory', () => {
      const factory = jest.fn().mockReturnValue(mockOptions);
      const result = AdminModule.registerAsync({
        useFactory: factory,
        inject: ['CONFIG'],
      });

      expect(result.module).toBe(AdminModule);
      const providerTokens = result.providers!.map((p: any) => p.provide || p);
      expect(providerTokens).toContain(ADMIN_MODULE_OPTIONS);
      expect(providerTokens).toContain(FIREBASE_ADMIN_INSTANCE_TOKEN);
      expect(providerTokens).toContain(FIREBASE_ADMIN_APP);
      expect(providerTokens).toContain(ADMIN_MODULE_ID);
    });

    it('should use empty inject array when not provided', () => {
      const factory = jest.fn().mockReturnValue(mockOptions);
      const result = AdminModule.registerAsync({
        useFactory: factory,
      });

      const optionsProvider = result.providers!.find(
        (p: any) => p.provide === ADMIN_MODULE_OPTIONS,
      ) as any;
      expect(optionsProvider.inject).toEqual([]);
    });

    it('should set imports from options', () => {
      const mockImport = { module: class TestModule {} } as any;
      const result = AdminModule.registerAsync({
        useFactory: () => mockOptions,
        imports: [mockImport],
      });

      expect(result.imports).toContain(mockImport);
    });

    it('should default imports to empty array', () => {
      const result = AdminModule.registerAsync({
        useFactory: () => mockOptions,
      });

      expect(result.imports).toEqual([]);
    });

    it('should include FIREBASE_ADMIN_APP provider that calls initializeApp via factory', async () => {
      const factory = jest.fn().mockResolvedValue(mockOptions);
      const result = AdminModule.registerAsync({
        useFactory: factory,
        inject: [],
      });

      const appProvider = result.providers!.find(
        (p: any) => p.provide === FIREBASE_ADMIN_APP,
      ) as any;
      expect(appProvider).toBeDefined();
      expect(appProvider.useFactory).toBeDefined();

      // Call the factory to verify it calls Admin.initializeApp
      await appProvider.useFactory();
      expect(Admin.initializeApp).toHaveBeenCalled();
      expect(Admin.credential.cert).toHaveBeenCalledWith(mockOptions.credential);
    });

    it('should throw when useFactory is not provided', () => {
      expect(() =>
        AdminModule.registerAsync({} as any),
      ).toThrow('useFactory is required in registerAsync options');
    });

    it('should export all services and tokens', () => {
      const result = AdminModule.registerAsync({
        useFactory: () => mockOptions,
      });

      expect(result.exports).toContain(AdminService);
      expect(result.exports).toContain(DatabaseService);
      expect(result.exports).toContain(MessagingService);
      expect(result.exports).toContain(FirestoreService);
      expect(result.exports).toContain(AuthService);
      expect(result.exports).toContain(FIREBASE_ADMIN_INSTANCE_TOKEN);
      expect(result.exports).toContain(FIREBASE_ADMIN_APP);
    });
  });
});
