# Getting Started

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

## Basic Usage

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

## Next Steps

- Learn about the [Admin Service](services/admin-service.md)
- Explore the [Database Service](services/database-service.md)
- Check out the [Firestore Service](services/firestore-service.md)
- Discover the [Messaging Service](services/messaging-service.md)
