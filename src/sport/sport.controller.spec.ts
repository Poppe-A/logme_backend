import { Test, TestingModule } from '@nestjs/testing';
import { SportController } from './sport.controller';
import { SportService } from './sport.service';

describe('AppController', () => {
  let sportController: SportController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SportController],
      providers: [SportService],
    }).compile();

    sportController = app.get<SportController>(SportController);
  });

  describe('root', () => {
    it('should return "All sports"', () => {
      expect(sportController.getSports()).toBe('All sports');
    });
  });
});
