Math.ceiling = function CEILING(number, significance, mode) {
  if (significance === 0) return 0;
  var significance = (typeof significance === 'undefined') ? 1 : Math.abs(significance);
  var mode = (typeof mode === 'undefined') ? 0 : mode;
  var precision = -Math.floor(Math.log(significance) / Math.log(10));
  if (number >= 0) {
    return ROUND(Math.ceil(number / significance) * significance, precision);
  } else {
    if (mode === 0) {
      return -ROUND(Math.floor(Math.abs(number) / significance) * significance, precision);
    } else {
      return -ROUND(Math.ceil(Math.abs(number) / significance) * significance, precision);
    }
  }
}

function ROUND(number, digits) {
  return Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
}