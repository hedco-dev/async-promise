'use strict';

let createEachPromise = (eachFunction) => (collection, itemCallback) => {
  return new Promise((resolve, reject) => {
    eachFunction(collection, (item, done) => {
      try {
        let callbackResult = itemCallback(item);
        if(!callbackResult) {
          throw new Error('itemCallback should return a Promise.');
        }

        callbackResult.then((result) => {
          done(null, result);
        }).catch(done);
      }
      catch(err) {
        done(err);
      }
    }, (err, results) => {
      if(err) return reject(err);

      resolve(results);
    });
  });
};

module.exports = {
  createEachPromise
}
