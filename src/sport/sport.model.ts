import { Prisma } from '@prisma/client';

export class Sport implements Prisma.SportCreateInput {
  name: string;
}
