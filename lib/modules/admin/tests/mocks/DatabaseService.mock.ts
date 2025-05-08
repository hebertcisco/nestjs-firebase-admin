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
     * Mock reference object that simulates Firebase Database reference methods
     */
    private mockRef = {
        get: jest.fn().mockResolvedValue({ val: () => 'mock-data' }),
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
        await this.ref(path).set(data);
    }

    /**
     * Simulate updating data in the database
     * @param path The path to update data at
     * @param data The data to update
     */
    async update<T>(path: string, data: Partial<T>): Promise<void> {
        await this.ref(path).update(data);
    }

    /**
     * Simulate removing data from the database
     * @param path The path to remove data from
     */
    async remove(path: string): Promise<void> {
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
        return ref.key || '';
    }

    /**
     * Reset all mock functions to their initial state.
     * Useful for cleaning up between tests.
     */
    resetMocks() {
        Object.values(this.mockRef).forEach(mock => {
            if (typeof mock === 'function' && 'mockReset' in mock) {
                mock.mockReset();
            }
        });
    }
} 