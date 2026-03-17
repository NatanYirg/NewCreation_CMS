import { Test, TestingModule } from '@nestjs/testing';
import { FoundationClassLeadersController } from './foundation-class-leaders.controller';

describe('FoundationClassLeadersController', () => {
  let controller: FoundationClassLeadersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoundationClassLeadersController],
    }).compile();

    controller = module.get<FoundationClassLeadersController>(FoundationClassLeadersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
