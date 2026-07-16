# 王者荣耀英雄资料库数据

## 项目介绍

王者荣耀英雄资料库数据源。数据由 GitHub Actions 每天定时抓取腾讯上游接口,生成静态 JSON 并托管在 GitHub Pages,前端可直接请求(同源/带 CORS 头,无跨域问题),无需服务器。

本地调试仍可用 `express` 起服务(`yarn start`,见 `server.js`)。

## 静态数据接口(GitHub Pages)

基础地址:`https://leirong.github.io/wzry-database-server/data`

- [查询英雄](https://leirong.github.io/wzry-database-server/data/heros.json)
- [查询局内道具](https://leirong.github.io/wzry-database-server/data/items.json)
- [查询召唤师技能](https://leirong.github.io/wzry-database-server/data/summoners.json)
- [查询赛季列表](https://leirong.github.io/wzry-database-server/data/leagues.json)
- 查询英雄数据排行:`https://leirong.github.io/wzry-database-server/data/hero-data/{league_id}.json`(如 [20240001](https://leirong.github.io/wzry-database-server/data/hero-data/20240001.json))

所有响应保持 `{ "code": 0, "data": ... }` 结构。

## 数据更新

- 抓取脚本:`scripts/fetch-data.js`(可本地 `node scripts/fetch-data.js` 手动跑一次)。
- 定时任务:`.github/workflows/update-data.yml`,每天自动抓取并提交变更,也可在 Actions 页面手动触发。

## 启用 GitHub Pages

Settings → Pages → Source 选 `Deploy from a branch`,分支 `main`、目录 `/ (root)`。
