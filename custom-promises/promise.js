/* 
  Implement promise as per specification : https://promisesaplus.com/ 

  Ref : https://www.promisejs.org/implementing/
*/

var CustomPromise = function(promiseFn) {
    this.state = "PENDING";
    var succesCbs = [];
    var errorCbs = [];

    var resolveCallback = function (data) {
        this.state = "FULFILLED";
        if (succesCbs.length) {
            succesCbs.forEach(function (cb) {
                cb(data);
            });
        }
    };
    
    var rejectCallback = function (data) {
        this.state = "REJECTED";
        if (errorCbs.length) {
            errorCbs.forEach(function (cb) {
                cb(data);
            });
        }
    };
    
    try {
        promiseFn(resolveCallback, rejectCallback);
    } catch (err) {
        /* If an error is thrown in the executor function, the promise is rejected */
        rejectCallback(err);
    }

    this.then = function (successFn, errorFn) {
        if (successFn) {
            succesCbs.push(successFn);
        }
      
        if (errorFn) {
            errorCbs.push(errorFn);
        }

        return this;
    };
    
    this.catch = function (errorFn) {
        if (errorFn) {
            errorCbs.push(errorFn);
        }
        return this;
    };
};
  
console.log("Creating Promise");
var promise = new CustomPromise(function(resolve, reject) {
    setTimeout(function() {
        resolve("Hello World");
    }, 500);
    // setTimeout(function() {
    //   reject("Some random error!!!");
    // }, 500);
});

promise
    .then(function(data) {
        console.log("Got data 1st then ", data);
    }, function(error) {
            console.log("Got error in then ", error);
    })
    .then(function(data) {
            console.log("Got data 2nd then ", data);
    })
    .then(function(data) {
            console.log("Got data 3rd then ", data);
    })
    .catch(function(error) {
            console.log("Got error catch ", error);
    });

console.log("After Promise");