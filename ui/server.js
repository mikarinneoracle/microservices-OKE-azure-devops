const express = require('express');

const app = express();
const port = 8000;

app.use("/app", express.static('public'));

app.listen(port, () => {
  console.log(`Node ui listening on port ${port}`);
});

