import { OpenAPIRoute } from 'chanfana'
import { z } from 'zod'
import { AppContext } from '../types'

export class Health extends OpenAPIRoute {
  schema = {
    tags: ['健康检查'],
    summary: '检查服务',
    responses: {
      '200': {
        description: 'Returns health status',
        content: {
          'application/json': {
            schema: z.object({
              code: z.number(),
              data: z.string(),
            }),
          },
        },
      },
    },
  }

  async handle(c: AppContext) {
    return {
      code: 0,
      data: 'ok',
    }
  }
}
