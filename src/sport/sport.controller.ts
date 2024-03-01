
import { Controller, Get, Post, Request, Param, Body, Query, UseGuards } from '@nestjs/common';
import { SportService } from './sport.service';
import { CreateSerieDto, CreateSessionDto } from './dto/session.dto';
import { Exercise, Prisma, Sport } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
@Controller('sport')
export class SportController {
  constructor(private readonly sportService: SportService) {}

  // SPORT

  @Get()
  async getSports(): Promise<Sport[]> {
    console.log("get sports")
    return this.sportService.getAllSports();
  }

  @Post()
  async createSport(@Body() data: Sport): Promise<Prisma.SportCreateInput> {
    return this.sportService.createSport(data);
  }

  ////////////
  // EXERCISES
  ////////////

  @Get(':sportId/exercise')
  async getExercisesBySportId(@Param('sportId') sportId): Promise<Prisma.SportCreateInput[]> {
    console.log("get exercises", sportId)

    return this.sportService.getExercisesBySportId(parseInt(sportId));
  }

  @Post(':sportId/exercise')
  async createExercise(
    @Param('sportId') sportId: any,
    @Body() data: Exercise
  ) {
    console.log("zsefrzegfr")
    return this.sportService.createExercise(parseInt(sportId), data);
  }

  // @Get('exercises/:id')
  // getExercisesBySport(@Param('id') id) {
  //   return this.sportService.getExercisesBySport(id)
  // }

  ////////////
  // SESSIONS
  ////////////

  @UseGuards(JwtAuthGuard)
  @Post('session')
  createSession(
    @Request() req,
    @Body() sessionDto: CreateSessionDto
  ) {
    console.log("req", req.user)
    return this.sportService.createSession(req.user.id, sessionDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('session')
  async getAllSessions(
    @Request() req,
  ) {
    const a = await this.sportService.getAllSessions(req.user.id);
    return this.sportService.getAllSessions(req.user.id);
  }


  @UseGuards(JwtAuthGuard)
  @Get('session/:sportId')
  getSessionBySportId(
    @Request() req,
    @Param('sportId') sportId
  ) {
    return this.sportService.getSessionBySportId(req.user.userId, parseInt(sportId))
  }

  ////////////
  // SERIES
  ////////////

  @UseGuards(JwtAuthGuard)
  @Post('session/serie')
  createSerie(
    @Body() data: CreateSerieDto
  ) {
    return this.sportService.createSerie(data)
  }

  @UseGuards(JwtAuthGuard)
  @Get('session/:sessionId/series')
  getSeriesFromSession(
    @Request() req,
    @Param('sessionId') sessionId
  ) {
    console.log("ttt", typeof sessionId)
    return this.sportService.getAllSeriesFromSession(parseInt(req.user.userId), parseInt(sessionId))
  }

  // @Get('sessions/:userId')
  // getSessions(@Param('userId') userId) {
  //   return this.sportService.getSessions(userId)
  // }

  // @Get('sessions/:sessionId')
  // getSession(@Param('sessionId') sessionId) {
  //   return this.sportService.getSession(sessionId)
  // }





}
