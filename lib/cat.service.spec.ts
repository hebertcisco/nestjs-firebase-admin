import { Test, TestingModule } from '@nestjs/testing';
import { CatServiceMock } from '../tests/mock/CatService.mock';
import { CatService } from './cat.service';

describe('CatService', () => {
  let service: CatService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CatService,
          useClass: CatServiceMock,
        },
      ],
    }).compile();

    service = module.get<CatService>(CatService);
  });

  it('processObservable', async () => {
    service.processObservable().subscribe(processTest => {
      expect(processTest.platform).toBe(process.platform);
    });
  });
});
