import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import Admin from 'firebase-admin';

import {
  ADMIN_MODULE_ID,
  ADMIN_MODULE_OPTIONS,
  FIREBASE_ADMIN_INSTANCE_TOKEN,
  FIREBASE_ADMIN_APP,
} from './constants/admin.constants';

import { AdminService } from './services/admin.service';
import { DatabaseService } from './services/database.service';
import { MessagingService } from './services/messaging.service';
import { FirestoreService } from './services/firestore.service';

import type {
  AdminModuleAsyncOptions,
  AdminModuleOptionsFactory,
} from './interfaces';

import type { AdminModuleOptions } from './types';

@Module({
  providers: [
    AdminService,
    DatabaseService,
    MessagingService,
    FirestoreService,
    {
      provide: ADMIN_MODULE_ID,
      useValue: randomStringGenerator(),
    },
  ],
  exports: [
    AdminService,
    DatabaseService,
    MessagingService,
    FirestoreService,
  ],
})
export class AdminModule {
  static register(options: AdminModuleOptions): DynamicModule {
    const firebaseApp = Admin.initializeApp({
      ...options,
      credential: Admin.credential.cert(options.credential),
    });

    return {
      module: AdminModule,
      providers: [
        AdminService,
        DatabaseService,
        MessagingService,
        FirestoreService,
        {
          provide: FIREBASE_ADMIN_INSTANCE_TOKEN,
          useValue: options,
        },
        {
          provide: FIREBASE_ADMIN_APP,
          useValue: firebaseApp,
        },
        {
          provide: ADMIN_MODULE_ID,
          useValue: randomStringGenerator(),
        },
      ],
      exports: [
        AdminService,
        DatabaseService,
        MessagingService,
        FirestoreService,
        FIREBASE_ADMIN_INSTANCE_TOKEN,
        FIREBASE_ADMIN_APP,
      ],
    };
  }

  static registerAsync(options: AdminModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = [
      AdminService,
      DatabaseService,
      MessagingService,
      FirestoreService,
      {
        provide: ADMIN_MODULE_ID,
        useValue: randomStringGenerator(),
      },
    ];

    if (options.useFactory) {
      const factory = options.useFactory;
      providers.push({
        provide: FIREBASE_ADMIN_INSTANCE_TOKEN,
        useFactory: factory,
        inject: options.inject || [],
      });
      providers.push({
        provide: FIREBASE_ADMIN_APP,
        useFactory: async (...args: any[]) => {
          const config = await factory(...args);
          return Admin.initializeApp({
            ...config,
            credential: Admin.credential.cert(config.credential),
          });
        },
        inject: options.inject || [],
      });
    } else if (options.useExisting) {
      providers.push({
        provide: FIREBASE_ADMIN_INSTANCE_TOKEN,
        useFactory: async (optionsFactory: AdminModuleOptionsFactory) => {
          const config = await optionsFactory.createAdminOptions();
          return config;
        },
        inject: [options.useExisting],
      });
      providers.push({
        provide: FIREBASE_ADMIN_APP,
        useFactory: async (optionsFactory: AdminModuleOptionsFactory) => {
          const config = await optionsFactory.createAdminOptions();
          return Admin.initializeApp({
            ...config,
            credential: Admin.credential.cert(config.credential),
          });
        },
        inject: [options.useExisting],
      });
    } else if (options.useClass) {
      providers.push({
        provide: options.useClass,
        useClass: options.useClass,
      });
      providers.push({
        provide: FIREBASE_ADMIN_INSTANCE_TOKEN,
        useFactory: async (optionsFactory: AdminModuleOptionsFactory) => {
          const config = await optionsFactory.createAdminOptions();
          return config;
        },
        inject: [options.useClass],
      });
      providers.push({
        provide: FIREBASE_ADMIN_APP,
        useFactory: async (optionsFactory: AdminModuleOptionsFactory) => {
          const config = await optionsFactory.createAdminOptions();
          return Admin.initializeApp({
            ...config,
            credential: Admin.credential.cert(config.credential),
          });
        },
        inject: [options.useClass],
      });
    } else {
      throw new Error(
        'One of useFactory, useExisting, or useClass must be provided in AdminModuleAsyncOptions',
      );
    }

    return {
      module: AdminModule,
      imports: options.imports,
      providers,
      exports: [
        AdminService,
        DatabaseService,
        MessagingService,
        FirestoreService,
        FIREBASE_ADMIN_INSTANCE_TOKEN,
        FIREBASE_ADMIN_APP,
      ],
    };
  }
}
