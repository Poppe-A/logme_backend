import { Controller, Get, Post, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    console.log(
      '🚀 ~ file: app.controller.ts:11 ~ AppController ~ getHello ~ request:'
    );
    return this.appService.getHello();
  }
}
