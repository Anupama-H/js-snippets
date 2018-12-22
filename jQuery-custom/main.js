let $ = function (selector) {
  /* queue to track current active delays */
  let delayQueue = [];
  /* map to hold all delayed methods to be called after delay */
  let delayMethodsMap = {};
  
  /* unique key generation code */
  let counter = 100;
  let getUniqueID = function() {
    return counter++;
  }
  
  let getActiveDelay = function () {
    let length = delayQueue.length;
    /* last item in delay queue is the active delay */
    return length ? delayQueue[length - 1] : null;
  };
  
  let executeFunction = function (fn, parameters = []) {
    let delayObj = getActiveDelay();
    
    if (fn === delay) {
    	/* track the new delay in the delay queue */
    	let key = getUniqueID();
    
	    delayQueue.push({
	      key: key,
	      delay: parameters[0]
	    });

	    parameters = [...parameters, key];
    }

    if (delayObj) {
      let key = delayObj.key;
      
      if (!delayMethodsMap[key]) {
        delayMethodsMap[key] = [];
      }
    
      /* push the method to be called after delay */
      delayMethodsMap[key].push({
        method: fn,
        arguments: parameters
      });
    } else {
    	/* no active delay, call immediately */
        fn.apply(this, parameters);
    }

    return this;
  }
  
  let addClass = function(classNames) {
      let elements = document.querySelectorAll(selector);
      [...elements].forEach(function (el) {
          el.classList.add(...classNames.split(" "));
      });
    return this;
  };
  
  let delay = function(ms, key) {
    let _this = this;
    
    setTimeout(function() {
      /* call any delayed methods */
      let delayedMethods = delayMethodsMap[key];
      if(delayedMethods && delayedMethods.length) {
          delayedMethods.forEach(function(obj) {
              obj.method.apply(_this, obj.arguments);
          });
        
          /* clear the methods map */
          delete delayMethodsMap[key];
        
          /* remove delay from the queue */
          delayQueue = delayQueue.filter(function(obj) {
            return obj.key !== key;
          });
      }
    }, ms);
    
    return this;
  };
  
  return {
    addClass: function () {
    	return executeFunction.call(this, addClass, arguments)
    },
    delay: function () {
    	return executeFunction.call(this, delay, arguments)
    }
  };
}

$('.foo').addClass('green-border').delay(5000).addClass("red-border");
// $('.foo').delay(5000).addClass('green-border').delay(2000).addClass("red-border");
// $('.foo').addClass('bar');