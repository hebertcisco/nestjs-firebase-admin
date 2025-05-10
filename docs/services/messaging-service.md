# Messaging Service

The `MessagingService` provides a clean and type-safe interface for sending messages through Firebase Cloud Messaging (FCM). This service is automatically injected when you import the `AdminModule`.

## Features

- Send messages to individual devices
- Send multicast messages to multiple devices
- Topic messaging
- Conditional messaging
- Message customization
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
    await this.messagingService.send({
      token: deviceToken,
      notification: {
        title,
        body,
      },
    });
  }

  // Send a message to multiple devices
  async sendToDevices(deviceTokens: string[], title: string, body: string) {
    await this.messagingService.sendMulticast({
      tokens: deviceTokens,
      notification: {
        title,
        body,
      },
    });
  }

  // Send a message to a topic
  async sendToTopic(topic: string, title: string, body: string) {
    await this.messagingService.send({
      topic,
      notification: {
        title,
        body,
      },
    });
  }

  // Subscribe devices to a topic
  async subscribeToTopic(topic: string, deviceTokens: string[]) {
    await this.messagingService.subscribeToTopic(deviceTokens, topic);
  }

  // Unsubscribe devices from a topic
  async unsubscribeFromTopic(topic: string, deviceTokens: string[]) {
    await this.messagingService.unsubscribeFromTopic(deviceTokens, topic);
  }
}
```

## Available Methods

| Method | Description | Documentation |
|--------|-------------|---------------|
| `send(message)` | Sends a message to a device or topic | [Send Messages](https://firebase.google.com/docs/cloud-messaging/send-message) |
| `sendMulticast(message)` | Sends a message to multiple devices | [Send Multicast](https://firebase.google.com/docs/cloud-messaging/send-message#send-messages-to-multiple-devices) |
| `subscribeToTopic(tokens, topic)` | Subscribes devices to a topic | [Topic Management](https://firebase.google.com/docs/cloud-messaging/manage-topics) |
| `unsubscribeFromTopic(tokens, topic)` | Unsubscribes devices from a topic | [Topic Management](https://firebase.google.com/docs/cloud-messaging/manage-topics) |

## Message Types

The service supports various message types:

- **Notification Messages**: Simple messages with title and body
- **Data Messages**: Custom key-value pairs
- **Combined Messages**: Both notification and data
- **Android Messages**: Android-specific configurations
- **APNS Messages**: iOS-specific configurations
- **Webpush Messages**: Web-specific configurations
