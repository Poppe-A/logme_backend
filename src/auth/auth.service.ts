import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async login(username: string): Promise<any> {
    const user = await this.userService.getUser(username);
    const payload = { sub: user.id, username: user.username };
    return {
      user: {
        username: username,
        id: user.id,
      },
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signup(username: string, password: string): Promise<UserDto> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const result = await this.userService.createUser(username, hashedPassword);
    return result;
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.getUser(username);

    if (user) {
      const isPasswordValid = await bcrypt.compare(pass, user.password);
      if (isPasswordValid) {
        return user;
      } else {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
    }
    throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }
}
