# Storage Service

`StorageService` exposes Firebase Cloud Storage through NestJS dependency injection.

```typescript
const file = await storage.upload('/tmp/avatar.png', 'users/avatar.png');
const url = await storage.getDownloadURL(file);
```

Use `bucket(name)` for a named bucket and `file(path, bucketName)` for a file reference. The default bucket comes from the module's `storageBucket` option.
