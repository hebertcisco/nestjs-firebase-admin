import { Module } from '@nestjs/common';
import { AdminModule } from 'nestjs-firebase-admin';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY, FIREBASE_ADMIN_PROJECT_ID } from './app.constant';

@Module({
  imports: [AdminModule.register({
    credential: {
      projectId: FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: FIREBASE_ADMIN_PRIVATE_KEY,
    },
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
