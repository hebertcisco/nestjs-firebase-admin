<p align="center">
  <img src="art/logo.png" alt="nestjs-firebase-admin logo" width="200">
</p>

<h1 align="center">nestjs-firebase-admin</h1>

<p align="center">
  Firebase Admin SDK module for <a href="https://nestjs.com/">NestJS</a> — injectable services for Auth, Firestore, Realtime Database, and Cloud Messaging.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/nestjs-firebase-admin"><img src="https://img.shields.io/npm/v/nestjs-firebase-admin.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/nestjs-firebase-admin"><img src="https://img.shields.io/npm/dm/nestjs-firebase-admin.svg" alt="npm downloads"></a>
  <a href="https://codecov.io/gh/hebertcisco/nestjs-firebase-admin">
    <img src="https://codecov.io/gh/hebertcisco/nestjs-firebase-admin/branch/main/graph/badge.svg?token=N0IW1UNNIP" alt="codecov">
  </a>
  <a href="https://github.com/hebertcisco/nestjs-firebase-admin/actions/workflows/npm-publish.yml">
    <img src="https://github.com/hebertcisco/nestjs-firebase-admin/actions/workflows/npm-publish.yml/badge.svg" alt="Node.js build and publish package">
  </a>
  <a href="https://github.com/hebertcisco/nestjs-firebase-admin/actions/workflows/coverage.yml">
    <img src="https://github.com/hebertcisco/nestjs-firebase-admin/actions/workflows/coverage.yml/badge.svg" alt="Running Code Coverage">
  </a>
</p>

## Features

- **AdminService** — Firebase app initialization and lifecycle management
- **AuthService** — Create, update, delete users; verify ID tokens; manage custom claims
- **FirestoreService** — Typed CRUD, collection queries, batch writes, transactions
- **DatabaseService** — Realtime Database read, write, push, update, remove, and listeners
- **MessagingService** — Send to device tokens, topics, and conditions; manage subscriptions
- Sync (`register`) and async (`registerAsync`) module registration
- Compatible with **NestJS 7 – 11** and **Firebase Admin 13+**
- TypeScript-first with full type support

## Installation

```bash
npm i nestjs-firebase-admin --save
```

<details>
<summary>yarn / pnpm</summary>

```bash
yarn add nestjs-firebase-admin
```

```bash
pnpm add nestjs-firebase-admin
```

</details>

## Quick start

Import `AdminModule` in your root or feature module:

```ts
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
export class AppModule {}
```

### Async configuration

Use `registerAsync` to load credentials from `ConfigService` or any other provider:

```ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminModule } from 'nestjs-firebase-admin';

@Module({
  imports: [
    AdminModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        credential: {
          projectId: config.get('FIREBASE_PROJECT_ID'),
          clientEmail: config.get('FIREBASE_CLIENT_EMAIL'),
          privateKey: config.get('FIREBASE_PRIVATE_KEY'),
        },
        databaseURL: config.get('FIREBASE_DATABASE_URL'),
      }),
    }),
  ],
})
export class AppModule {}
```

## Usage examples

Once `AdminModule` is imported, inject any service:

```ts
import { Injectable } from '@nestjs/common';
import { AuthService, FirestoreService } from 'nestjs-firebase-admin';

@Injectable()
export class UsersService {
  constructor(
    private readonly auth: AuthService,
    private readonly firestore: FirestoreService,
  ) {}

  async createUser(email: string, password: string) {
    const user = await this.auth.createUser({ email, password });
    await this.firestore.set(`users/${user.uid}`, { email, createdAt: new Date() });
    return user;
  }

  async getUser(uid: string) {
    return this.firestore.get(`users/${uid}`);
  }
}
```

## Requirements

| Dependency | Version |
|-----------|---------|
| Node.js | >= 20 |
| NestJS | >= 7.0.0 |
| firebase-admin | >= 13.0.0 |

## Documentation

Full documentation is available at **[hebertcisco.github.io/nestjs-firebase-admin](https://hebertcisco.github.io/nestjs-firebase-admin/)**.

- [Getting Started](https://hebertcisco.github.io/nestjs-firebase-admin/#/docs/getting-started)
- [Admin Service](https://hebertcisco.github.io/nestjs-firebase-admin/#/docs/services/admin-service)
- [Auth Service](https://hebertcisco.github.io/nestjs-firebase-admin/#/docs/services/auth-service)
- [Firestore Service](https://hebertcisco.github.io/nestjs-firebase-admin/#/docs/services/firestore-service)
- [Database Service](https://hebertcisco.github.io/nestjs-firebase-admin/#/docs/services/database-service)
- [Messaging Service](https://hebertcisco.github.io/nestjs-firebase-admin/#/docs/services/messaging-service)
- [Testing](https://hebertcisco.github.io/nestjs-firebase-admin/#/docs/testing)

## Contributing

Contributions, issues, and feature requests are welcome! Check the [issues page](https://github.com/hebertcisco/nestjs-firebase-admin/issues) or read the [contributing guide](https://hebertcisco.github.io/nestjs-firebase-admin/#/docs/contributing).

## License

[MIT](LICENSE)
