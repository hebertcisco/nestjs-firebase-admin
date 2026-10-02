import { Inject, Injectable } from '@nestjs/common';
import { getRemoteConfig, RemoteConfig } from 'firebase-admin/remote-config';
import type {
  RemoteConfigTemplate,
  ListVersionsOptions,
  ListVersionsResult,
} from 'firebase-admin/remote-config';
import type { App } from 'firebase-admin/app';
import { FIREBASE_ADMIN_APP } from '../constants/admin.constants';

/** Injectable wrapper for Firebase Remote Config administration. */
@Injectable()
export class RemoteConfigService {
  private readonly remoteConfig: RemoteConfig;

  constructor(@Inject(FIREBASE_ADMIN_APP) app: App) {
    this.remoteConfig = getRemoteConfig(app);
  }

  get service(): RemoteConfig {
    return this.remoteConfig;
  }

  getTemplate(): Promise<RemoteConfigTemplate> {
    return this.remoteConfig.getTemplate();
  }

  publishTemplate(
    template: RemoteConfigTemplate,
    force = false,
  ): Promise<RemoteConfigTemplate> {
    return this.remoteConfig.publishTemplate(template, { force });
  }

  rollback(versionNumber: number | string): Promise<RemoteConfigTemplate> {
    return this.remoteConfig.rollback(versionNumber);
  }

  listVersions(options?: ListVersionsOptions): Promise<ListVersionsResult> {
    return this.remoteConfig.listVersions(options);
  }

  createTemplateFromJSON(json: string): RemoteConfigTemplate {
    return this.remoteConfig.createTemplateFromJSON(json);
  }
}
