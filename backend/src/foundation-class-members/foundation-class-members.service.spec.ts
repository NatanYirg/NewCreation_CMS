import { Test, TestingModule } from '@nestjs/testing';
import { FoundationClassMembersService } from './foundation-class-members.service';

describe('FoundationClassMembersService', () => {
  let service: FoundationClassMembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoundationClassMembersService],
    }).compile();

    service = module.get<FoundationClassMembersService>(FoundationClassMembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
