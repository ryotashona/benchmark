package main

import "fmt"

func main() {
	fmt.Print("fib=", fibonacci(40), "\n")
}

func fibonacci(n int32) int32 {
	if n < 2 {
		return 1
	} else {
		return fibonacci(n-2) + fibonacci(n-1)
	}
}
