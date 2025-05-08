import {
  AdminModuleOptionsFactory,
  AdminModuleAsyncOptions,
} from './admin-module.interface';

describe('AdminModuleOptionsFactory', () => {
  it('should define a method to create admin options', () => {
    class TestFactory implements AdminModuleOptionsFactory {
      createAdminOptions() {
        return { credential: { projectId: 'test' } };
      }
    }

    const factory = new TestFactory();
    expect(factory.createAdminOptions()).toEqual({
      credential: { projectId: 'test' },
    });
  });
});

describe('AdminModuleAsyncOptions', () => {
  it('should allow useExisting, useClass, or useFactory for async options', () => {
    const asyncOptions: AdminModuleAsyncOptions = {
      useFactory: async () => ({ credential: { projectId: 'test' } }),
      inject: [],
    };

    expect(asyncOptions.useFactory).toBeDefined();
    expect(asyncOptions.inject).toEqual([]);
  });

  it('should support extraProviders', () => {
    const extraProvider = { provide: 'TEST', useValue: 'value' };
    const asyncOptions: AdminModuleAsyncOptions = {
      useFactory: async () => ({ credential: { projectId: 'test' } }),
      inject: [],
      extraProviders: [extraProvider],
    };

    expect(asyncOptions.extraProviders).toContain(extraProvider);
  });
});
