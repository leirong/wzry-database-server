import { OpenAPIRoute, Str } from 'chanfana'
import { z } from 'zod'
import { AppContext } from '../types'

export class HeroData extends OpenAPIRoute {
  schema = {
    tags: ['根据联赛ID查询英雄出场率数据'],
    summary: '根据联赛ID查询英雄出场率数据',
    request: {
      query: z.object({
        league_id: Str({
          description: '联赛ID',
          required: true,
        }),
      }),
    },
    responses: {
      '200': {
        description: '返回根据联赛ID查询英雄出场率数据',
        content: {
          'application/json': {
            schema: z.object({
              code: z.number(),
              data: z.any(),
            }),
          },
        },
      },
    },
  }

  async handle(c: AppContext) {
    try {
      const data = await this.getValidatedData<typeof this.schema>()
      const { league_id } = data.query

      const response = await fetch(
        `https://prod.comp.smoba.qq.com/leaguesite/league/hero/settle_list/open?league_id=${league_id}`,
      )
      const resData: any = await response.json()
      return {
        code: 0,
        data: resData.data,
      }
    } catch (error) {
      return c.json(
        {
          code: 500,
          errorMessage: '英雄数据查询失败',
        },
        500,
      )
    }
  }
}
