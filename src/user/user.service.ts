import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserDto } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(username: string, password: string): Promise<UserDto> {
    const existingUser = await this.prisma.user.findFirst({ where: { username: username } })

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    } else {
      const createdUser = await this.prisma.user.create({
        data: {
          username,
          password,
        }
      });
      return {
        username: createdUser.username,
        id: createdUser.id
      }
    }

  }

  async getUser(username: string): Promise<User> {
    return this.prisma.user.findFirst({ where: { username } })
  }

}