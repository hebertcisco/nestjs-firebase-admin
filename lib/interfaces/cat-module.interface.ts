import { ModuleMetadata, Provider, Type } from '@nestjs/common';
import { CatModuleOptions } from '../types/cat.type';

export interface CatModuleOptionsFactory {
  createCatOptions(): Promise<CatModuleOptions> | CatModuleOptions;
}

export interface CatModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<CatModuleOptionsFactory>;
  useClass?: Type<CatModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<CatModuleOptions> | CatModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
