/*=== RUNTIME START ===*/
function println() {
  console.log.apply(console, arguments);
}

function BINARY_OPERATOR_RANGE_INCLUSIVE (min, max) {
  var array = [];
  for (var i = min;i <= max;i++)
    array.push(i);
  return array;
}

function BINARY_OPERATOR_RANGE_EXCLUSIVE (min, max) {
  var array = [];
  for (var i = min;i < max;i++)
    array.push(i);
  return array;
}
/*=== RUNTIME END ===*/