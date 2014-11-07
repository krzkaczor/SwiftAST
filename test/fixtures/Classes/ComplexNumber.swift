class ComplexNumber {
    var real: Double = 0;
    var imaginary: Double = 0;

    init (real: Double, imaginary: Double) {
        self.real = real;
        self.imaginary = imaginary;
    }
}

var imaginaryUnit = ComplexNumber(real:0, imaginary:1);
