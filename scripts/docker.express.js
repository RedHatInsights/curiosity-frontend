const path = require('path');
const express = require('express');

const app = express();
const port = 3000;

app.use('*/apps/subscriptions', express.static(path.resolve(__dirname, '..', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`listening at //localhost:${port}`);
});
