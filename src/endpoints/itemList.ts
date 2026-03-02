import { OpenAPIRoute } from 'chanfana'
import { z } from 'zod'
import { AppContext } from '../types'

export class ItemList extends OpenAPIRoute {
  schema = {
    tags: ['查询装备列表'],
    summary: '查询装备列表',
    responses: {
      '200': {
        description: '返回装备列表',
        content: {
          'application/json': {
            schema: z.object({
              code: z.number(),
              data: z.array(z.any()),
            }),
          },
        },
      },
    },
  }

  async handle(c: AppContext) {
    try {
      const response = await fetch('https://pvp.qq.com/web201605/js/item.json')
      const data = await response.json()
      return {
        code: 0,
        data: data,
      }
    } catch (error) {
      return c.json(
        {
          code: 500,
          errorMessage: '局内装备查询失败',
        },
        500,
      )
    }
  }
}
