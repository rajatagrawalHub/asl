const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const rawData = fs.readFileSync('./data.json');
const awardData = JSON.parse(rawData);

app.get('/api/search/reg', (req, res) => {
    const query = req.query.q ? req.query.q.trim().toLowerCase().replace(/\s+/g, '') : null;
    console.log(query)
    if (!query) {
      return res.status(400).json({ message: 'Query parameter "q" is required' });
    }

    const matched = awardData.filter(item =>
      item["REG NO"] && item["REG NO"].toLowerCase().replace(/\s+/g, '') === query
    );

    return matched.length > 0
      ? res.json(matched)
      : res.status(404).json({ message: 'Not found' });
});

app.get('/api/search/name', (req, res) => {
  const query = req.query.q ? req.query.q.trim().toLowerCase() : null;
  console.log(query)
  if (!query) {
    return res.status(400).json({ message: 'Query parameter "q" is required' });
  }

  const results = awardData.filter(item =>
    item["NAME"] && item["NAME"].toLowerCase().includes(query)
  );

  return results.length > 0 ? res.json(results) : res.status(404).json({ message: 'No matches' });
});

app.use(express.static(path.join(__dirname, 'build')));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
