<p align="center">
  <img src="art/logo.png" alt="nestjs-firebase-admin logo" width="200">
</p>

<h1 align="center">nestjs-firebase-admin</h1>

<p align="center">
  A NestJS module that exposes the Firebase Admin SDK through injectable services for Authentication, Firestore, Realtime Database, and Cloud Messaging.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/nestjs-firebase-admin"><img src="https://img.shields.io/npm/v/nestjs-firebase-admin.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/nestjs-firebase-admin"><img src="https://img.shields.io/npm/dm/nestjs-firebase-admin.svg" alt="npm downloads"></a>
  <a href="https://github.com/hebertcisco/nestjs-firebase-admin/actions/workflows/npm-publish.yml"><img src="https://github.com/hebertcisco/nestjs-firebase-admin/actions/workflows/npm-publish.yml/badge.svg" alt="Build status"></a>
</p>

## Why this module?

`nestjs-firebase-admin` initializes one Firebase Admin app as part of Nest's dependency-injection graph and makes the most common Admin SDK services available as injectable providers.

- `AdminService` — access the initialized app and Firebase Admin SDK
- `AuthService` — manage users, custom tokens, ID tokens, and custom claims
- `FirestoreService` — typed document CRUD, collection references, and queries
- `DatabaseService` — Realtime Database reads, writes, updates, deletes, and pushes
- `MessagingService` — send single, multicast, and topic messages and manage subscriptions
- `StorageService` — access buckets, files, uploads, and download URLs
- `AppCheckService` — create and verify App Check tokens
- `RemoteConfigService` — read, publish, roll back, and list Remote Config templates
- `register()` and `registerAsync()` — synchronous or provider-based configuration

## Requirements

| Package | Supported version |
| --- | --- |
| Node.js | `>= 20` |
| npm | `>= 10` |
| NestJS | `>= 7` |
| `firebase-admin` | `>= 14` |

The module supports NestJS 7 through 11. Install `reflect-metadata` and `rxjs` in your application when they are not already provided by NestJS.

## Installation

```bash
npm install nestjs-firebase-admin
```

```bash
yarn add nestjs-firebase-admin
pnpm add nestjs-firebase-admin
```

## Configuration

Create a Firebase service account in the Firebase console or Google Cloud, and keep its private key outside source control. The module accepts the same service-account fields used by `firebase-admin`.

### Synchronous registration

```ts
import { Module } from '@nestjs/common';
import { AdminModule } from 'nestjs-firebase-admin';

@Module({
  imports: [
    AdminModule.register({
      credential: {
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        // Environment variables commonly contain escaped newlines.
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      },
      // Required when using Realtime Database.
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    }),
  ],
})
export class AppModule {}
```

Supported options include `credential`, `databaseURL`, `storageBucket`, `projectId`, `serviceAccountId`, `databaseAuthVariableOverride`, and `httpAgent`. See the [Firebase Admin app options](https://firebase.google.com/docs/reference/admin/node/firebase-admin.appoptions) reference for details.

### Asynchronous registration

Use `registerAsync()` when configuration comes from `@nestjs/config` or another Nest provider:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModule } from 'nestjs-firebase-admin';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AdminModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        credential: {
          projectId: config.getOrThrow<string>('FIREBASE_PROJECT_ID'),
          clientEmail: config.getOrThrow<string>('FIREBASE_CLIENT_EMAIL'),
          privateKey: config
            .getOrThrow<string>('FIREBASE_PRIVATE_KEY')
            .replace(/\\n/g, '\n'),
        },
        databaseURL: config.get<string>('FIREBASE_DATABASE_URL'),
      }),
    }),
  ],
})
export class AppModule {}
```

`registerAsync()` also supports `useClass`, `useExisting`, and `extraProviders`. A class or existing provider must implement `createAdminOptions()`.

## Usage

After importing `AdminModule`, inject the service you need into any provider or controller:

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
    await this.firestore.set(`users/${user.uid}`, {
      email,
      createdAt: new Date(),
    });
    return user;
  }

  async findUser(uid: string) {
    return this.firestore.get<{ email: string }>(`users/${uid}`);
  }
}
```

`FirestoreService.get()` returns `null` when a document does not exist. `DatabaseService.get()` returns the Realtime Database value, including `null` for a missing path. Firebase errors are returned as rejected promises, so handle them at the application boundary.

## Services

Read the focused guides for method signatures and examples:

- [Admin service](https://hebertcisco.github.io/nestjs-firebase-admin/#/docs/services/admin-service)
- [Authentication](https://hebertcisco.github.io/nestjs-firebase-admin/#/docs/services/auth-service)
- [Firestore](https://hebertcisco.github.io/nestjs-firebase-admin/#/docs/services/firestore-service)
- [Realtime Database](https://hebertcisco.github.io/nestjs-firebase-admin/#/docs/services/database-service)
- [Cloud Messaging](https://hebertcisco.github.io/nestjs-firebase-admin/#/docs/services/messaging-service)

## Development

```bash
npm ci
npm test
npm run test:cov
npm run build
npm run lint
```

The test suite uses Jest and mocks Firebase interactions, so it does not require a live Firebase project. See the [testing guide](https://hebertcisco.github.io/nestjs-firebase-admin/#/docs/testing) for more options.

## Documentation and support

Browse the complete [documentation site](https://hebertcisco.github.io/nestjs-firebase-admin/), or [open an issue](https://github.com/hebertcisco/nestjs-firebase-admin/issues) for bugs and feature requests.

## Contributing

Contributions are welcome. Please read the [contributing guide](https://hebertcisco.github.io/nestjs-firebase-admin/#/docs/contributing) before opening a pull request.

## License

[MIT](LICENSE)
