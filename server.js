const express = require('express');
const { getAppData } = require('./scrapper');
const app = express();
const port = 3001;

app.use(express.json()); // For parsing JSON request bodies

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.post('/scrap', async (req, res) => {
  try {
    const url = req.body.appUrl
    const scrapedData = await getAppData(url);
    res.json(scrapedData);
  } catch (e) {
    res.status(400).send({ message: 'No app url' })
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});