
import { Controller, Get, Post, Request, Param, Body, Query, UseGuards, Patch } from '@nestjs/common';
import { SportService } from './sport.service';
import { CreateSerieDto, CreateSessionDto, UpdateSerieDto } from './dto/session.dto';
import { Exercise, Prisma, Sport } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
@Controller('sport')
export class SportController {
  constructor(private readonly sportService: SportService) {}

  // SPORT

  @Get()
  async getSports(): Promise<Sport[]> {
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
    return this.sportService.getExercisesBySportId(parseInt(sportId));
  }

  @Post(':sportId/exercise')
  async createExercise(
    @Param('sportId') sportId: any,
    @Body() data: Exercise
  ) {
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
    console.log("------- create Session", req.user, sessionDto)
    return this.sportService.createSession(req.user.id, sessionDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('session')
  async getAllSessions(
    @Request() req,
  ) {
    // const a = await this.sportService.getAllSessions(req.user.id);
    return this.sportService.getAllSessions(req.user.id);
  }


  @UseGuards(JwtAuthGuard)
  @Get('session/:sportId')
  getSessionBySportId(
    @Request() req,
    @Param('sportId') sportId
  ) {
    return this.sportService.getSessionBySportId(req.user.id, parseInt(sportId))
  }

  ////////////
  // SERIES
  ////////////

  @UseGuards(JwtAuthGuard)
  @Post('session/serie')
  createSerie(
    @Request() req,
    @Body() data: CreateSerieDto
  ) {
    return this.sportService.createSerie(req.user.id, data)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('session/serie')
  updateSerie(
    @Body() data: UpdateSerieDto
  ) {
    return this.sportService.updateSerie(data)
  }


  @UseGuards(JwtAuthGuard)
  @Get('session/:sessionId/series')
  getSeriesFromSession(
    @Request() req,
    @Param('sessionId') sessionId
  ) {
    return this.sportService.getAllSeriesFromSession(parseInt(req.user.id), parseInt(sessionId))
  }


  @UseGuards(JwtAuthGuard)
  @Get('session/lastSeries/:exerciseId')
  getLastSeriesOfExercise(
    @Request() req,
    @Param('exerciseId') exerciseId
  ) {
    return this.sportService.getLastSeriesOfExercise(parseInt(req.user.id), parseInt(exerciseId))
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
