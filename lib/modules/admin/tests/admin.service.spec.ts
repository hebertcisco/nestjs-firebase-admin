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

  it('processObservable', async () => {
    service.processObservable().subscribe(processTest => {
      expect(processTest.platform).toBe(process.platform);
    });
  });
});
