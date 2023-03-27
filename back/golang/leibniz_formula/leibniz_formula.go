package main

import (
	"fmt"
	"math"
)

func main() {
	fmt.Print("pi=", leibniz_formula(), "\n")
}

func leibniz_formula() float64 {
	var s = 0.0
	for i := 0; i < int(math.Pow(10, 8)); i++ {
		s += math.Pow(-1, float64(i)) / float64((i*2)+1)
	}
	return s * 4
}
