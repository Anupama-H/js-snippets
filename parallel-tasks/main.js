/*

Implement the following function:
`parallel(tasks, callbackopt)`

It should do the following:
>  Run the tasks collection of functions in parallel, without waiting until the previous function has completed.
> If any of the functions pass an error to its callback, the main callback is immediately called with the value of the error. Once the tasks have completed, the results are passed to the final callback as an array.

> Parameters:
>`tasks { Array | Iterable }`
> -  A collection containing functions to run. Each function is passed a callback(err, result) which it must call on  completion with an error err (which can be null) and an optional result value.
>`callback { function <optional> }`     An optional callback to run once all the functions have completed  successfully. This function gets a results array (or object) containing all the result arguments passed to the task callbacks.
>  Invoked with (err, results).
>
> Returns: undefined

Additional constraint: You *cannot* use Promises

*/

/*
var parallel = function(tasks, callback) {
    var results = [], errors = [];
    var cbCount = 0, hasError = false, i;
  
    var tasksCallback = function (index, error, result) {
        ++cbCount;
        if (error) {
          callback(error, []);
          hasError = true;
          return;
        }
      
        if (!hasError) {
          results[index] = result;

          if (cbCount === tasks.length) {
            // all tasks are executed 
            callback(null, results);
          }
        }
    }

    for (i = 0; i < tasks.length; i++) {
        tasks[i](tasksCallback.bind(null, i));
    }
};
*/

/*

// With closures 

let parallel = (tasks, callback) => {
    let results = [], errors = [];
    let cbCount = 0;

    for (let i = 0; i < tasks.length; i++) {
        tasks[i]((error, result) => {
            ++cbCount;
            if (error) {
                errors[i] = error;
            } else {
                results[i] = result;
            }

            if (cbCount === tasks.length) {
                // all tasks are executed
                callback(errors, results);
            }
        });
    }
};
*/



// With Promises
let parallel = (tasks, callback) => {
  let promisesArray = [];
  let resultsArray = [];
  
  let tasksCallback = ({index, resolve, reject}, error, result) => {
      if (error) {
        reject(error);
        return;
      }
  
      resultsArray[index] = result;
      resolve();
  }
  
  tasks.forEach((fn, index) => {
    promisesArray.push(new Promise((resolve, reject) => {
      fn(tasksCallback.bind(null, {index, resolve, reject}))
    }));
  });
  
  Promise.all(promisesArray)
    .then(() => {
        callback(null, resultsArray)
    })
    .catch((error) => {
        callback(error, []);
    });
};

parallel([
    function(callback) {
        setTimeout(function() {
            callback(null, 'one');
        }, 200);
    },
    /*function(callback) {
        setTimeout(function() {
            callback('ERROR');
        }, 150);
    },*/
    function(callback) {
        setTimeout(function() {
            callback(null, 'two');
        }, 100);
    }
],
// optional callback
function callback(err, results) {
    console.log('err', err);
    console.log('results', results);
    // the results array will equal ['one','two'] even though
    // the second function had a shorter timeout.
});