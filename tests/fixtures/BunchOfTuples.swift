let intAndDouble = (10, 10.5);

let (intConst, doubleConst) = intAndDouble;

let ((a, b), c) = (intAndDouble, 11);

let intAndInt: (Int, Int) = (4,5);
let doubleAndDouble: (Double, Double) = (5, 5);

let singleTuple = (6.6);

let singleTupleExplicitTyped: (Double) = (6.6);

let intConst:Int = intAndDouble.0;
let doubleConst:Double = intAndDouble.1;