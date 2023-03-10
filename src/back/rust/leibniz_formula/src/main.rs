fn main() {
    println!("pai={}", leibniz_formula());
}

fn leibniz_formula() -> f64 {
    let mut s = 0.0;
    (0..10_u32.pow(8)).for_each(|i| s += (-1_i32).pow(i) as f64 / ((i * 2) + 1) as f64);

    // for i in 0..10_u32.pow(8) {
    //     s += (-1_i32).pow(i) as f64 / ((i * 2) + 1) as f64;
    // }

    s * 4.0
}
