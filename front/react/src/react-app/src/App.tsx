import React, { useState } from 'react';
import './App.css';
import loadingImg from './loading.gif';

type BenchKind = 'pi' | 'fib' | 'io';
type BenchLang = 'php' | 'rust' | 'go';
type BenchStatus = 'idle' | 'loading' | 'done' | 'error';

type BenchDefinition = {
  kind: BenchKind;
  title: string;
  summary: string;
  details: string[];
  notes?: string[];
};

type BenchResponse = {
  res: string;
};

const languageMeta: Record<BenchLang, { label: string; button: string }> = {
  php: { label: 'PHP 8 JIT', button: 'Run PHP' },
  rust: { label: 'Rust', button: 'Run Rust' },
  go: { label: 'Go', button: 'Run Go' },
};

const benchDefinitions: BenchDefinition[] = [
  {
    kind: 'pi',
    title: 'ライプニッツ級数',
    summary: '単純ループで円周率に近似し、純粋な計算処理の速度を比較します。',
    details: ['[(-1)^n / (2n+1)]', 'n=0 から 100000000 まで累計し、最後に 4 を掛ける'],
  },
  {
    kind: 'fib',
    title: 'フィボナッチ数列',
    summary: '再帰呼び出しのオーバーヘッドが出やすい処理で、実装系ごとの差を見ます。',
    details: [
      'function getFib(int $n): int {',
      '  return $n < 2 ? $n : getFib($n - 1) + getFib($n - 2);',
      '}',
      'getFib(40);',
    ],
  },
  {
    kind: 'io',
    title: 'I/O処理',
    summary: 'CSV の読み書きと DB insert を繰り返し、単純計算以外の負荷を比較します。',
    details: [
      'input_file: 1レコード int 型 5カラム、200レコードの CSV',
      'CSV を DB(MySQL) に insert',
      'insert したデータを CSV に書き出し',
      '書き出した CSV とインプットファイルのレコードを比較',
      '以上を 5 回繰り返す',
    ],
    notes: [
      'Rust と Go は I/O 制御を非同期で実装しているため、1スレッド限定条件では非同期オーバーヘッドの影響が出ます。',
      'Rust は同期実装も可能ですが、この条件では PHP と大きく異ならない想定です。',
    ],
  },
];

function getBenchUrl(kind: BenchKind, lang: BenchLang): string {
  if (lang === 'php') {
    return `/php/index.php?kind=${kind}`;
  }

  if (lang === 'go') {
    return `/golang/?kind=${kind}`;
  }

  return `/rust/?kind=${kind}`;
}

async function runBench(kind: BenchKind, lang: BenchLang): Promise<string> {
  const response = await fetch(getBenchUrl(kind, lang));

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data: BenchResponse = await response.json();
  return data.res;
}

function formatResult(result: string): string[] {
  return result
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line, index, array) => line.length > 0 || index < array.length - 1);
}

function BenchResult({ status, result }: { status: BenchStatus; result: string }) {
  if (status === 'loading') {
    return (
      <div className="bench-result bench-result-loading" aria-live="polite">
        <img className="bench-loading" src={loadingImg} alt="計測中" />
        <p>ベンチマークを実行しています...</p>
      </div>
    );
  }

  const lines = formatResult(result);

  return (
    <div className="bench-result" aria-live="polite">
      <pre>{lines.join('\n')}</pre>
    </div>
  );
}

function BenchCard({ kind, lang }: { kind: BenchKind; lang: BenchLang }) {
  const [status, setStatus] = useState<BenchStatus>('idle');
  const [result, setResult] = useState('未計測');

  const handleClick = async () => {
    setStatus('loading');
    setResult('計測中...');

    try {
      const nextResult = await runBench(kind, lang);
      setResult(nextResult);
      setStatus('done');
    } catch (error) {
      console.error(error);
      setResult('計測に失敗しました。時間をおいて再実行してください。');
      setStatus('error');
    }
  };

  const statusLabel =
    status === 'idle'
      ? '未計測'
      : status === 'loading'
        ? '計測中'
        : status === 'done'
          ? '完了'
          : 'エラー';

  return (
    <article className="bench-card">
      <div className="bench-card-head">
        <p className="bench-lang">{languageMeta[lang].label}</p>
        <span className={`bench-status bench-status-${status}`}>{statusLabel}</span>
      </div>
      <button type="button" className="bench-button" onClick={handleClick} disabled={status === 'loading'}>
        {languageMeta[lang].button}
      </button>
      <BenchResult status={status} result={result} />
    </article>
  );
}

function BenchSection({ definition }: { definition: BenchDefinition }) {
  return (
    <section className="bench-section">
      <div className="bench-section-copy">
        <div className="section-heading">
          <p className="section-kicker">Benchmark</p>
          <h2>{definition.title}</h2>
          <p>{definition.summary}</p>
        </div>
        <div className="code-panel">
          <div className="code-panel-title">処理概要</div>
          <pre>{definition.details.join('\n')}</pre>
        </div>
        {definition.notes && (
          <div className="bench-note">
            <p className="bench-note-title">補足</p>
            {definition.notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        )}
      </div>
      <div className="bench-grid">
        {(['php', 'rust', 'go'] as BenchLang[]).map((lang) => (
          <BenchCard key={lang} kind={definition.kind} lang={lang} />
        ))}
      </div>
    </section>
  );
}

function App() {
  return (
    <main className="app-shell">
      <div className="app-background" aria-hidden="true" />
      <div className="app">
        <header className="hero">
          <div className="hero-copy">
            <p className="hero-kicker">Language Benchmark Dashboard</p>
            <h1>PHP / Rust / Go のベンチマークを比較する</h1>
            <p className="hero-description">
              単純計算、再帰、I/O の 3 パターンで実行時間を比較し、各ランタイムの特性を同じ UI 上で確認できます。
            </p>
          </div>
          <div className="hero-summary">
            <div>
              <span className="hero-summary-label">対象</span>
              <strong>3 workloads</strong>
            </div>
            <div>
              <span className="hero-summary-label">比較言語</span>
              <strong>PHP / Rust / Go</strong>
            </div>
            <div>
              <span className="hero-summary-label">実行方式</span>
              <strong>個別スタート</strong>
            </div>
          </div>
        </header>

        <div className="sections">
          {benchDefinitions.map((definition) => (
            <BenchSection key={definition.kind} definition={definition} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;
