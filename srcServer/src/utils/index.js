// @flow
const { List } = require('immutable');
const CustomError = require('../app/error/CustomError');

module.exports = {
  promisify: (callbackBasedApi: () => {}): (arg1: mixed, arg2?: mixed) => Promise<*> => (
    (...arg): Promise<Array<{}>> => {
      const args = [].slice.call(arg);
      return new Promise((resolve, reject) => {
        args.push((err, result: Array<{}>): void => {
          if (err) {
            return reject(err);
          }
          if (args.length <= 2) {
            return resolve(result);
          }

          return resolve([].slice.call(arg));
        });

        callbackBasedApi(...args);
      });
    }
  ),

  generateString(length: number = 8): string {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
    const emptyList = List().setSize(length);
    return emptyList.reduce((accumulator): string => (
      accumulator + chars[Math.round(Math.random() * (chars.length - 1))]
    ), '');
  },

  getRandomNumber(coefficient: number): number {
    return Math.floor(Math.random() * coefficient);
  },

  // pack(obj: {}) {
  //   try {
  //     return JSON.stringify(obj);
  //   } catch (err) {
  //     throw CustomError(`Error stringify object, ${err}`);
  //   }
  // },

  // unpack(str: string) {
  //   try {
  //     return JSON.parse(str);
  //   } catch (err) {
  //     throw CustomError(`Error parse object, ${err}`);
  //   }
  // },
};
