import { Injectable } from '@nestjs/common';
import { getDatabase } from 'firebase-admin/database';
import { Database } from 'firebase-admin/database';

/**
 * Service for interacting with Firebase Realtime Database.
 * 
 * This service provides a wrapper around the Firebase Admin SDK's Realtime Database functionality,
 * offering a clean and type-safe interface for database operations.
 * 
 * @see {@link https://firebase.google.com/docs/database/admin/start/ Firebase Realtime Database Admin SDK}
 * @see {@link https://firebase.google.com/docs/database/admin/retrieve-data Retrieve Data}
 * @see {@link https://firebase.google.com/docs/database/admin/save-data Save Data}
 * 
 * @example
 * ```typescript
 * // Get data from a path
 * const data = await databaseService.get<User>('users/123');
 * 
 * // Set data at a path
 * await databaseService.set('users/123', { name: 'John', age: 30 });
 * 
 * // Update specific fields
 * await databaseService.update('users/123', { age: 31 });
 * 
 * // Remove data
 * await databaseService.remove('users/123');
 * 
 * // Add to a list
 * const newKey = await databaseService.push('users', { name: 'Jane' });
 * ```
 */
@Injectable()
export class DatabaseService {
    private database: Database;

    constructor() {
        this.database = getDatabase();
    }

    /**
     * Get a reference to a specific path in the database.
     * This is useful for advanced operations or when you need direct access to the Firebase reference.
     * 
     * @see {@link https://firebase.google.com/docs/database/admin/retrieve-data#section-queries Queries}
     * @param path The path to get a reference to
     * @returns Database reference
     */
    ref(path: string) {
        return this.database.ref(path);
    }

    /**
     * Get data from a specific path in the database.
     * 
     * @see {@link https://firebase.google.com/docs/database/admin/retrieve-data#section-read-once Read Data Once}
     * @param path The path to get data from
     * @returns Promise with the data
     */
    async get<T>(path: string): Promise<T> {
        const snapshot = await this.database.ref(path).get();
        return snapshot.val();
    }

    /**
     * Set data at a specific path in the database.
     * This will overwrite any existing data at the specified path.
     * 
     * @see {@link https://firebase.google.com/docs/database/admin/save-data#section-set Set Data}
     * @param path The path to set data at
     * @param data The data to set
     * @returns Promise that resolves when the operation is complete
     */
    async set<T>(path: string, data: T): Promise<void> {
        await this.database.ref(path).set(data);
    }

    /**
     * Update specific fields at a path in the database.
     * This will only update the specified fields, leaving other fields unchanged.
     * 
     * @see {@link https://firebase.google.com/docs/database/admin/save-data#section-update Update Data}
     * @param path The path to update data at
     * @param data The data to update
     * @returns Promise that resolves when the operation is complete
     */
    async update<T>(path: string, data: Partial<T>): Promise<void> {
        await this.database.ref(path).update(data);
    }

    /**
     * Remove data at a specific path in the database.
     * 
     * @see {@link https://firebase.google.com/docs/database/admin/save-data#section-delete Delete Data}
     * @param path The path to remove data from
     * @returns Promise that resolves when the operation is complete
     */
    async remove(path: string): Promise<void> {
        await this.database.ref(path).remove();
    }

    /**
     * Push new data to a list in the database.
     * This will create a new child location with a unique key.
     * 
     * @see {@link https://firebase.google.com/docs/database/admin/save-data#section-push Push Data}
     * @param path The path to push data to
     * @param data The data to push
     * @returns Promise with the new reference key or empty string if key is null
     */
    async push<T>(path: string, data: T): Promise<string> {
        const ref = await this.database.ref(path).push(data);
        return ref.key || '';
    }
} 