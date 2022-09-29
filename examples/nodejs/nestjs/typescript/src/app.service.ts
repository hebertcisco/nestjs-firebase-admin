import { Injectable } from '@nestjs/common';
import { configService } from 'nest-shared';

import { AdminService } from 'nestjs-firebase-admin';
import { MessagingDevicesResponse } from 'firebase-admin/lib/messaging/messaging-api';

@Injectable()
export class AppService {
  constructor(private adminService: AdminService) { }
  async getHello(message: string): Promise<MessagingDevicesResponse> {
    const admin = this.adminService.admin();
    const registrationToken = configService.getValue('FCM_TOKEN');
    return admin.messaging().sendToDevice(registrationToken, {
      notification: {
        body: String(message) || 'Hello World!',
      }
    }, {
      priority: 'high',
      timeToLive: 60 * 60 * 24,
    });;
  }
}
