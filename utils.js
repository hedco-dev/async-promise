const createEachPromise = eachFunction => {
  return (collection, itemCallback) => {
    return new Promise((resolve, reject) => {
      const results = [];

      eachFunction(collection, (item, done) => {
        try {
          const callbackResult = itemCallback(item);
          if (!callbackResult) {
            throw new Error('itemCallback should return a Promise.');
          }

          callbackResult.then(result => {
            results.push(result);
            done(null);
          }).catch(done);
        } catch (err) {
          done(err);
        }
      }, err => {
        if (err) return reject(err);

        resolve(results);
      });
    });
  };
};

module.exports = {
  createEachPromise
};
