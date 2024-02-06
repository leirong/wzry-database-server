const express = require('express')
const axios = require('axios');
const cors = require('cors');

// set up express web server
const app = express()
app.use(cors())

// set up static content
app.use(express.static('public'))

const handleRequestError = (response, code, errorMessage) => {
  response.status(code).json({
    code,
    errorMessage
  });
};

app.get('/heros', async (_request, response) => {
  try {
    const res = await axios.get('https://pvp.qq.com/web201605/js/herolist.json');
    response.json({
      code: 0,
      data: res.data
    });
  } catch (error) {
    handleRequestError(response, 500, '英雄查询失败');
  }
});

app.get('/items', async (_request, response) => {
  try {
    const res = await axios.get('https://pvp.qq.com/web201605/js/item.json');
    response.json({
      code: 0,
      data: res.data
    });
  } catch (error) {
    handleRequestError(response, 500, '局内道具查询失败');
  }
});

app.get('/summoners', async (_request, response) => {
  try {
    const res = await axios.get('https://pvp.qq.com/web201605/js/summoner1.json');
    response.json({
      code: 0,
      data: res.data
    });
  } catch (error) {
    handleRequestError(response, 500, '召唤师技能查询失败');
  }
});

// Start web server on port 3001
app.listen(3001, () => {
  console.log(`Server is listening at http://localhost:3001`);
})
