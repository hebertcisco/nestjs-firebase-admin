import { Database } from 'firebase-admin/database';

/**
 * Mock implementation of DatabaseService for testing purposes.
 * 
 * This mock simulates the behavior of the Firebase Realtime Database
 * without making actual database calls. It provides predictable responses
 * for testing database operations.
 * 
 * @see {@link https://firebase.google.com/docs/database/admin/start/ Firebase Realtime Database Admin SDK}
 */
export class DatabaseServiceMock {
    /**
     * Storage for mock data to simulate persistence between operations
     */
    private mockStorage: Record<string, any> = {};

    /**
     * Mock reference object that simulates Firebase Database reference methods
     */
    private mockRef = {
        get: jest.fn().mockImplementation(() => {
            return Promise.resolve({
                val: () => 'mock-data'
            });
        }),
        set: jest.fn().mockResolvedValue(undefined),
        update: jest.fn().mockResolvedValue(undefined),
        remove: jest.fn().mockResolvedValue(undefined),
        push: jest.fn().mockResolvedValue({ key: 'mock-key' }),
    };

    /**
     * Get a mock reference to a database path
     * @param path The path to get a reference to
     * @returns Mock database reference
     */
    ref(path: string) {
        return this.mockRef;
    }

    /**
     * Simulate getting data from the database
     * @param path The path to get data from
     * @returns Promise resolving to mock data
     */
    async get<T>(path: string): Promise<T> {
        const snapshot = await this.ref(path).get();
        return snapshot.val();
    }

    /**
     * Simulate setting data in the database
     * @param path The path to set data at
     * @param data The data to set
     */
    async set<T>(path: string, data: T): Promise<void> {
        this.mockStorage[path] = data;
        await this.ref(path).set(data);
    }

    /**
     * Simulate updating data in the database
     * @param path The path to update data at
     * @param data The data to update
     */
    async update<T>(path: string, data: Partial<T>): Promise<void> {
        if (!this.mockStorage[path]) {
            this.mockStorage[path] = {};
        }
        
        this.mockStorage[path] = {
            ...this.mockStorage[path],
            ...data
        };
        
        await this.ref(path).update(data);
    }

    /**
     * Simulate removing data from the database
     * @param path The path to remove data from
     */
    async remove(path: string): Promise<void> {
        delete this.mockStorage[path];
        await this.ref(path).remove();
    }

    /**
     * Simulate pushing data to a list in the database
     * @param path The path to push data to
     * @param data The data to push
     * @returns Promise resolving to a mock key
     */
    async push<T>(path: string, data: T): Promise<string> {
        const ref = await this.ref(path).push(data);
        const key = ref.key || '';
        
        if (key) {
            if (!this.mockStorage[path]) {
                this.mockStorage[path] = {};
            }
            
            this.mockStorage[`${path}/${key}`] = data;
        }
        
        return key;
    }

    /**
     * Reset all mock functions to their initial state.
     * Useful for cleaning up between tests.
     */
    resetMocks() {
        this.mockStorage = {};
        
        // Resetar as funções mock para seus estados iniciais
        this.mockRef.get = jest.fn().mockImplementation(() => {
            return Promise.resolve({
                val: () => 'mock-data'
            });
        });
        this.mockRef.set = jest.fn().mockResolvedValue(undefined);
        this.mockRef.update = jest.fn().mockResolvedValue(undefined);
        this.mockRef.remove = jest.fn().mockResolvedValue(undefined);
        this.mockRef.push = jest.fn().mockResolvedValue({ key: 'mock-key' });
    }

    /**
     * Configure a custom behavior for one of the mock methods
     * Useful for testing error conditions or special cases
     * 
     * @param method The method name to configure ('get', 'set', etc.)
     * @param implementation The custom implementation function
     */
    configureMock(method: keyof typeof this.mockRef, implementation: any) {
        if (this.mockRef[method] && typeof this.mockRef[method] === 'function') {
            this.mockRef[method] = implementation;
        }
    }

    /**
     * Get the stored mock data for a specific path
     * Useful for verifying data was stored correctly
     * 
     * @param path The path to get data from
     * @returns The stored data or undefined if not found
     */
    getMockData(path: string): any {
        return this.mockStorage[path];
    }
} 