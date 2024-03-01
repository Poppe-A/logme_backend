import { Controller, Request, Post, UseGuards, Body, Get } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  getProfile(@Request() req) {
    return req.user;
  }

  //guard or pipe to verify email is ok
  @Post('signup')
  async signup(
    @Body('password') password: string,
    @Body('username') username: string,
  ): Promise<UserDto> {
    return this.authService.signup(username, password)
  }
}