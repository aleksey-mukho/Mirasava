// @flow
const mongoose = require('mongoose');

// import { ENV, MONGO_DB } from '../../config/constants';
const logger = require('../utils/logger');

const mongoUrl = 'mongodb://admin:admin@localhost:27017/admin';

mongoose.connect(mongoUrl);

mongoose.connection.on('connected', () => {
  logger.info('Mongoose default connection open');
});

mongoose.connection.on('error', (err) => {
  logger.error(`Mongoose default connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose default connection disconnected');
});


// const { Observable } = require('rxjs');
// const MongoClient = require('mongodb').MongoClient;


// const url = 'mongodb://localhost:27017';
// // Database Name
// const dbName = 'admin';

// const b = Observable.fromPromise(MongoClient.connect(url))
//   .mergeMap(client => (
//     Observable.fromPromise(
//       client.db(dbName).admin().listDatabases(),
//     )
//       .map((dbs) => {
//         console.log({ dbs });
//         return client.close();
//       })
//   ))
//   .catch(console.error);

// const mongoClient$ = Observable.fromPromise(MongoClient.connect(url))
// .do(client => (
//   client.db(dbName).admin()
// ))
// .catch(logger.error);

// const mongoConnect = Observable.fromPromise(
//   MongoClient.connect(url)
//     .then(client => client.db(dbName).admin()),
// )
//   .catch(console.error);

// module.exports = mongoClient$;
