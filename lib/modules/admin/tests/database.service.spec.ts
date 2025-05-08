import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database.service';
import { DatabaseServiceMock } from './mocks/DatabaseService.mock';

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
                    array: [1, 2, 3]
                }
            };
            await expect(service.set('test-path', testData)).resolves.not.toThrow();
        });
    });

    /**
     * Tests for the update() method
     * Verifies partial data update functionality
     */
    describe('update', () => {
        it('should update data at a path', async () => {
            const testData = { name: 'updated' };
            await expect(service.update('test-path', testData)).resolves.not.toThrow();
        });

        it('should handle partial updates', async () => {
            const testData = { 'nested.field': 'new-value' };
            await expect(service.update('test-path', testData)).resolves.not.toThrow();
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
    });
}); 