import { Test, TestingModule } from '@nestjs/testing';
import { FoundationClassTeachersController } from './foundation-class-teachers.controller';

describe('FoundationClassTeachersController', () => {
  let controller: FoundationClassTeachersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoundationClassTeachersController],
    }).compile();

    controller = module.get<FoundationClassTeachersController>(FoundationClassTeachersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
