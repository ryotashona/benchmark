import React, {useState, useCallback, FC} from 'react';
import './App.css';


function doBenche(kind:string, lang:string, callback:React.Dispatch<React.SetStateAction<string>>) {
    var url = "";
    if (lang == "php") {
        url += "/php/index.php?";
        if (kind == "pi") {
            url += "kind=pi";
        } else {
            url += "kind=io";
        }
    } else if (lang == "go") {
        callback("未対応機能");
        return;
    } else if (lang == "rust") {
        url += "/rust/?";
        if (kind == "pi") {
            url += "kind=pi";
        } else {
            callback("未対応機能");
            return;
        }
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
    const texts = result.split(/(\n)/).map((item, index) => {
      return (
        <React.Fragment key={index}>
          { item.match(/\n/) ? <br /> : item }
        </React.Fragment>
      );
    });
    return <p>{texts}</p>;
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
            button_str = 'PHP8-JIT';
            break;
        case "go":
            button_str = 'golung';
            break;
        case "rust":
            button_str = 'rust';
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
            <h1>π級数</h1>
            <h4>[(-1)^n / (2n+1)]をn=0～10^8まで累計して X 4</h4>
            <div className="Bench">
                <Func kind="pi" lang="php" />
                <Func kind="pi" lang="rust" />
                <Func kind="pi" lang="go" />
            </div>
            <h1>I/O</h1>
            <div className="Bench">
                <Func kind="io" lang="php" />
                <Func kind="io" lang="rust" />
                <Func kind="io" lang="go" />
            </div>
        </div>
    )
}
 
export default App
