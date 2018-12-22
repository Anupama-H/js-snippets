/* Ref :
http://2ality.com/2011/12/fake-operator-overloading.html
https://github.com/rauschma/op_overload 
*/

function Point(x, y) {
  this.x = x;
  this.y = y;
  Point.operands = [];
};

Point.prototype.valueOf = function() {
  /* smallest number for which + , - , * , / operations give different values */
  Point.operands.push(this);
  return 3;
}

Object.defineProperty(Point.prototype, "value", {
  set: function(value) {
    var l = Point.operands[0];
    var r = Point.operands[1];
    switch(value) {
      case 6: 
        /* 3 + 3 = addition */
        this.x = l.x + r.x;
        this.y = l.y + r.y;
        return this;
      case 0: 
        /* 3 - 3 = subtraction */
        this.x = l.x - r.x;
        this.y = l.y - r.y;
        return this;
      case 9: 
        /* 3 * 3 = multiplication */
        this.x = l.x * r.x;
        this.y = l.y * r.y;
        return this;
      case 1: 
        /* 3 / 3 = division */
        this.x = l.x / r.x;
        this.y = l.y / r.y;
        return this;
    }
  },
  get: function() {
    return this.toString();
  }
});

Point.prototype.toString = function() {
  return "Point(" + this.x + ", " + this.y + ")";
}

var p1 = new Point(4, 12);
var p2 = new Point(2, 4);

var addResult = new Point();
addResult.value = p1 + p2;
console.log("Addition : " + addResult.value);

var subResult = new Point();
subResult.value = p1 - p2;
console.log("Subtraction : " + subResult.value);

var mulResult = new Point();
mulResult.value = p1 * p2;
console.log("Multiplication : " + mulResult.value);

var divideResult = new Point();
divideResult.value = p1 / p2;
console.log("Division : " + divideResult.value);
