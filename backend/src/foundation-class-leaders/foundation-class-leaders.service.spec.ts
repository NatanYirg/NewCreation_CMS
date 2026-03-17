import { Test, TestingModule } from '@nestjs/testing';
import { FoundationClassLeadersService } from './foundation-class-leaders.service';

describe('FoundationClassLeadersService', () => {
  let service: FoundationClassLeadersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoundationClassLeadersService],
    }).compile();

    service = module.get<FoundationClassLeadersService>(FoundationClassLeadersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
