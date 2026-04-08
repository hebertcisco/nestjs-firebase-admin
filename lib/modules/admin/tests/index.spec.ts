import * as rootExports from '../../../index';
import * as interfaceExports from '../interfaces/index';
import * as typeExports from '../types/index';

describe('Barrel exports', () => {
  describe('root index.ts', () => {
    it('should export AdminModule', () => {
      expect(rootExports.AdminModule).toBeDefined();
    });

    it('should export AdminService', () => {
      expect(rootExports.AdminService).toBeDefined();
    });

    it('should export DatabaseService', () => {
      expect(rootExports.DatabaseService).toBeDefined();
    });

    it('should export MessagingService', () => {
      expect(rootExports.MessagingService).toBeDefined();
    });

    it('should export FirestoreService', () => {
      expect(rootExports.FirestoreService).toBeDefined();
    });

    it('should export AuthService', () => {
      expect(rootExports.AuthService).toBeDefined();
    });
  });

  describe('interfaces/index.ts', () => {
    it('should export interface members', () => {
      expect(interfaceExports).toBeDefined();
    });
  });

  describe('types/index.ts', () => {
    it('should export type members', () => {
      expect(typeExports).toBeDefined();
    });
  });
});
