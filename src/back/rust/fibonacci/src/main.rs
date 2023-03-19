fn main() {
    println!("fib={}", fibonacci(44));
}

fn fibonacci(n: i32) -> i32 {
    if n < 2 {
        return 1;
    } else {
        return fibonacci(n - 2) + fibonacci(n - 1);
    }
}
