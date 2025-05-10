# Firestore Service

The `FirestoreService` provides a clean and type-safe interface for interacting with Cloud Firestore. This service is automatically injected when you import the `AdminModule`.

## Features

- Full CRUD operations (Create, Read, Update, Delete)
- TypeScript type support
- Collection and document management
- Query support
- Batch operations
- Transaction support

## Usage Example

```ts
import { Injectable } from '@nestjs/common';
import { FirestoreService } from 'nestjs-firebase-admin';

@Injectable()
export class UsersService {
  constructor(private readonly firestoreService: FirestoreService) {}

  // Get a document
  async getUser(userId: string) {
    return this.firestoreService.get<User>(`users/${userId}`);
  }

  // Create or update a document
  async createUser(userId: string, userData: User) {
    await this.firestoreService.set(`users/${userId}`, userData);
  }

  // Update specific fields
  async updateUser(userId: string, updates: Partial<User>) {
    await this.firestoreService.update(`users/${userId}`, updates);
  }

  // Delete a document
  async deleteUser(userId: string) {
    await this.firestoreService.delete(`users/${userId}`);
  }

  // Add a document with auto-generated ID
  async addUser(userData: User) {
    return this.firestoreService.add('users', userData);
  }

  // Query documents
  async getActiveUsers() {
    return this.firestoreService.query<User>('users', 
      (q) => q.where('status', '==', 'active')
    );
  }
}
```

## Available Methods

| Method | Description | Documentation |
|--------|-------------|---------------|
| `collection<T>(path)` | Gets a reference to a collection | [Firestore Collections](https://firebase.google.com/docs/firestore/manage-data/structure-data) |
| `doc<T>(path)` | Gets a reference to a document | [Firestore Documents](https://firebase.google.com/docs/firestore/manage-data/structure-data) |
| `get<T>(path)` | Retrieves a document's data | [Read Data](https://firebase.google.com/docs/firestore/query-data/get-data) |
| `set<T>(path, data, options?)` | Sets a document's data | [Set Data](https://firebase.google.com/docs/firestore/manage-data/add-data) |
| `update<T>(path, data)` | Updates specific fields | [Update Data](https://firebase.google.com/docs/firestore/manage-data/add-data#update-data) |
| `delete(path)` | Deletes a document | [Delete Data](https://firebase.google.com/docs/firestore/manage-data/delete-data) |
| `add<T>(path, data)` | Adds a document with auto-generated ID | [Add Data](https://firebase.google.com/docs/firestore/manage-data/add-data) |
| `query<T>(path, ...constraints)` | Queries a collection | [Query Data](https://firebase.google.com/docs/firestore/query-data/queries) |
