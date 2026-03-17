import { Test, TestingModule } from '@nestjs/testing';
import { FoundationClassesController } from './foundation-classes.controller';

describe('FoundationClassesController', () => {
  let controller: FoundationClassesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoundationClassesController],
    }).compile();

    controller = module.get<FoundationClassesController>(FoundationClassesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
