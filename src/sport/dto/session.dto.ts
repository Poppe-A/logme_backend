import { Exercise } from '@prisma/client';

export class CreateSessionDto {
  sportId: number;
  name: string;
  sessionOptions: {
    template?: string;
    customExercises?: Exercise[];
  };
}

export class CreateSerieDto {
  sessionId: number;
  exerciseId: number;
  value?: number;
}

export class UpdateSerieDto {
  id: number;
  value: number;
  sessionId: number;
}
