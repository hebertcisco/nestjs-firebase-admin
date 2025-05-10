# Database Service

The `DatabaseService` provides a clean and type-safe interface for interacting with the Firebase Realtime Database. This service is automatically injected when you import the `AdminModule`.

## Features

- Full CRUD operations (Create, Read, Update, Delete)
- TypeScript type support
- Asynchronous methods with Promises
- Database reference handling
- List operations with unique keys

## Usage Example

```ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'nestjs-firebase-admin';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Get data from a path
  async getUser(userId: string) {
    return this.databaseService.get<User>(`users/${userId}`);
  }

  // Set data at a path
  async createUser(userId: string, userData: User) {
    await this.databaseService.set(`users/${userId}`, userData);
  }

  // Update specific fields
  async updateUser(userId: string, updates: Partial<User>) {
    await this.databaseService.update(`users/${userId}`, updates);
  }

  // Remove data
  async deleteUser(userId: string) {
    await this.databaseService.remove(`users/${userId}`);
  }

  // Add to a list
  async addUser(userData: User) {
    const newKey = await this.databaseService.push('users', userData);
    return newKey;
  }

  // Get a database reference
  async getUsersRef() {
    return this.databaseService.ref('users');
  }
}
```

## Available Methods

| Method | Description | Documentation |
|--------|-------------|---------------|
| `ref(path)` | Gets a reference to a specific path | [Firebase Ref](https://firebase.google.com/docs/database/admin/retrieve-data#section-queries) |
| `get<T>(path)` | Retrieves data from a specific path | [Read Data](https://firebase.google.com/docs/database/admin/retrieve-data#section-read-once) |
| `set<T>(path, data)` | Sets data at a specific path | [Set Data](https://firebase.google.com/docs/database/admin/save-data#section-set) |
| `update<T>(path, data)` | Updates specific fields at a path | [Update Data](https://firebase.google.com/docs/database/admin/save-data#section-update) |
| `remove(path)` | Removes data from a specific path | [Delete Data](https://firebase.google.com/docs/database/admin/save-data#section-delete) |
| `push<T>(path, data)` | Adds data to a list | [Push Data](https://firebase.google.com/docs/database/admin/save-data#section-push) |
