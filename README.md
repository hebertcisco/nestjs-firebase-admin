[![codecov](https://codecov.io/gh/hebertcisco/nestjs-firebase-admin/branch/main/graph/badge.svg?token=N0IW1UNNIP)](https://codecov.io/gh/hebertcisco/nestjs-firebase-admin)

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/hebertcisco/nestjs-firebase-admin/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/hebertcisco/nestjs-firebase-admin/tree/main)

[![Node.js build and publish package](https://github.com/hebertcisco/nestjs-firebase-admin/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/hebertcisco/nestjs-firebase-admin/actions/workflows/npm-publish.yml)

[![Running Code Coverage](https://github.com/hebertcisco/nestjs-firebase-admin/actions/workflows/coverage.yml/badge.svg)](https://github.com/hebertcisco/nestjs-firebase-admin/actions/workflows/coverage.yml)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Nestjs](https://img.shields.io/badge/Nestjs-ea2845?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Free. Built on open source. Runs everywhere.](https://img.shields.io/badge/VS_Code-0078D4?style=flat&logo=visual%20studio%20code&logoColor=white)](https://code.visualstudio.com/)
[![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=flat&logo=githubactions&logoColor=white)](https://github.com/hebertcisco/nestjs-firebase-admin/actions)

> Firebase Admin SDK for NestJS :fire:

## Requirements

- **Node.js**: >= 20
- **NPM**: >= 10
- **NestJS**: >= 7.0.0

## Installation

Install the package using `yarn`, `npm`, or `pnpm`:

```bash
# yarn
yarn add nestjs-firebase-admin
```

```bash
# npm
npm i nestjs-firebase-admin --save
```

```bash
# pnpm
pnpm add nestjs-firebase-admin --save
```

## Usage Example

Here is an example of how to configure the `AdminModule` in NestJS:

```ts
// common.module.ts
import { Module } from '@nestjs/common';
import { AdminModule } from 'nestjs-firebase-admin';

@Module({
  imports: [
    AdminModule.register({
      credential: {
        projectId: 'my-project-id',
        clientEmail: 'my-client-email',
        privateKey: 'my-private-key',
      },
      databaseURL: 'https://my-project-id.firebaseio.com',
    }),
  ],
})
export class CommonModule {}
```

### Asynchronous Registration

If you need asynchronous configuration, use the `registerAsync` method:

```ts
import { Module } from '@nestjs/common';
import { AdminModule } from 'nestjs-firebase-admin';

@Module({
  imports: [
    AdminModule.registerAsync({
      useFactory: async () => ({
        credential: {
          projectId: 'my-project-id',
          clientEmail: 'my-client-email',
          privateKey: 'my-private-key',
        },
        databaseURL: 'https://my-project-id.firebaseio.com',
      }),
    }),
  ],
})
export class AppModule {}
```

## DatabaseService

The `DatabaseService` provides a clean and type-safe interface for interacting with the Firebase Realtime Database. This service is automatically injected when you import the `AdminModule`.

### Features

- Full CRUD operations (Create, Read, Update, Delete)
- TypeScript type support
- Asynchronous methods with Promises
- Database reference handling
- List operations with unique keys

### Usage Example

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

### Available Methods

| Method | Description | Documentation |
|--------|-------------|---------------|
| `ref(path)` | Gets a reference to a specific path | [Firebase Ref](https://firebase.google.com/docs/database/admin/retrieve-data#section-queries) |
| `get<T>(path)` | Retrieves data from a specific path | [Read Data](https://firebase.google.com/docs/database/admin/retrieve-data#section-read-once) |
| `set<T>(path, data)` | Sets data at a specific path | [Set Data](https://firebase.google.com/docs/database/admin/save-data#section-set) |
| `update<T>(path, data)` | Updates specific fields at a path | [Update Data](https://firebase.google.com/docs/database/admin/save-data#section-update) |
| `remove(path)` | Removes data from a specific path | [Delete Data](https://firebase.google.com/docs/database/admin/save-data#section-delete) |
| `push<T>(path, data)` | Adds data to a list | [Push Data](https://firebase.google.com/docs/database/admin/save-data#section-push) |

## Testing

To run tests, use the following commands:

### Unit Tests

```bash
npm test
```

### Coverage Tests

```bash
npm run test:cov
```

### Watch Mode Tests

```bash
npm run test:watch
```

### Debug Tests

```bash
npm run test:debug
```

## Available Scripts

The available scripts in `package.json` include:

- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Format**: `npm run format`
- **Release**: `npm run release`

## Contributing

Contributions, issues, and feature requests are welcome!<br />Feel free to check the [issues page](https://github.com/hebertcisco/nestjs-firebase-admin/issues).

## Show Your Support

Give a ⭐️ if this project helped you!

Or buy the author a coffee 🙌🏾

<a href="https://www.buymeacoffee.com/hebertcisco">
    <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=hebertcisco&button_colour=FFDD00&font_colour=000000&font_family=Inter&outline_colour=000000&coffee_colour=ffffff" />
</a>

## 📝 License

This project is under the [MIT](LICENSE) license.
