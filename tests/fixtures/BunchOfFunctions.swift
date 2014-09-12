func returningIntFunction(number: Int) -> Int {
    return number
}

func returningDoubleFunction(number: Double) -> Double {
    return number + 5
}

func applyZero (function: Int -> Int) -> Int {
    return function(0);
}

func returnEq (x: Int) -> Int {
    return x;
}
