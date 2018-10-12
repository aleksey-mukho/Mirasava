// @flow
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const routes = require('../config/routes');
const errorHandler = require('./middleware/errorHandler');

const app: express$Application = express();
app.use('*', (req: $Request, res: express$Response, next: express$NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(bodyParser.raw({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(compression({
  threshold: 512,
}));

app.use(cors());

routes(app);
// $FlowFixMe
app.use('*', errorHandler());

module.exports = app;
