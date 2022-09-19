import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from '../admin.service';
import { AdminServiceMock } from './mocks/AdminService.mock';

describe('AdminService', () => {
  let service: AdminService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AdminService,
          useClass: AdminServiceMock,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return an array of apps', () => {
    expect(service.getApps).toBeInstanceOf(Array);
  });
  it('should return an app', () => {
    expect(service.getApp).toBeInstanceOf(Object);
  });
  it('should return an app reference', () => {
    expect(service.appRef).toBeInstanceOf(Object);
  });
  it('should return an observable of an app', () => {
    expect(service.initializeAppObservable()).toBeInstanceOf(Object);
  });
  it('should return a credential', () => {
    expect(service.applicationDefault()).toBeNull();
  });
});
