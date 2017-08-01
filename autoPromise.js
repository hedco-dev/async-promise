'use strict';
module.exports = (properties) => {
  let methods = {};

  for(let propertyName in properties) {
    let property = properties[propertyName];

    if(property && property.then && property.catch) { // isPromise
      methods[propertyName] = (cb) => {
        property.then((result) => cb(null, result)).catch(cb);
      };
    } else if (_.isArray(property)) {
      let lastItemIndex     = property.length - 1;
      let lastItem          = property[lastItemIndex];
      methods[propertyName] = [];

      for(let i = 0; i < lastItemIndex; i++) {
        methods[propertyName].push(property[i]);
      }

      methods[propertyName].push((results, cb) => {
        try {
          let lastItemResult = lastItem(results);

          if(lastItemResult && lastItemResult.then && lastItemResult.catch) { // isPromise
            lastItemResult.then((result) => cb(null, result)).catch(cb);
          } else {
            lastItemResult(cb);
          }
        } catch(err) {
          cb(err);
        }
      });
    } else {
      methods[propertyName] = property;
    }
  }

  return new Promise((resolve, reject) => {
    async.auto(methods, (err, results) => {
      if(err) return reject(err);

      resolve(results);
    });
  });
};
