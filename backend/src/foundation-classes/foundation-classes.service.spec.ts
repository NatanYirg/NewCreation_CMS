import { Test, TestingModule } from '@nestjs/testing';
import { FoundationClassesService } from './foundation-classes.service';

describe('FoundationClassesService', () => {
  let service: FoundationClassesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoundationClassesService],
    }).compile();

    service = module.get<FoundationClassesService>(FoundationClassesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
