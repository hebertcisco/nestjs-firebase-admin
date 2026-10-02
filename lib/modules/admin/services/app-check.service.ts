import { Inject, Injectable } from '@nestjs/common';
import { createRequire } from 'node:module';
import type { AppCheck } from 'firebase-admin/app-check';
import type {
  AppCheckToken,
  AppCheckTokenOptions,
  VerifyAppCheckTokenOptions,
  VerifyAppCheckTokenResponse,
} from 'firebase-admin/app-check';
import type { App } from 'firebase-admin/app';
import { FIREBASE_ADMIN_APP } from '../constants/admin.constants';

/** Injectable wrapper for Firebase App Check token operations. */
@Injectable()
export class AppCheckService {
  private readonly appCheck: AppCheck;

  constructor(@Inject(FIREBASE_ADMIN_APP) app: App) {
    const appCheckRequire = createRequire(__filename);
    const { getAppCheck } = appCheckRequire(
      'firebase-admin/app-check',
    ) as typeof import('firebase-admin/app-check');
    this.appCheck = getAppCheck(app);
  }

  get service(): AppCheck {
    return this.appCheck;
  }

  async createToken(
    appId: string,
    options?: AppCheckTokenOptions,
  ): Promise<AppCheckToken> {
    return this.appCheck.createToken(appId, options);
  }

  async verifyToken(
    token: string,
    options?: VerifyAppCheckTokenOptions,
  ): Promise<VerifyAppCheckTokenResponse> {
    return this.appCheck.verifyToken(token, options);
  }
}
