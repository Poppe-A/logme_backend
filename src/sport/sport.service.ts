import { Injectable } from '@nestjs/common';
import { CreateSerieDto, CreateSessionDto } from './dto/session.dto';
import { Exercise, Prisma, Sport } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { create } from 'domain';

@Injectable()
export class SportService {
  constructor(private prisma: PrismaService) {}

  // SPORT
  async getAllSports(): Promise<Sport[]> {
    // return this.prisma.sport.findMany({ include: { exercises: true } });
    return this.prisma.sport.findMany();
  }

  async createSport(data: Sport): Promise<Sport | null> {
    return this.prisma.sport.create({ data })
  }

  async updateSport(id: number, data: Sport): Promise<Sport> {
    return this.prisma.sport.update({
      where: { id: Number(id) },
      data: { name: data.name }
    })
  }

  ////////////
  // EXERCISES
  ////////////

  async getExercisesBySportId(sportId: number): Promise<Exercise[]> {
    return this.prisma.exercise.findMany({ where: { sportId: sportId } })
  }

  async createExercise(sportId: number, data: Exercise): Promise<Exercise | null> {
    return this.prisma.exercise.create(
      {
        data: {
          sportId,
          name: data.name,
          description: data.description
        }
      })
  }

  ////////////
  // SESSIONS
  ////////////

  async createSession(userId: number, createSessionDto: CreateSessionDto) {
    try {

      return this.prisma.session.create({
        data: {
          userId: userId,
          sportId: createSessionDto.sportId,
          name: createSessionDto.name
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  formatSessionExerciseAndSeries(sessions) {
    const formattedSessions = sessions.map(session => {
      // Here we build an array of exercises present in the series
      const sessionExercises =
        session.series.map((serie) => {
          return { id: serie.exerciseId, name: serie.exercise.name };
        })

      const uniqueExercises = sessionExercises.reduce((acc, curr) => {
        if (!acc.find(item => item.id === curr.id)) {
          acc.push(curr);
        }
        return acc;
      }, [])

      console.log(session.name, uniqueExercises)


      const exercisesToDisplay = uniqueExercises.map((ex) => {
        const seriesFromExercise = session.series
          .filter((serie) => serie.exerciseId === ex.id)
          .sort((a, b) => a.order - b.order)
          .map(serie => {
            return {
              id: serie.id,
              value: serie.value,
              order: serie.order
            }
          })
        return {
          exerciseId: ex.id,
          exerciseName: ex.name,
          series: seriesFromExercise
        }
      })

      console.log(session.name, exercisesToDisplay)


      return {
        id: session.id,
        name: session.name,
        createdAt: session.createdAt,
        sportId: session.sportId,
        sportName: session.sport.name,
        exercises: exercisesToDisplay
      }
    })
    return formattedSessions
  }

  async getAllSessions(userId: number) {
    try {
      const allSessions = await this.prisma.session.findMany({
        where: {
          userId: userId
        },
        include: {
          sport: {
            select: {
              name: true
            }
          },
          series: {
            include: {
              exercise: {
                select: {
                  name: true,
                }
              }
            }
          }
        }
      })

      return allSessions?.length ? this.formatSessionExerciseAndSeries(allSessions) : []

    } catch (e) {
      console.log(e)
    }
  }

  async getSessionBySportId(userId: number, sportId: number) {
    try {
      return this.prisma.session.findMany({
        where: {
          userId,
          sportId
        },
        include: {
          series: true
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  ////////////
  // SERIES
  ////////////

  async createSerie(data: CreateSerieDto) {
    try {
      return this.prisma.serie.create({
        data
      })
    } catch (e) {
      console.log(e)
    }
  }

  async getAllSeriesFromSession(userId: number, sessionId: number) {
    // Prevent user getting series and sessions from other users
    const session = await this.prisma.session.findFirst({ where: { id: sessionId } })
    console.log("session", session, userId)
    if (session.userId === userId) {
      try {
        return this.prisma.serie.findMany({
          where: {
            sessionId
          }
        })
      } catch (e) {
        console.log(e)
      }
    } else {
      // throw error no rights
    }
  }


  // getExercisesBySport(id: number): string {
  //   return `All exercises for sport ${id}`;
  // }

  // getSessions(userId: number) {
  //   return `All sessions for ${userId}`;
  // }

  // getSession(sessionId: number) {
  //   return 'Format and return object with exercises and series';
  // }

  // getSortedExercisesAndSeries() {
  //   return 'Series sorted by exercises';

  // }

  // getExercisesBySession(sessionId: number) {
  //   // get
  // }

  // getSeriesBySession(sessionId: number) {
  //   return 'All series by session';
  // }




}
