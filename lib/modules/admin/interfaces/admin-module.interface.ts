import { ModuleMetadata, Provider, Type } from '@nestjs/common';
import { AdminModuleOptions } from '../types';

export interface AdminModuleOptionsFactory {
  createAdminOptions(): Promise<AdminModuleOptions> | AdminModuleOptions;
}

export interface AdminModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<AdminModuleOptionsFactory>;
  useClass?: Type<AdminModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<AdminModuleOptions> | AdminModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
