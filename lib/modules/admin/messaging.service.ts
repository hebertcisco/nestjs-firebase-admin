import { Injectable, Inject } from '@nestjs/common';
import { FIREBASE_ADMIN_APP } from './admin.constants';
import { App } from 'firebase-admin/app';
import {
  Messaging,
  Message,
  MulticastMessage,
  TopicMessage,
} from 'firebase-admin/messaging';

/**
 * Extended App type that includes messaging functionality
 */
interface AppWithMessaging extends App {
  messaging(): Messaging;
}

/**
 * Service for handling Firebase Cloud Messaging (FCM) operations.
 *
 * This service provides methods to send messages to devices using Firebase Cloud Messaging.
 * It supports sending messages to single devices, multiple devices, and topics.
 *
 * @see {@link https://firebase.google.com/docs/cloud-messaging Firebase Cloud Messaging}
 */
@Injectable()
export class MessagingService {
  private readonly messaging: Messaging;

  constructor(
    @Inject(FIREBASE_ADMIN_APP)
    private readonly app: AppWithMessaging,
  ) {
    this.messaging = this.app.messaging();
  }

  /**
   * Sends a message to a single device.
   *
   * @param token - The registration token of the target device
   * @param payload - The message payload
   * @returns Promise that resolves with the message ID
   */
  async sendToDevice(
    token: string,
    payload: Partial<Message>,
  ): Promise<string> {
    const message: Message = {
      token,
      ...payload,
    } as Message;

    const response = await this.messaging.send(message);
    return response;
  }

  /**
   * Sends a message to multiple devices.
   *
   * @param tokens - Array of registration tokens
   * @param payload - The message payload
   * @returns Promise that resolves with the batch response
   */
  async sendToDevices(
    tokens: string[],
    payload: Partial<MulticastMessage>,
  ): Promise<MessagingBatchResponse> {
    const message: MulticastMessage = {
      tokens,
      ...payload,
    } as MulticastMessage;

    const response = await this.messaging.sendMulticast(message);
    return response;
  }

  /**
   * Sends a message to a topic.
   *
   * @param topic - The topic to send the message to
   * @param payload - The message payload
   * @returns Promise that resolves with the message ID
   */
  async sendToTopic(
    topic: string,
    payload: Partial<TopicMessage>,
  ): Promise<string> {
    const message: TopicMessage = {
      topic,
      ...payload,
    } as TopicMessage;

    const response = await this.messaging.send(message);
    return response;
  }

  /**
   * Subscribes devices to a topic.
   *
   * @param tokens - Array of registration tokens to subscribe
   * @param topic - The topic to subscribe to
   * @returns Promise that resolves with the topic management response
   */
  async subscribeToTopic(
    tokens: string[],
    topic: string,
  ): Promise<MessagingTopicManagementResponse> {
    const response = await this.messaging.subscribeToTopic(tokens, topic);
    return response;
  }

  /**
   * Unsubscribes devices from a topic.
   *
   * @param tokens - Array of registration tokens to unsubscribe
   * @param topic - The topic to unsubscribe from
   * @returns Promise that resolves with the topic management response
   */
  async unsubscribeFromTopic(
    tokens: string[],
    topic: string,
  ): Promise<MessagingTopicManagementResponse> {
    const response = await this.messaging.unsubscribeFromTopic(tokens, topic);
    return response;
  }
}

/**
 * Interface for FCM message payload
 */
export interface MessagingPayload {
  notification?: {
    title?: string;
    body?: string;
    imageUrl?: string;
  };
  data?: {
    [key: string]: string;
  };
  android?: {
    priority?: 'high' | 'normal';
    ttl?: number;
    notification?: {
      channelId?: string;
      clickAction?: string;
      color?: string;
      icon?: string;
      sound?: string;
      tag?: string;
      title?: string;
      body?: string;
    };
  };
  apns?: {
    payload?: {
      aps?: {
        alert?: {
          title?: string;
          body?: string;
        };
        sound?: string;
        badge?: number;
      };
    };
    headers?: {
      [key: string]: string;
    };
  };
  webpush?: {
    headers?: {
      [key: string]: string;
    };
    notification?: {
      title?: string;
      body?: string;
      icon?: string;
      badge?: string;
      data?: {
        [key: string]: string;
      };
      actions?: Array<{
        action: string;
        title: string;
        icon?: string;
      }>;
    };
  };
}

/**
 * Type for FCM message
 */
export type MessagingMessage = {
  token: string;
} & MessagingPayload;

/**
 * Type for FCM multicast message
 */
export type MessagingMulticastMessage = {
  tokens: string[];
} & MessagingPayload;

/**
 * Type for FCM topic message
 */
export type MessagingTopicMessage = {
  topic: string;
} & MessagingPayload;

/**
 * Type for FCM batch response
 */
export type MessagingBatchResponse = {
  successCount: number;
  failureCount: number;
  responses: Array<{
    messageId?: string;
    error?: {
      code: string;
      message: string;
    };
  }>;
};

/**
 * Type for FCM topic management response
 */
export type MessagingTopicManagementResponse = {
  successCount: number;
  failureCount: number;
  errors: Array<{
    index: number;
    error: {
      code: string;
      message: string;
    };
  }>;
};
