import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../services/database.service';
import {
  FIREBASE_ADMIN_INSTANCE_TOKEN,
  FIREBASE_ADMIN_APP,
} from '../constants/admin.constants';

const mockRef = {
  get: jest.fn(),
  set: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  push: jest.fn(),
};

jest.mock('firebase-admin/database', () => ({
  getDatabase: jest.fn().mockReturnValue({
    ref: jest.fn().mockImplementation(() => mockRef),
  }),
  Database: jest.fn(),
}));

describe('DatabaseService', () => {
  let service: DatabaseService;

  const mockOptions = {
    credential: {
      projectId: 'test-project',
      clientEmail: 'test@example.com',
      privateKey: 'test-key',
    },
    databaseURL: 'https://test-project.firebaseio.com',
  };

  const mockApp = { name: 'test-app', options: {} };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockRef.get.mockResolvedValue({ val: () => 'mock-data' });
    mockRef.set.mockResolvedValue(undefined);
    mockRef.update.mockResolvedValue(undefined);
    mockRef.remove.mockResolvedValue(undefined);
    mockRef.push.mockResolvedValue({ key: 'mock-key' });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: FIREBASE_ADMIN_INSTANCE_TOKEN,
          useValue: mockOptions,
        },
        {
          provide: FIREBASE_ADMIN_APP,
          useValue: mockApp,
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ref', () => {
    it('should return a database reference for a path', () => {
      const ref = service.ref('test-path');
      expect(ref).toBeDefined();
    });
  });

  describe('get', () => {
    it('should get data from a path', async () => {
      const data = await service.get('test-path');
      expect(mockRef.get).toHaveBeenCalled();
      expect(data).toBe('mock-data');
    });

    it('should return null when data does not exist', async () => {
      mockRef.get.mockResolvedValueOnce({ val: () => null });
      const data = await service.get('empty-path');
      expect(data).toBeNull();
    });
  });

  describe('set', () => {
    it('should set data at a path', async () => {
      const testData = { name: 'test' };
      await service.set('test-path', testData);
      expect(mockRef.set).toHaveBeenCalledWith(testData);
    });
  });

  describe('update', () => {
    it('should update data at a path', async () => {
      const testData = { name: 'updated' };
      await service.update('test-path', testData);
      expect(mockRef.update).toHaveBeenCalledWith(testData);
    });
  });

  describe('remove', () => {
    it('should remove data at a path', async () => {
      await service.remove('test-path');
      expect(mockRef.remove).toHaveBeenCalled();
    });
  });

  describe('push', () => {
    it('should push data and return the key', async () => {
      const testData = { name: 'new-item' };
      const key = await service.push('test-path', testData);
      expect(mockRef.push).toHaveBeenCalledWith(testData);
      expect(key).toBe('mock-key');
    });

    it('should return empty string when key is null', async () => {
      mockRef.push.mockResolvedValueOnce({ key: null });
      const key = await service.push('test-path', { name: 'test' });
      expect(key).toBe('');
    });
  });
});
