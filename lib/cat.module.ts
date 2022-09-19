import { DynamicModule, Module, Provider } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

import {
  CAT_MODULE_ID,
  CAT_MODULE_OPTIONS,
  PROCESS_INSTANCE_TOKEN,
} from './cat.constants';

import { CatService } from './cat.service';

import type {
  CatModuleAsyncOptions,
  CatModuleOptionsFactory,
} from './interfaces';

import type { CatModuleOptions } from './types';

@Module({
  providers: [CatService],
  exports: [CatService],
})
export class CatModule {
  static register(options: CatModuleOptions): DynamicModule {
    return {
      module: CatModule,
      providers: [
        {
          provide: PROCESS_INSTANCE_TOKEN,
          useValue: options,
        },
        {
          provide: CAT_MODULE_ID,
          useValue: randomStringGenerator(),
        },
      ],
    };
  }

  static registerAsync(options: CatModuleAsyncOptions): DynamicModule {
    return {
      module: CatModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: PROCESS_INSTANCE_TOKEN,
          useFactory: (options: CatModuleOptions) => options,
          inject: [CAT_MODULE_OPTIONS],
        },
        {
          provide: CAT_MODULE_ID,
          useValue: randomStringGenerator(),
        },
        ...(options.extraProviders || []),
      ],
    };
  }

  private static createAsyncProviders(
    options: CatModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: CatModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: CAT_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: CAT_MODULE_OPTIONS,
      useFactory: async (optionsFactory: CatModuleOptionsFactory) =>
        optionsFactory.createCatOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
