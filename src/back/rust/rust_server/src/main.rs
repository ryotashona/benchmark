use std::{fs::File, io::Read, process::Command};

use axum::{extract::Query, routing::get, Json, Router};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;

#[derive(Deserialize, Serialize)]
struct ApiReq {
    kind: String,
}

#[derive(Deserialize, Serialize)]
struct ApiRes {
    res: String,
}

async fn api(query: Query<ApiReq>) -> Json<ApiRes> {
    let kind = query.kind.clone();

    let result = do_bench(&kind);
    Json(ApiRes { res: result })
}

#[tokio::main]
async fn main() {
    // build our application with a single route
    let app = Router::new().route("/rust/", get(api));
    let addr = SocketAddr::from(([0, 0, 0, 0], 9001));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

fn do_bench(kind: &str) -> String {
    let sh_path: &str = match kind {
        "pi" => "/opt/leibniz_formula/leibniz_formula.sh",
        "io" => return "未対応機能".to_string(),
        _ => return "未対応機能".to_string(),
    };

    Command::new("sh")
        .arg(sh_path)
        .output()
        .expect("failed to execute process");

    let filename = "/var/tmp/times.txt";
    let mut f = File::open(filename).expect("file not found");
    let mut contents = String::new();
    f.read_to_string(&mut contents)
        .expect("something went wrong reading the file");
    contents
}
