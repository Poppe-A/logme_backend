export class CreateSessionDto {
  sportId: number;
  name: string;
}

export class CreateSerieDto {
  sessionId: number
  exerciseId: number;
  value: number;
  order: number;
}
