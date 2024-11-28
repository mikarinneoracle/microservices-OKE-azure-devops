const express = require('express');

const app = express();
const port = 8080;

app.use("/app", express.static('public'));

app.listen(port, () => {
  init();
  console.log(`Node app listening on port ${port}`);
});

