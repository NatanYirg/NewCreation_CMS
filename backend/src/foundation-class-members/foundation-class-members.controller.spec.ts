import { Test, TestingModule } from '@nestjs/testing';
import { FoundationClassMembersController } from './foundation-class-members.controller';

describe('FoundationClassMembersController', () => {
  let controller: FoundationClassMembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoundationClassMembersController],
    }).compile();

    controller = module.get<FoundationClassMembersController>(FoundationClassMembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
