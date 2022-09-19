import type { Agent } from 'node:http';
import type { Credential } from 'firebase-admin/app';

export type AdminConfig = {
  credential: Credential;
  databaseURL?: string;
  databaseAuthVariableOverride?: object | null;
  serviceAccountId?: string;
  storageBucket?: string;
  projectId?: string;
  httpAgent?: Agent;
};
export type AdminModuleOptions = AdminConfig;
