# App Check Service

`AppCheckService` wraps Firebase Admin App Check token creation and verification.

```typescript
const decoded = await appCheck.verifyToken(request.headers['x-firebase-appcheck']);
const token = await appCheck.createToken('1:123:web:abc');
```

Verification failures are rejected, so handle them at the application boundary, such as a guard or interceptor.
