import { AdminConfig, AdminModuleOptions } from './admin.type';

describe('Admin Types', () => {
  it('should define AdminConfig with required and optional properties', () => {
    const config: AdminConfig = {
      credential: {
        projectId: 'test-project',
        clientEmail: 'test@example.com',
        privateKey: 'test-key',
      },
      databaseURL: 'https://test.firebaseio.com',
      storageBucket: 'test-bucket',
      projectId: 'test-project-id',
      httpAgent: undefined,
    };

    expect(config.credential.projectId).toBe('test-project');
    expect(config.databaseURL).toBe('https://test.firebaseio.com');
    expect(config.storageBucket).toBe('test-bucket');
    expect(config.projectId).toBe('test-project-id');
    expect(config.httpAgent).toBeUndefined();
  });

  it('should define AdminModuleOptions as an alias for AdminConfig', () => {
    const options: AdminModuleOptions = {
      credential: {
        projectId: 'test-project',
        clientEmail: 'test@example.com',
        privateKey: 'test-key',
      },
    };

    expect(options.credential.projectId).toBe('test-project');
    expect(options.credential.clientEmail).toBe('test@example.com');
    expect(options.credential.privateKey).toBe('test-key');
  });
});
