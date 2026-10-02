# Remote Config Service

`RemoteConfigService` provides typed access to the server-side Remote Config template API.

```typescript
const template = await remoteConfig.getTemplate();
template.parameters.welcome_message = { defaultValue: { value: 'Hello' } };
await remoteConfig.publishTemplate(template);
```

Publishing uses Firebase's ETag protection by default. Pass `true` to `publishTemplate(template, true)` only when a forced update is intentional.
