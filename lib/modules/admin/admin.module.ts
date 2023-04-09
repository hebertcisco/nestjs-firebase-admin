import {DynamicModule, Module, Provider, Type} from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

import {
  ADMIN_MODULE_ID,
  ADMIN_MODULE_OPTIONS,
  FIREBASE_ADMIN_INSTANCE_TOKEN,
} from './admin.constants';

import { AdminService } from './admin.service';

import type {
  AdminModuleAsyncOptions,
  AdminModuleOptionsFactory,
} from './interfaces';

import type { AdminModuleOptions } from './types';

@Module({
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {
  static register(options: AdminModuleOptions): DynamicModule {
    return {
      module: AdminModule,
      providers: [
        {
          provide: FIREBASE_ADMIN_INSTANCE_TOKEN,
          useValue: options,
        },
        {
          provide: ADMIN_MODULE_ID,
          useValue: randomStringGenerator(),
        },
      ],
    };
  }

  static registerAsync(options: AdminModuleAsyncOptions) {
    return {
      module: AdminModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: FIREBASE_ADMIN_INSTANCE_TOKEN,
          useFactory: (options: AdminModuleOptions) => options,
          inject: [ADMIN_MODULE_OPTIONS],
        },
        {
          provide: ADMIN_MODULE_ID,
          useValue: randomStringGenerator(),
        },
        ...(options.extraProviders || []),
      ],
    };
  }

  private static createAsyncProviders(
    options: AdminModuleAsyncOptions,
  )  {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
        {
            provide: options.useClass,
            useClass: options.useClass,

        }
    ];
  }

  private static createAsyncOptionsProvider(
    options: AdminModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: ADMIN_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: ADMIN_MODULE_OPTIONS,
      useFactory: async (optionsFactory: AdminModuleOptionsFactory) =>
        optionsFactory.createAdminOptions(),
      inject: [
        (options.useExisting || options.useClass) as Type<AdminModuleOptionsFactory>,
      ]
    };
  }
}
