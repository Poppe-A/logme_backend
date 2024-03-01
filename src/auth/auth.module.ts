import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from "@nestjs/passport"
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';


@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: "secret",
      signOptions: { expiresIn: '1000s' },
    }),],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
