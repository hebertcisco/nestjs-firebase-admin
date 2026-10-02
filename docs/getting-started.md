# Getting Started

This guide shows how to install the module, configure a Firebase Admin app, and inject one of its services into a NestJS provider.

## Requirements

- **Node.js**: `>= 20`
- **npm**: `>= 10`
- **NestJS**: `>= 7`
- **firebase-admin**: `>= 14`

## Installation

```bash
npm install nestjs-firebase-admin
```

Yarn and pnpm are also supported:

```bash
yarn add nestjs-firebase-admin
pnpm add nestjs-firebase-admin
```

## Prepare credentials

Create a Firebase service account and provide its `projectId`, `clientEmail`, and `privateKey` through a secret manager or environment variables. Do not commit a service-account JSON file or private key.

When a private key is stored in an environment variable, convert escaped newlines before passing it to the SDK:

```ts
const privateKey = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n');
```

## Register the module

Register `AdminModule` once in the module that owns your Firebase providers, commonly `AppModule`:

```ts
import { Module } from '@nestjs/common';
import { AdminModule } from 'nestjs-firebase-admin';

@Module({
  imports: [
    AdminModule.register({
      credential: {
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      },
      // Include this when using Realtime Database.
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    }),
  ],
})
export class AppModule {}
```

The module initializes the Firebase app during registration. Importing `AdminModule` exports `AdminService`, `AuthService`, `FirestoreService`, `DatabaseService`, and `MessagingService` for injection.

## Async configuration

Use `registerAsync()` with `ConfigService` or another provider:

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
          projectId: config.getOrThrow('FIREBASE_PROJECT_ID'),
          clientEmail: config.getOrThrow('FIREBASE_CLIENT_EMAIL'),
          privateKey: config
            .getOrThrow<string>('FIREBASE_PRIVATE_KEY')
            .replace(/\\n/g, '\n'),
        },
        databaseURL: config.get('FIREBASE_DATABASE_URL'),
      }),
    }),
  ],
})
export class AppModule {}
```

For class-based configuration, implement `createAdminOptions()` and pass the class with `useClass` or `useExisting`:

```ts
AdminModule.registerAsync({
  useClass: FirebaseConfigService,
});
```

## Inject a service

```ts
import { Injectable } from '@nestjs/common';
import { FirestoreService } from 'nestjs-firebase-admin';

type User = { email: string };

@Injectable()
export class UsersService {
  constructor(private readonly firestore: FirestoreService) {}

  getUser(uid: string) {
    return this.firestore.get<User>(`users/${uid}`);
  }
}
```

## Next steps

- [Admin service](services/admin-service.md)
- [Authentication](services/auth-service.md)
- [Firestore](services/firestore-service.md)
- [Realtime Database](services/database-service.md)
- [Cloud Messaging](services/messaging-service.md)
- [Testing](testing.md)
