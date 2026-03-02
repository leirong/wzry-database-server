import { fromHono } from 'chanfana'
import { Env, Hono } from 'hono'
import { cors } from 'hono/cors'
import { HeroList } from './endpoints/heroList'
import { ItemList } from './endpoints/itemList'
import { SummonerList } from './endpoints/summonerList'
import { LeagueList } from './endpoints/leagueList'
import { HeroData } from './endpoints/heroData'
import { Health } from './endpoints/health'

// Start a Hono app
const app = new Hono<{ Bindings: Env }>()

// Add CORS middleware
app.use(cors())

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: '/',
})

// Register OpenAPI endpoints
openapi.get('/api/health', Health)
openapi.get('/api/heros', HeroList)
openapi.get('/api/items', ItemList)
openapi.get('/api/summoners', SummonerList)
openapi.get('/api/leagues', LeagueList)
openapi.get('/api/hero-data', HeroData)

// Export the Hono app
export default app
