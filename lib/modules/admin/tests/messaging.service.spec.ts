import { Test, TestingModule } from '@nestjs/testing';
import { MessagingService } from '../services/messaging.service';
import { App } from 'firebase-admin/app';
import { Messaging, Message, MulticastMessage, TopicMessage } from 'firebase-admin/messaging';
import { FIREBASE_ADMIN_APP } from '../constants/admin.constants';

/**
 * Extended App type that includes messaging functionality
 */
interface AppWithMessaging extends App {
    messaging(): Messaging;
}

// Mock firebase-admin/messaging
jest.mock('firebase-admin/messaging', () => {
    return {
        Messaging: jest.fn().mockImplementation(() => ({
            send: jest.fn().mockResolvedValue('message-id'),
            sendMulticast: jest.fn().mockResolvedValue({
                successCount: 1,
                failureCount: 0,
                responses: [{ messageId: 'message-id' }],
            }),
            subscribeToTopic: jest.fn().mockResolvedValue({
                successCount: 1,
                failureCount: 0,
                errors: [],
            }),
            unsubscribeFromTopic: jest.fn().mockResolvedValue({
                successCount: 1,
                failureCount: 0,
                errors: [],
            }),
        })),
    };
});

describe('MessagingService', () => {
    let service: MessagingService;
    let mockMessaging: jest.Mocked<Messaging>;

    beforeEach(async () => {
        const mockApp = {
            messaging: jest.fn().mockReturnValue({
                send: jest.fn().mockResolvedValue('message-id'),
                sendMulticast: jest.fn().mockResolvedValue({
                    successCount: 1,
                    failureCount: 0,
                    responses: [{ messageId: 'message-id' }],
                }),
                subscribeToTopic: jest.fn().mockResolvedValue({
                    successCount: 1,
                    failureCount: 0,
                    errors: [],
                }),
                unsubscribeFromTopic: jest.fn().mockResolvedValue({
                    successCount: 1,
                    failureCount: 0,
                    errors: [],
                }),
            }),
        } as unknown as AppWithMessaging;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MessagingService,
                {
                    provide: FIREBASE_ADMIN_APP,
                    useValue: mockApp,
                },
            ],
        }).compile();

        service = module.get<MessagingService>(MessagingService);
        mockMessaging = mockApp.messaging() as jest.Mocked<Messaging>;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('sendToDevice', () => {
        it('should send a message to a single device', async () => {
            const token = 'device-token';
            const payload: Partial<Message> = {
                notification: {
                    title: 'Test Title',
                    body: 'Test Body',
                },
            };

            const result = await service.sendToDevice(token, payload);
            expect(result).toBe('message-id');
            expect(mockMessaging.send).toHaveBeenCalledWith({
                token,
                ...payload,
            } as Message);
        });
    });

    describe('sendToDevices', () => {
        it('should send a message to multiple devices', async () => {
            const tokens = ['token1', 'token2'];
            const payload: Partial<MulticastMessage> = {
                notification: {
                    title: 'Test Title',
                    body: 'Test Body',
                },
            };

            const result = await service.sendToDevices(tokens, payload);
            expect(result).toEqual({
                successCount: 1,
                failureCount: 0,
                responses: [{ messageId: 'message-id' }],
            });
            expect(mockMessaging.sendMulticast).toHaveBeenCalledWith({
                tokens,
                ...payload,
            } as MulticastMessage);
        });
    });

    describe('sendToTopic', () => {
        it('should send a message to a topic', async () => {
            const topic = 'test-topic';
            const payload: Partial<TopicMessage> = {
                notification: {
                    title: 'Test Title',
                    body: 'Test Body',
                },
            };

            const result = await service.sendToTopic(topic, payload);
            expect(result).toBe('message-id');
            expect(mockMessaging.send).toHaveBeenCalledWith({
                topic,
                ...payload,
            } as TopicMessage);
        });
    });

    describe('subscribeToTopic', () => {
        it('should subscribe devices to a topic', async () => {
            const tokens = ['token1', 'token2'];
            const topic = 'test-topic';

            const result = await service.subscribeToTopic(tokens, topic);
            expect(result).toEqual({
                successCount: 1,
                failureCount: 0,
                errors: [],
            });
            expect(mockMessaging.subscribeToTopic).toHaveBeenCalledWith(tokens, topic);
        });
    });

    describe('unsubscribeFromTopic', () => {
        it('should unsubscribe devices from a topic', async () => {
            const tokens = ['token1', 'token2'];
            const topic = 'test-topic';

            const result = await service.unsubscribeFromTopic(tokens, topic);
            expect(result).toEqual({
                successCount: 1,
                failureCount: 0,
                errors: [],
            });
            expect(mockMessaging.unsubscribeFromTopic).toHaveBeenCalledWith(tokens, topic);
        });
    });
}); 