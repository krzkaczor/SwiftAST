let intAndDouble = (10, 10.5);

let (intConst, doubleConst) = intAndDouble;

let ((a, b), c) = (intAndDouble, 11);

let intAndInt: (Int, Int) = (4,5);
let doubleAndDouble: (Double, Double) = (5, 5);

let singleTuple = (6.6);

let singleTupleExplicitTyped: (Double) = (6.6);

let namedTuple: (x:Int, y:Double) = (5, 19);

let intConst2:Int = namedTuple.0;
let doubleConst2:Double = namedTuple.1;
let x:Int = namedTuple.x;
let y:Double = namedTuple.y;