import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { UserDto } from 'src/auth/auth.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post('/signup')
  // async signup(
  //   @Body('password') password: string,
  //   @Body('username') username: string,
  // ): Promise<UserDto> {
  //   console.log(
  //     '🚀 ~ file: user.controller.ts:11 ~ AppController ~ signup ~ request:',
  //   );
  //   const saltOrRounds = 10;
  //   const hashedPassword = await bcrypt.hash(password, saltOrRounds);
  //   const result = await this.userService.createUser(
  //     username,
  //     hashedPassword,
  //   );
  //   return result;
  // }
}