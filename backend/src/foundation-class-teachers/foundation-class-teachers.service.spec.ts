import { Test, TestingModule } from '@nestjs/testing';
import { FoundationClassTeachersService } from './foundation-class-teachers.service';

describe('FoundationClassTeachersService', () => {
  let service: FoundationClassTeachersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoundationClassTeachersService],
    }).compile();

    service = module.get<FoundationClassTeachersService>(FoundationClassTeachersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
