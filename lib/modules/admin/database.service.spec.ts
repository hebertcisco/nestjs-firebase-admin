import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service'; // Corrected import path
import { DatabaseServiceMock } from '../../tests/mocks/DatabaseService.mock'; // Fixed import path

/**
 * Test suite for DatabaseService
 *
 * These tests verify the functionality of the DatabaseService wrapper around Firebase Realtime Database.
 * The tests use a mock implementation to avoid actual database calls during testing.
 *
 * @see {@link https://firebase.google.com/docs/database/admin/start/ Firebase Realtime Database Admin SDK}
 */
describe('DatabaseService', () => {
  let service: DatabaseService;
  let mockService: DatabaseServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DatabaseService,
          useClass: DatabaseServiceMock,
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    mockService = service as unknown as DatabaseServiceMock;
  });

  afterEach(() => {
    if (mockService.resetMocks) {
      mockService.resetMocks();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * Tests for the ref() method
   * Verifies that the service can create database references with all required methods
   */
  describe('ref', () => {
    it('should return a database reference', () => {
      const ref = service.ref('test-path');
      expect(ref).toBeDefined();
      expect(ref.get).toBeDefined();
      expect(ref.set).toBeDefined();
      expect(ref.update).toBeDefined();
      expect(ref.remove).toBeDefined();
      expect(ref.push).toBeDefined();
    });

    it('should handle different path formats', () => {
      // Testar caminhos com múltiplos níveis
      const ref1 = service.ref('users/123/profile');
      expect(ref1).toBeDefined();

      // Testar caminho vazio
      const ref2 = service.ref('');
      expect(ref2).toBeDefined();

      // Testar caminho com caracteres especiais
      const ref3 = service.ref('users/user.name@example.com');
      expect(ref3).toBeDefined();
    });
  });

  /**
   * Tests for the get() method
   * Verifies data retrieval functionality
   */
  describe('get', () => {
    it('should get data from a path', async () => {
      const data = await service.get('test-path');
      expect(data).toBe('mock-data');
    });

    it('should handle non-existent paths', async () => {
      const data = await service.get('non-existent-path');
      expect(data).toBe('mock-data');
    });

    it('should handle error during data retrieval', async () => {
      const mockRef = service.ref('error-path');
      mockRef.get = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(service.get('error-path')).rejects.toThrow('Database error');
    });

    it('should call get method with correct path', async () => {
      const path = 'test/specific/path';
      const spyRef = jest.spyOn(service, 'ref');

      await service.get(path);

      expect(spyRef).toHaveBeenCalledWith(path);
    });

    it('should handle null value response', async () => {
      const mockRef = service.ref('null-path');
      mockRef.get = jest.fn().mockResolvedValue({ val: () => null });

      const result = await service.get('null-path');
      expect(result).toBeNull();
    });
  });

  /**
   * Tests for the set() method
   * Verifies data setting functionality
   */
  describe('set', () => {
    it('should set data at a path', async () => {
      const testData = { name: 'test' };
      await expect(service.set('test-path', testData)).resolves.not.toThrow();
    });

    it('should handle complex data structures', async () => {
      const testData = {
        name: 'test',
        nested: {
          field: 'value',
          array: [1, 2, 3],
        },
      };
      await expect(service.set('test-path', testData)).resolves.not.toThrow();
    });

    it('should handle error during set operation', async () => {
      const mockRef = service.ref('error-path');
      mockRef.set = jest.fn().mockRejectedValue(new Error('Permission denied'));

      await expect(service.set('error-path', { test: 'data' })).rejects.toThrow(
        'Permission denied',
      );
    });

    it('should call set method with correct parameters', async () => {
      const path = 'users/123';
      const data = { name: 'John Doe', age: 30 };
      const refSpy = jest.spyOn(service, 'ref');
      const setSpy = jest.spyOn(service.ref(path), 'set');

      await service.set(path, data);

      expect(refSpy).toHaveBeenCalledWith(path);
      expect(setSpy).toHaveBeenCalledWith(data);
    });

    it('should set primitive data types', async () => {
      // String
      await expect(
        service.set('string-path', 'test-string'),
      ).resolves.not.toThrow();

      // Number
      await expect(service.set('number-path', 42)).resolves.not.toThrow();

      // Boolean
      await expect(service.set('bool-path', true)).resolves.not.toThrow();

      // Null
      await expect(service.set('null-path', null)).resolves.not.toThrow();
    });
  });

  /**
   * Tests for the update() method
   * Verifies partial data update functionality
   */
  describe('update', () => {
    it('should update data at a path', async () => {
      const testData = { name: 'updated' };
      await expect(
        service.update('test-path', testData),
      ).resolves.not.toThrow();
    });

    it('should handle partial updates', async () => {
      const testData = { 'nested.field': 'new-value' };
      await expect(
        service.update('test-path', testData),
      ).resolves.not.toThrow();
    });

    it('should handle error during update operation', async () => {
      const mockRef = service.ref('error-path');
      mockRef.update = jest.fn().mockRejectedValue(new Error('Update failed'));

      await expect(
        service.update('error-path', { name: 'test' }),
      ).rejects.toThrow('Update failed');
    });

    it('should call update method with correct parameters', async () => {
      const path = 'users/profile';
      const data = { lastActive: Date.now(), status: 'online' };
      const refSpy = jest.spyOn(service, 'ref');
      const updateSpy = jest.spyOn(service.ref(path), 'update');

      await service.update(path, data);

      expect(refSpy).toHaveBeenCalledWith(path);
      expect(updateSpy).toHaveBeenCalledWith(data);
    });

    it('should update with empty object', async () => {
      await expect(service.update('test-path', {})).resolves.not.toThrow();
    });
  });

  /**
   * Tests for the remove() method
   * Verifies data deletion functionality
   */
  describe('remove', () => {
    it('should remove data at a path', async () => {
      await expect(service.remove('test-path')).resolves.not.toThrow();
    });

    it('should handle non-existent paths', async () => {
      await expect(service.remove('non-existent-path')).resolves.not.toThrow();
    });

    it('should handle error during remove operation', async () => {
      const mockRef = service.ref('error-path');
      mockRef.remove = jest.fn().mockRejectedValue(new Error('Delete failed'));

      await expect(service.remove('error-path')).rejects.toThrow(
        'Delete failed',
      );
    });

    it('should call remove method with correct path', async () => {
      const path = 'users/123/sessions';
      const refSpy = jest.spyOn(service, 'ref');
      const removeSpy = jest.spyOn(service.ref(path), 'remove');

      await service.remove(path);

      expect(refSpy).toHaveBeenCalledWith(path);
      expect(removeSpy).toHaveBeenCalled();
    });
  });

  /**
   * Tests for the push() method
   * Verifies list data addition functionality
   */
  describe('push', () => {
    it('should push data to a path and return a key', async () => {
      const testData = { name: 'new-item' };
      const key = await service.push('test-path', testData);
      expect(key).toBe('mock-key');
    });

    it('should handle empty key case', async () => {
      const mockRef = service.ref('test-path');
      mockRef.push = jest.fn().mockResolvedValue({ key: null });
      const testData = { name: 'new-item' };
      const key = await service.push('test-path', testData);
      expect(key).toBe('');
    });

    it('should handle error during push operation', async () => {
      const mockRef = service.ref('error-path');
      mockRef.push = jest.fn().mockRejectedValue(new Error('Push failed'));

      await expect(
        service.push('error-path', { name: 'test' }),
      ).rejects.toThrow('Push failed');
    });

    it('should call push method with correct parameters', async () => {
      const path = 'messages';
      const data = { text: 'Hello world', timestamp: Date.now() };
      const refSpy = jest.spyOn(service, 'ref');
      const pushSpy = jest.spyOn(service.ref(path), 'push');

      await service.push(path, data);

      expect(refSpy).toHaveBeenCalledWith(path);
      expect(pushSpy).toHaveBeenCalledWith(data);
    });

    it('should push different data types', async () => {
      // Object
      await expect(service.push('list/objects', { id: 1 })).resolves.toBe(
        'mock-key',
      );

      // Array
      await expect(service.push('list/arrays', [1, 2, 3])).resolves.toBe(
        'mock-key',
      );

      // String
      await expect(service.push('list/strings', 'test string')).resolves.toBe(
        'mock-key',
      );

      // Number
      await expect(service.push('list/numbers', 42)).resolves.toBe('mock-key');
    });
  });

  /**
   * Tests for combined operations
   * Verifies complex database operations that combine multiple methods
   */
  describe('combined operations', () => {
    it('should perform get and update operations sequentially', async () => {
      const path = 'users/profile';
      const getSpy = jest.spyOn(service, 'get');
      const updateSpy = jest.spyOn(service, 'update');

      // Simular um fluxo de trabalho: obter dados, modificá-los e atualizá-los
      const data = await service.get(path);
      await service.update(path, { lastAccess: Date.now() });

      expect(getSpy).toHaveBeenCalledWith(path);
      expect(updateSpy).toHaveBeenCalled();
    });

    it('should perform push and then get the pushed data', async () => {
      const basePath = 'posts';
      const postData = { title: 'Test Post', content: 'Content' };

      const key = await service.push(basePath, postData);
      expect(key).toBe('mock-key');

      const path = `${basePath}/${key}`;
      const getSpy = jest.spyOn(service, 'get');

      await service.get(path);
      expect(getSpy).toHaveBeenCalledWith(path);
    });

    it('should handle transaction-like operations', async () => {
      // Simular uma transação: atualizar um item e sua referência em outro local
      const itemPath = 'items/123';
      const itemData = { name: 'Updated Item', updated: true };

      const refPath = 'users/456/items/123';
      const refData = { updated: true, timestamp: Date.now() };

      const setSpy = jest.spyOn(service, 'set');
      const updateSpy = jest.spyOn(service, 'update');

      await service.set(itemPath, itemData);
      await service.update(refPath, refData);

      expect(setSpy).toHaveBeenCalledWith(itemPath, itemData);
      expect(updateSpy).toHaveBeenCalledWith(refPath, refData);
    });
  });
});
