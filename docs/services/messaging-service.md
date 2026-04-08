# Messaging Service

The `MessagingService` provides a clean and type-safe interface for sending messages through Firebase Cloud Messaging (FCM). This service is automatically injected when you import the `AdminModule`.

## Features

- Send messages to individual devices
- Send messages to multiple devices
- Topic messaging and subscription management
- Message customization per platform (Android, iOS, Web)
- TypeScript type support

## Usage Example

```ts
import { Injectable } from '@nestjs/common';
import { MessagingService } from 'nestjs-firebase-admin';

@Injectable()
export class NotificationService {
  constructor(private readonly messagingService: MessagingService) {}

  // Send a message to a single device
  async sendToDevice(deviceToken: string, title: string, body: string) {
    return this.messagingService.sendToDevice(deviceToken, {
      notification: {
        title,
        body,
      },
    });
  }

  // Send a message to multiple devices
  async sendToDevices(deviceTokens: string[], title: string, body: string) {
    return this.messagingService.sendToDevices(deviceTokens, {
      notification: {
        title,
        body,
      },
    });
  }

  // Send a message to a topic
  async sendToTopic(topic: string, title: string, body: string) {
    return this.messagingService.sendToTopic(topic, {
      notification: {
        title,
        body,
      },
    });
  }

  // Subscribe devices to a topic
  async subscribeToTopic(topic: string, deviceTokens: string[]) {
    return this.messagingService.subscribeToTopic(deviceTokens, topic);
  }

  // Unsubscribe devices from a topic
  async unsubscribeFromTopic(topic: string, deviceTokens: string[]) {
    return this.messagingService.unsubscribeFromTopic(deviceTokens, topic);
  }
}
```

## Available Methods

| Method | Description | Documentation |
|--------|-------------|---------------|
| `sendToDevice(token, payload)` | Sends a message to a single device | [Send Messages](https://firebase.google.com/docs/cloud-messaging/send-message) |
| `sendToDevices(tokens, payload)` | Sends a message to multiple devices | [Send Multicast](https://firebase.google.com/docs/cloud-messaging/send-message#send-messages-to-multiple-devices) |
| `sendToTopic(topic, payload)` | Sends a message to a topic | [Topic Messaging](https://firebase.google.com/docs/cloud-messaging/send-message#send-messages-to-topics) |
| `subscribeToTopic(tokens, topic)` | Subscribes devices to a topic | [Topic Management](https://firebase.google.com/docs/cloud-messaging/manage-topics) |
| `unsubscribeFromTopic(tokens, topic)` | Unsubscribes devices from a topic | [Topic Management](https://firebase.google.com/docs/cloud-messaging/manage-topics) |

## Message Types

The service supports various message types:

- **Notification Messages**: Simple messages with title and body
- **Data Messages**: Custom key-value pairs
- **Combined Messages**: Both notification and data
- **Android Messages**: Android-specific configurations (priority, TTL, channel)
- **APNS Messages**: iOS-specific configurations (sound, badge, alert)
- **Webpush Messages**: Web-specific configurations (headers, icons, actions)
