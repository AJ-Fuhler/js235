function waterfallOverCallbacks(callbacks, initialValue) {
  return callbacks.reduce((newValue, callback) => callback(newValue), initialValue);
}

const double = (x) => x * 2;
console.log(waterfallOverCallbacks([double, double, double], 1));