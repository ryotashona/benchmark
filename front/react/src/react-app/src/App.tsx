import React, {useState, useCallback, FC} from 'react';
import './App.css';
import loading_img from './loading.gif';


function doBenche(kind:string, lang:string, callback:React.Dispatch<React.SetStateAction<string>>) {
    var url = "";
    if (lang == "php") {
        url += "/php/index.php?kind=" + kind;
    } else if (lang == "go") {
        url += "/golang/?kind=" + kind;
    } else if (lang == "rust") {
        url += "/rust/?kind=" + kind;
    }
    fetch(url)
    .then(
        res => {
            console.log(res);
            return res.json();
        }
    ).then(
        data => {
            console.log(data);
            callback(data.res);
        }
    );
    return;
} 

const BenchResult = ({ result }: {result:string}) => {
    if (result == "計測中・・・") {
        return (
            <>
            <p></p>
            <img src={loading_img}></img>
            </>
        )
    }
    const texts = result.split(/(\n)/).map((item, index) => {
      return (
        <React.Fragment key={index}>
          { item.match(/\n/) ? <br /> : item }
        </React.Fragment>
      );
    });
    return (
        <>
        <p>{texts}</p>
        </>
    );
  }

const Func = ( {kind,lang}:{kind:string,lang:string} )  => {
    const [result, setResult] = useState("未計測")

    const onClickButton = () => {
        setResult("計測中・・・");
        doBenche(kind,lang,setResult);
    }


    var button_str = "";
    switch (lang) {
        case "php":
            button_str = 'PHP8-JIT Start';
            break;
        case "go":
            button_str = 'golang Start';
            break;
        case "rust":
            button_str = 'rust Start';
            break;
    }
    return (
        <div>
            <button onClick={onClickButton}>{button_str}</button>
            <BenchResult result={result}/>
        </div>

    );
};

const App: React.FC = () => {
    return (
        <div className="App">
            <div className="BenchDiv">
                <div className='BenchDec'>
                    <h1>ライプニッツ級数(単純ループ計算処理)</h1>
                    <h2>
                        <pre>
                            {"[(-1)^n / (2n+1)]"}<br/>
                            {"↑をn=0～100000000まで累計して X 4"}<br/>
                        </pre>
                    </h2>
                </div>
                <div className="Bench">
                    <Func kind="pi" lang="php" />
                    <Func kind="pi" lang="rust" />
                    <Func kind="pi" lang="go" />
                </div>
            </div>
            <div className="BenchDiv">
                <div className='BenchDec'>
                    <h1>フィボナッチ数列(再帰呼び出し)</h1>
                    <h2>
                        <pre>
                            {"function getFib(int $n): int {"}<br/>
                            {"    return $n < 2 ? $n : getFib($n - 1) + getFib($n - 2);"}<br/>
                            {"}"}<br/>
                            {"getFib(40);"}<br/>
                        </pre>
                    </h2>
                </div>
                <div className="Bench">
                    <Func kind="fib" lang="php" />
                    <Func kind="fib" lang="rust" />
                    <Func kind="fib" lang="go" />
                </div>
            </div>
            <div className="BenchDiv">
                <div className='BenchDec'>
                    <h1>I/O処理</h1>
                    <h2>
                        <pre>
                            {"input_file: 1レコード:int型:5カラム 200レコードのcsv"}<br/><br/>
                            {"上記CSVをDB(mysql)にinsert (トランザクション制御なし)"}<br/>
                            {"insertしたデータをcsvに書き出し"}<br/>
                            {"書き出したcsvとインプットファイルのレコード比較"}<br/>
                            {"以上を5回繰り返す"}<br/>
                        </pre>
                        <p>※rustおよびgolangはi/o制御を非同期で実装しているため、このベンチ(1スレッド限定条件)では非同期オーバーヘッドの影響が出ています。</p>                        
                        <p>rustは同期実装も可能なので、将来的にはそちらでも比較してみたいが、phpと速度結果は大きく変わらないはず。</p>
                    </h2>
                </div>
                <div className="Bench">
                    <Func kind="io" lang="php" />
                    <Func kind="io" lang="rust" />
                    <Func kind="io" lang="go" />
                </div>
            </div>
        </div>
    )
}
 
export default App
