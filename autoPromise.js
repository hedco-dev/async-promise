const async = require('async');
const _ = require('lodash');

module.exports = (properties) => {
  const methods = {};

  for (const propertyName in properties) {
    const property = properties[propertyName];

    if (property && property.then && property.catch) { // isPromise
      methods[propertyName] = (cb) => {
        property.then(result => {
          cb(null, result);
        }).catch(cb);
      };
    } else if (_.isArray(property)) {
      const lastItemIndex = property.length - 1;
      const lastItem = property[lastItemIndex];
      methods[propertyName] = [];

      for (let i = 0; i < lastItemIndex; i++) {
        methods[propertyName].push(property[i]);
      }

      methods[propertyName].push((results, cb) => {
        try {
          const lastItemResult = lastItem(results);

          if (lastItemResult) {
            if (lastItemResult.then && lastItemResult.catch) {
              lastItemResult.then(result => {
                cb(null, result);
              }).catch(cb);
            } else {
              cb(null, lastItemResult);
            }
          } else {
            cb();
          }
        } catch (err) {
          cb(err);
        }
      });
    } else {
      methods[propertyName] = cb => {
        property().then(result => {
          cb(null, result);
        }).catch(cb);
      };
    }
  }

  return new Promise((resolve, reject) => {
    async.auto(methods, (err, results) => {
      if (err) return reject(err);

      resolve(results);
    });
  });
};

//sample code
// async.autoPromise({
//   a: (cb) => {
//     cb(null, 2);
//   },
//   b: Promise.resolve(3),
//   c: ['a', 'b', (results) => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         resolve(results.a + results.b);
//       });
//     });
//   }]
// }).then((results) => {
//   console.log(results);
// }).catch((err) => {
//   console.log('err', err);
// });
