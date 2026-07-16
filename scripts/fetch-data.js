const fs = require('fs')
const path = require('path')
const axios = require('axios')

// 上游接口地址,与 server.js 保持一致
const API = {
  heros: 'https://pvp.qq.com/web201605/js/herolist.json',
  items: 'https://pvp.qq.com/web201605/js/item.json',
  summoners: 'https://pvp.qq.com/web201605/js/summoner.json',
  leagues: 'https://prod.comp.smoba.qq.com/leaguesite/leagues/open',
  heroData: (leagueId) =>
    `https://prod.comp.smoba.qq.com/leaguesite/league/hero/settle_list/open?league_id=${leagueId}`,
}

const DATA_DIR = path.join(__dirname, '..', 'data')
const HERO_DATA_DIR = path.join(DATA_DIR, 'hero-data')

// 保持与现有服务端一致的 { code: 0, data } 包装,前端逻辑无需改动
const writeJson = (filePath, data) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify({ code: 0, data }, null, 2))
  console.log(`✓ 写入 ${path.relative(path.join(__dirname, '..'), filePath)}`)
}

const request = (url) => axios.get(url, { timeout: 30000 }).then((res) => res.data)

// 抓取单个简单接口,失败时保留旧文件,不中断整体任务
const fetchSimple = async (name, url, transform = (d) => d) => {
  try {
    const raw = await request(url)
    writeJson(path.join(DATA_DIR, `${name}.json`), transform(raw))
    return true
  } catch (error) {
    console.warn(`✗ ${name} 抓取失败,保留旧文件: ${error.message}`)
    return false
  }
}

async function main() {
  fs.mkdirSync(HERO_DATA_DIR, { recursive: true })

  // 1. 并行抓取 heros / items / summoners
  await Promise.all([
    fetchSimple('heros', API.heros),
    fetchSimple('items', API.items),
    fetchSimple('summoners', API.summoners),
  ])

  // 2. 抓取赛季列表(与 server.js 一致:results 逆序)
  let leagues = []
  try {
    const raw = await request(API.leagues)
    leagues = (raw.results || []).slice().reverse()
    writeJson(path.join(DATA_DIR, 'leagues.json'), leagues)
  } catch (error) {
    console.warn(`✗ leagues 抓取失败,跳过 hero-data: ${error.message}`)
    return
  }

  // 3. 遍历全部赛季,逐个抓取 hero-data(单个失败仅告警,保留旧文件)
  let ok = 0
  for (const league of leagues) {
    const id = league.league_id
    if (!id) continue
    try {
      const raw = await request(API.heroData(id))
      writeJson(path.join(HERO_DATA_DIR, `${id}.json`), raw.data)
      ok += 1
    } catch (error) {
      console.warn(`✗ hero-data ${id} 抓取失败,保留旧文件: ${error.message}`)
    }
  }
  console.log(`hero-data 完成:${ok}/${leagues.length}`)
}

main().catch((error) => {
  console.error('抓取任务异常退出:', error)
  process.exit(1)
})
