var used = [];
var rand = function() {
  var min = 49152;
  var max = 65535;
  var number = Math.floor(Math.random()*(max-min+1)+min);
  if (number in used) {
    return rand();
  }
  used.push(number);
  return number;
};

module.exports = {
  www: rand(),
  admin: rand(),
  couch: rand()
};
