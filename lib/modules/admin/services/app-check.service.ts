import { Inject, Injectable } from '@nestjs/common';
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
    // App Check currently pulls an ESM-only JWT dependency. Load it only when
    // this provider is instantiated so importing the package remains CommonJS-safe.
    // eslint-disable-next-line no-undef, @typescript-eslint/no-require-imports
    const { getAppCheck } =
      require('firebase-admin/app-check') as typeof import('firebase-admin/app-check');
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
