import React, {useState, useCallback, FC} from 'react';
import './App.css';


function doBenche(kind:string, lang:string) {
    var url = "";
    var result = "none"
    if (lang == "php") {
        url += "back";
        if (kind == "pai") {
            result = "hoge\npiyo\nhuga";
        } else {

        }
        result = "hoge\npiyo\nfuga"
    } else if (lang == "go") {

    } else if (lang == "rust") {

    }
    return result;
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
        var res = doBenche(kind,lang);
        console.log(res);
        setResult(res);
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
            <h1>pai</h1>
            <div className="Bench">
                <Func kind="pai" lang="php" />
                <Func kind="pai" lang="rust" />
                <Func kind="pai" lang="go" />
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
