# Auth Service

The `AuthService` provides a clean and type-safe interface for managing Firebase Authentication. This service is automatically injected when you import the `AdminModule`.

## Features

- User management (create, read, update, delete)
- Custom token generation
- ID token verification
- Custom claims management
- User listing and pagination
- Email and phone number authentication
- TypeScript type support

## Usage Example

```ts
import { Injectable } from '@nestjs/common';
import { AuthService } from 'nestjs-firebase-admin';

@Injectable()
export class UsersService {
  constructor(private readonly authService: AuthService) {}

  // Create a new user
  async createUser(email: string, password: string) {
    return this.authService.createUser({
      email,
      password,
      emailVerified: false,
    });
  }

  // Get user by UID
  async getUser(uid: string) {
    return this.authService.getUser(uid);
  }

  // Update user profile
  async updateProfile(uid: string, displayName: string, photoURL: string) {
    return this.authService.updateUser(uid, {
      displayName,
      photoURL,
    });
  }

  // Set custom claims
  async setUserRole(uid: string, role: string) {
    return this.authService.setCustomUserClaims(uid, { role });
  }

  // Verify ID token
  async verifyToken(idToken: string) {
    return this.authService.verifyIdToken(idToken);
  }

  // List users with pagination
  async listUsers(pageSize: number = 100) {
    return this.authService.listUsers(pageSize);
  }
}
```

## Available Methods

| Method | Description | Documentation |
|--------|-------------|---------------|
| `createUser(properties)` | Creates a new user | [Create User](https://firebase.google.com/docs/auth/admin/manage-users#create_a_user) |
| `getUser(uid)` | Gets a user by UID | [Get User](https://firebase.google.com/docs/auth/admin/manage-users#retrieve_user_data) |
| `getUserByEmail(email)` | Gets a user by email | [Get User by Email](https://firebase.google.com/docs/auth/admin/manage-users#retrieve_user_data) |
| `getUserByPhoneNumber(phoneNumber)` | Gets a user by phone number | [Get User by Phone](https://firebase.google.com/docs/auth/admin/manage-users#retrieve_user_data) |
| `updateUser(uid, properties)` | Updates a user's properties | [Update User](https://firebase.google.com/docs/auth/admin/manage-users#update_a_user) |
| `deleteUser(uid)` | Deletes a user | [Delete User](https://firebase.google.com/docs/auth/admin/manage-users#delete_a_user) |
| `createCustomToken(uid, claims?)` | Creates a custom token | [Custom Tokens](https://firebase.google.com/docs/auth/admin/create-custom-tokens) |
| `verifyIdToken(idToken)` | Verifies an ID token | [Verify ID Token](https://firebase.google.com/docs/auth/admin/verify-id-tokens) |
| `setCustomUserClaims(uid, claims)` | Sets custom claims | [Custom Claims](https://firebase.google.com/docs/auth/admin/custom-claims) |
| `listUsers(maxResults?, pageToken?)` | Lists users with pagination | [List Users](https://firebase.google.com/docs/auth/admin/manage-users#list_all_users) |

## User Properties

When creating or updating a user, you can specify the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `email` | string | The user's email address |
| `emailVerified` | boolean | Whether the email is verified |
| `phoneNumber` | string | The user's phone number |
| `password` | string | The user's password |
| `displayName` | string | The user's display name |
| `photoURL` | string | The user's profile photo URL |
| `disabled` | boolean | Whether the user account is disabled |

## Custom Claims

Custom claims can be used to define user roles and permissions. They are included in the ID token and can be accessed on the client side.

Example:

```ts
// Set admin role
await authService.setCustomUserClaims(uid, { role: 'admin' });

// Set multiple roles
await authService.setCustomUserClaims(uid, { 
  roles: ['admin', 'editor'],
  premium: true 
});
```

## Token Verification

The service provides methods for token verification and custom token generation:

```ts
// Verify ID token
const decodedToken = await authService.verifyIdToken(idToken);
console.log(decodedToken.uid);

// Create custom token
const customToken = await authService.createCustomToken(uid, {
  role: 'admin'
});
```
