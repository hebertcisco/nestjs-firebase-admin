import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { AdminService } from '../services/admin.service';
import { getAuth } from 'firebase-admin/auth';
import {
  UserRecord,
  DecodedIdToken,
  ListUsersResult,
} from 'firebase-admin/auth';

// Mock firebase-admin/auth
jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn().mockReturnValue({
    createUser: jest.fn(),
    getUser: jest.fn(),
    getUserByEmail: jest.fn(),
    getUserByPhoneNumber: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    createCustomToken: jest.fn(),
    verifyIdToken: jest.fn(),
    setCustomUserClaims: jest.fn(),
    listUsers: jest.fn(),
  }),
}));

describe('AuthService', () => {
  let service: AuthService;
  let mockAuth: jest.Mocked<ReturnType<typeof getAuth>>;

  const mockUser: Partial<UserRecord> = {
    uid: 'test-uid',
    email: 'test@example.com',
    emailVerified: false,
    displayName: 'Test User',
    photoURL: 'https://example.com/photo.jpg',
    phoneNumber: '+1234567890',
    disabled: false,
    metadata: {
      creationTime: '2024-01-01T00:00:00.000Z',
      lastSignInTime: '2024-01-01T00:00:00.000Z',
      toJSON: () => ({}),
    },
    providerData: [],
    toJSON: () => ({}),
  };

  const mockDecodedToken: Partial<DecodedIdToken> = {
    uid: 'test-uid',
    role: 'admin',
    aud: 'test-aud',
    auth_time: 1234567890,
    exp: 1234567890,
    firebase: {
      sign_in_provider: 'custom',
      identities: {},
    },
    iat: 1234567890,
    iss: 'https://securetoken.google.com/test-project',
    sub: 'test-uid',
  };

  const mockListUsersResult: Partial<ListUsersResult> = {
    users: [mockUser as UserRecord],
    pageToken: 'next-page-token',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AdminService,
          useValue: {
            appRef: { name: 'test-app' },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockAuth = getAuth() as jest.Mocked<ReturnType<typeof getAuth>>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      mockAuth.createUser.mockResolvedValueOnce(mockUser as UserRecord);

      const result = await service.createUser({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockAuth.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUser', () => {
    it('should get a user by UID', async () => {
      mockAuth.getUser.mockResolvedValueOnce(mockUser as UserRecord);

      const result = await service.getUser('test-uid');

      expect(mockAuth.getUser).toHaveBeenCalledWith('test-uid');
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserByEmail', () => {
    it('should get a user by email', async () => {
      mockAuth.getUserByEmail.mockResolvedValueOnce(mockUser as UserRecord);

      const result = await service.getUserByEmail('test@example.com');

      expect(mockAuth.getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserByPhoneNumber', () => {
    it('should get a user by phone number', async () => {
      mockAuth.getUserByPhoneNumber.mockResolvedValueOnce(
        mockUser as UserRecord,
      );

      const result = await service.getUserByPhoneNumber('+1234567890');

      expect(mockAuth.getUserByPhoneNumber).toHaveBeenCalledWith('+1234567890');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updatedUser = { ...mockUser, displayName: 'Updated Name' };
      mockAuth.updateUser.mockResolvedValueOnce(updatedUser as UserRecord);

      const result = await service.updateUser('test-uid', {
        displayName: 'Updated Name',
      });

      expect(mockAuth.updateUser).toHaveBeenCalledWith('test-uid', {
        displayName: 'Updated Name',
      });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      await service.deleteUser('test-uid');

      expect(mockAuth.deleteUser).toHaveBeenCalledWith('test-uid');
    });
  });

  describe('createCustomToken', () => {
    it('should create a custom token', async () => {
      const mockToken = 'custom-token';
      mockAuth.createCustomToken.mockResolvedValueOnce(mockToken);

      const result = await service.createCustomToken('test-uid', {
        role: 'admin',
      });

      expect(mockAuth.createCustomToken).toHaveBeenCalledWith('test-uid', {
        role: 'admin',
      });
      expect(result).toBe(mockToken);
    });
  });

  describe('verifyIdToken', () => {
    it('should verify an ID token', async () => {
      mockAuth.verifyIdToken.mockResolvedValueOnce(
        mockDecodedToken as DecodedIdToken,
      );

      const result = await service.verifyIdToken('id-token');

      expect(mockAuth.verifyIdToken).toHaveBeenCalledWith('id-token');
      expect(result).toEqual(mockDecodedToken);
    });
  });

  describe('setCustomUserClaims', () => {
    it('should set custom claims', async () => {
      await service.setCustomUserClaims('test-uid', { role: 'admin' });

      expect(mockAuth.setCustomUserClaims).toHaveBeenCalledWith('test-uid', {
        role: 'admin',
      });
    });
  });

  describe('listUsers', () => {
    it('should list users with pagination', async () => {
      mockAuth.listUsers.mockResolvedValueOnce(
        mockListUsersResult as ListUsersResult,
      );

      const result = await service.listUsers(10, 'page-token');

      expect(mockAuth.listUsers).toHaveBeenCalledWith(10, 'page-token');
      expect(result).toEqual(mockListUsersResult);
    });

    it('should list users without pagination', async () => {
      const resultWithoutPageToken = {
        ...mockListUsersResult,
        pageToken: undefined,
      };
      mockAuth.listUsers.mockResolvedValueOnce(
        resultWithoutPageToken as ListUsersResult,
      );

      const result = await service.listUsers();

      expect(mockAuth.listUsers).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toEqual(resultWithoutPageToken);
    });
  });

  describe('error handling', () => {
    it('should propagate errors from Firebase Auth', async () => {
      const error = new Error('Firebase Auth error');
      mockAuth.getUser.mockRejectedValueOnce(error);

      await expect(service.getUser('test-uid')).rejects.toThrow(
        'Firebase Auth error',
      );
    });
  });
});
