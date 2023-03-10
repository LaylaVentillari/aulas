import { prisma } from "./lib/prisma"
import { FastifyInstance } from "fastify"
import  {z} from 'zod'
import dayjs from 'dayjs'


export async function appRoutes(app: FastifyInstance){
  app.post('/habits', async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(
        z.number().min(0).max(6)
      )
    })
    // [0,1,2,3,4,5,6] => dom,seg,ter,qua,qui,sex,sab
    
    const { title, weekDays} = createHabitBody.parse(request.body)
    
    const today = dayjs().startOf('day').toDate()

    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map(weekDay => {
            return{
              week_day: weekDay,
            }
          })
        }
      }
    })
  
  })
}


