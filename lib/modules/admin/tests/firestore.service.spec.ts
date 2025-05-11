import { Test, TestingModule } from '@nestjs/testing';
import { FirestoreService } from '../services/firestore.service';
import { App } from 'firebase-admin/app';
import { Firestore, CollectionReference, DocumentReference, DocumentData } from 'firebase-admin/firestore';
import { FIREBASE_ADMIN_APP, FIREBASE_ADMIN_INSTANCE_TOKEN } from '../constants/admin.constants';

interface AppWithFirestore extends App {
    firestore(): Firestore;
}

describe('FirestoreService', () => {
    let service: FirestoreService;
    let mockFirestore: jest.Mocked<Firestore>;
    let mockCollection: jest.Mocked<CollectionReference>;
    let mockDoc: jest.Mocked<DocumentReference>;

    beforeEach(async () => {
        mockDoc = {
            get: jest.fn().mockResolvedValue({ exists: true, data: () => ({ foo: 'bar' }) }),
            set: jest.fn().mockResolvedValue(undefined),
            update: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
        } as any;
        mockCollection = {
            add: jest.fn().mockResolvedValue({ id: 'new-id' }),
            get: jest.fn().mockResolvedValue({ docs: [{ data: () => ({ foo: 'bar' }) }] }),
        } as any;
        mockFirestore = {
            collection: jest.fn().mockReturnValue(mockCollection),
            doc: jest.fn().mockReturnValue(mockDoc),
        } as any;
        const mockApp = {
            firestore: jest.fn().mockReturnValue(mockFirestore),
        } as unknown as AppWithFirestore;

        jest.spyOn(require('firebase-admin/firestore'), 'getFirestore').mockReturnValue(mockFirestore);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FirestoreService,
                {
                    provide: FIREBASE_ADMIN_APP,
                    useValue: mockApp,
                },
                {
                    provide: FIREBASE_ADMIN_INSTANCE_TOKEN,
                    useValue: {
                        credential: {
                            projectId: 'test-project',
                            clientEmail: 'test@example.com',
                            privateKey: 'test-key',
                        },
                        databaseURL: 'https://test-project.firebaseio.com',
                        storageBucket: 'test-project.appspot.com',
                        projectId: 'test-project',
                    },
                },
            ],
        }).compile();

        service = module.get<FirestoreService>(FirestoreService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should get a collection reference', () => {
        const col = service.collection('test');
        expect(col).toBe(mockCollection);
        expect(mockFirestore.collection).toHaveBeenCalledWith('test');
    });

    it('should get a document reference', () => {
        const doc = service.doc('test/doc');
        expect(doc).toBe(mockDoc);
        expect(mockFirestore.doc).toHaveBeenCalledWith('test/doc');
    });

    it('should get document data', async () => {
        const data = await service.get('test/doc');
        expect(data).toEqual({ foo: 'bar' });
        expect(mockDoc.get).toHaveBeenCalled();
    });

    it('should set document data', async () => {
        await expect(service.set('test/doc', { foo: 'baz' })).resolves.toBeUndefined();
        expect(mockDoc.set).toHaveBeenCalledWith({ foo: 'baz' });
    });

    it('should set document data with options', async () => {
        await expect(service.set('test/doc', { foo: 'baz' }, { merge: true })).resolves.toBeUndefined();
        expect(mockDoc.set).toHaveBeenCalledWith({ foo: 'baz' }, { merge: true });
    });

    it('should update document data', async () => {
        await expect(service.update('test/doc', { foo: 'updated' })).resolves.toBeUndefined();
        expect(mockDoc.update).toHaveBeenCalledWith({ foo: 'updated' });
    });

    it('should delete a document', async () => {
        await expect(service.delete('test/doc')).resolves.toBeUndefined();
        expect(mockDoc.delete).toHaveBeenCalled();
    });

    it('should add a document to a collection', async () => {
        const ref = await service.add('test', { foo: 'new' });
        expect(ref).toEqual({ id: 'new-id' });
        expect(mockCollection.add).toHaveBeenCalledWith({ foo: 'new' });
    });

    it('should query a collection', async () => {
        const docs = await service.query('test');
        expect(docs).toEqual([{ foo: 'bar' }]);
        expect(mockCollection.get).toHaveBeenCalled();
    });
}); 