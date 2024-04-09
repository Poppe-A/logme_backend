import { Injectable } from '@nestjs/common';
import { CreateSerieDto, CreateSessionDto, UpdateSerieDto } from './dto/session.dto';
import { Exercise, Prisma, Serie, Session, Sport } from '@prisma/client';
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

    console.log("createSession", userId)
    try {
      const session = await this.prisma.session.create({
        data: {
          userId: userId,
          sportId: createSessionDto.sportId,
          name: createSessionDto.name
        }
      })
      console.log(" session created", createSessionDto)

      if (createSessionDto.sessionOptions?.template === 'custom' && createSessionDto.sessionOptions.customExercises?.length) {
        console.log('initiate series creation');

        const series: CreateSerieDto[] = createSessionDto.sessionOptions.customExercises.map((ex) => {
          return {
            sessionId: session.id,
            exerciseId: ex.id,
            value: 0,
            order: 0,
          };
        });

        for (const serie of series) {
          await this.createSerie(userId, serie)
        }
      }
      console.log("series ok")
      return this.getSessionById(session.id)
    } catch (e) {
      console.log("error - createSession", e)
    }
  }

  formatSessionExerciseAndSeries(sessions) {
    const formattedSessions = sessions.map(session => {
      // Here we build an array of exercises present in the series
      const sessionExercises =
        session.series.map((serie) => {
          return { id: serie.exerciseId, name: serie.exercise.name, description: serie.exercise.description };
        })

      const uniqueExercises = sessionExercises.reduce((acc, curr) => {
        if (!acc.find(item => item.id === curr.id)) {
          acc.push(curr);
        }
        return acc;
      }, [])

      // console.log("formatSessionExerciseAndSeries 1 ", session.name, uniqueExercises)


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
          id: ex.id,
          name: ex.name,
          description: ex.description,
          series: seriesFromExercise
        }
      })

      // console.log("formatSessionExerciseAndSeries 2 ", session.name, exercisesToDisplay)


      return {
        id: session.id,
        name: session.name,
        isFinished: session.isFinished,
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
                  description: true
                }
              }
            }
          }
        }
      })

      console.log("many", allSessions[0])
      return allSessions?.length ? this.formatSessionExerciseAndSeries(allSessions) : []

    } catch (e) {
      console.log(e)
    }
  }


  async getSessionById(sessionId: number): Promise<Session> {
    console.log("sessionid req", sessionId)
    try {
      const session = await this.prisma.session.findUnique({
        where: {
          id: sessionId
        },
        include: {
          sport: {
            select: {
              name: true,
              exercises: true
            }
          },
          series: {
            include: {
              exercise: {
                select: {
                  name: true,
                  description: true
                }
              }
            }
          }
        }
      })

      console.log("get one session", session.sport)
      const completeSession = session ? this.formatSessionExerciseAndSeries([session])[0] : null

      return completeSession

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

  async createSerie(userId: number, data: CreateSerieDto): Promise<Session> {
    // const session = await this.getSessionById(data.sessionId);
    // const serie = { ...data };
    // serie.value = serie.value || 0
    console.log("createserie", userId)

    try {
      await this.prisma.serie.create({
        data: {
          value: data.value ?? 0,
          sessionId: data.sessionId,
          exerciseId: data.exerciseId,
          userId: userId
        }
      })
      return this.getSessionById(data.sessionId)
    } catch (e) {
      console.log(e)
    }
  }

  async updateSerie(data: UpdateSerieDto): Promise<Session> {
    try {
      const updatedSerie = await this.prisma.serie.update({
        where: {
          id: data.id
        },
        data: {
          value: data.value,
        }
      })
      const sess = this.getSessionById(updatedSerie.sessionId)

      return sess
    } catch (e) {
      console.log("------error", e)
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

  async getLastSeriesOfExercise(userId: number, exerciseId: number) {
    const lastSerie = await this.prisma.serie.findMany({
      where: {
        userId: userId,
        exerciseId: exerciseId,
        session: {
          isFinished: true
        }
      },
      // TODO reste à trier pour récupérer que la derniere session
      orderBy: { id: 'desc' },
      take: 1
    })

    console.log("last serie", lastSerie)

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
