import { Injectable } from '@nestjs/common';
import { getAuth } from 'firebase-admin/auth';
import { AdminService } from './admin.service';

@Injectable()
export class AuthService {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Get the Firebase Auth instance
   */
  get auth() {
    return getAuth(this.adminService.appRef);
  }

  /**
   * Create a new user
   * @param properties User properties
   * @returns The created user record
   */
  async createUser(properties: {
    email?: string;
    emailVerified?: boolean;
    phoneNumber?: string;
    password?: string;
    displayName?: string;
    photoURL?: string;
    disabled?: boolean;
  }) {
    return this.auth.createUser(properties);
  }

  /**
   * Get a user by their UID
   * @param uid The user's UID
   * @returns The user record
   */
  async getUser(uid: string) {
    return this.auth.getUser(uid);
  }

  /**
   * Get a user by their email
   * @param email The user's email
   * @returns The user record
   */
  async getUserByEmail(email: string) {
    return this.auth.getUserByEmail(email);
  }

  /**
   * Get a user by their phone number
   * @param phoneNumber The user's phone number
   * @returns The user record
   */
  async getUserByPhoneNumber(phoneNumber: string) {
    return this.auth.getUserByPhoneNumber(phoneNumber);
  }

  /**
   * Update a user's properties
   * @param uid The user's UID
   * @param properties The properties to update
   * @returns The updated user record
   */
  async updateUser(
    uid: string,
    properties: {
      email?: string;
      emailVerified?: boolean;
      phoneNumber?: string;
      password?: string;
      displayName?: string;
      photoURL?: string;
      disabled?: boolean;
    },
  ) {
    return this.auth.updateUser(uid, properties);
  }

  /**
   * Delete a user
   * @param uid The user's UID
   */
  async deleteUser(uid: string) {
    return this.auth.deleteUser(uid);
  }

  /**
   * Create a custom token for a user
   * @param uid The user's UID
   * @param claims Optional custom claims
   * @returns The custom token
   */
  async createCustomToken(uid: string, claims?: object) {
    return this.auth.createCustomToken(uid, claims);
  }

  /**
   * Verify an ID token
   * @param idToken The ID token to verify
   * @returns The decoded token
   */
  async verifyIdToken(idToken: string) {
    return this.auth.verifyIdToken(idToken);
  }

  /**
   * Set custom claims for a user
   * @param uid The user's UID
   * @param claims The custom claims to set
   */
  async setCustomUserClaims(uid: string, claims: object) {
    return this.auth.setCustomUserClaims(uid, claims);
  }

  /**
   * List users
   * @param maxResults Maximum number of users to return
   * @param pageToken Page token for pagination
   * @returns List of users and next page token
   */
  async listUsers(maxResults?: number, pageToken?: string) {
    return this.auth.listUsers(maxResults, pageToken);
  }
}
