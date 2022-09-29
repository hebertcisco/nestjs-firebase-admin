import type { Agent } from 'node:http';
import type { ServiceAccount } from 'firebase-admin/app';

export type AdminConfig = {
  credential: ServiceAccount;
  databaseURL?: string;
  databaseAuthVariableOverride?: object | null;
  serviceAccountId?: string;
  storageBucket?: string;
  projectId?: string;
  httpAgent?: Agent;
};
export type AdminModuleOptions = AdminConfig;
