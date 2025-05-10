# Admin Service

The `AdminService` is the core service that manages the Firebase Admin SDK initialization and configuration. This service is automatically injected when you import the `AdminModule`.

## Features

- Firebase Admin SDK initialization
- Multiple app instances support
- Credential management
- App lifecycle management
- TypeScript type support

## Usage Example

```ts
import { Injectable } from '@nestjs/common';
import { AdminService } from 'nestjs-firebase-admin';

@Injectable()
export class FirebaseService {
  constructor(private readonly adminService: AdminService) {}

  // Get the default app instance
  getApp() {
    return this.adminService.getApp;
  }

  // Get all initialized apps
  getApps() {
    return this.adminService.getApps;
  }

  // Delete an app instance
  async deleteApp(app) {
    await this.adminService.deleteApp(app);
  }

  // Get default credentials
  getDefaultCredentials() {
    return this.adminService.applicationDefault();
  }

  // Get the Firebase Admin SDK instance
  getAdmin() {
    return this.adminService.admin();
  }
}
```

## Available Methods

| Method | Description | Documentation |
|--------|-------------|---------------|
| `getApp` | Gets the default Firebase app instance | [Get App](https://firebase.google.com/docs/reference/admin/node/firebase-admin.app#getapp) |
| `getApps` | Gets all initialized Firebase apps | [Get Apps](https://firebase.google.com/docs/reference/admin/node/firebase-admin.app#getapps) |
| `deleteApp(app)` | Deletes a Firebase app instance | [Delete App](https://firebase.google.com/docs/reference/admin/node/firebase-admin.app#deleteapp) |
| `applicationDefault(httpAgent?)` | Gets default credentials | [Application Default](https://firebase.google.com/docs/reference/admin/node/firebase-admin.credential#applicationdefault) |
| `admin()` | Gets the Firebase Admin SDK instance | [Admin SDK](https://firebase.google.com/docs/admin/setup) |

## Configuration

The service can be configured through the `AdminModule` using either synchronous or asynchronous registration:

### Synchronous Registration

```ts
AdminModule.register({
  credential: {
    projectId: 'my-project-id',
    clientEmail: 'my-client-email',
    privateKey: 'my-private-key',
  },
  databaseURL: 'https://my-project-id.firebaseio.com',
})
```

### Asynchronous Registration

```ts
AdminModule.registerAsync({
  useFactory: async () => ({
    credential: {
      projectId: 'my-project-id',
      clientEmail: 'my-client-email',
      privateKey: 'my-private-key',
    },
    databaseURL: 'https://my-project-id.firebaseio.com',
  }),
})
```

## App Lifecycle

The service manages the lifecycle of Firebase app instances:

1. **Initialization**: Apps are initialized when the module is registered
2. **Access**: Apps can be accessed through `getApp` or `getApps`
3. **Cleanup**: Apps can be deleted using `deleteApp`
4. **Multiple Instances**: Multiple app instances can be managed simultaneously
