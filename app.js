require('dotenv').config();
const express = require('express');
const app = express();

const { USERNAME, PASSWORD, SECRET_MESSAGE } = process.env;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/secret', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) {
    res.set('WWW-Authenticate', 'Basic realm="Restricted Area"');
    return res.status(401).send('Authentication required.');
  }

  const base64Credentials = auth.split(' ')[1];
  const [user, pass] = Buffer.from(base64Credentials, 'base64')
    .toString()
    .split(':');

  if (user === USERNAME && pass === PASSWORD) {
    return res.send(SECRET_MESSAGE);
  }

  return res.status(403).send('Access denied.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App running on port ${PORT}`));
