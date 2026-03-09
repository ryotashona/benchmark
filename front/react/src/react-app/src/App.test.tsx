import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ res: '計測結果\n123ms' }),
    } as Response);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('主要見出しと各ベンチマークセクションを表示する', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'PHP / Rust / Go のベンチマークを比較する' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'ライプニッツ級数' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'フィボナッチ数列' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'I/O処理' })).toBeInTheDocument();
    expect(document.querySelectorAll('.bench-status-idle')).toHaveLength(9);
  });

  test('各ベンチマークセクションは3言語カードを持つ', () => {
    render(<App />);

    expect(screen.getAllByText('PHP 8 JIT')).toHaveLength(3);
    expect(screen.getAllByText('Rust')).toHaveLength(3);
    expect(screen.getAllByText('Go')).toHaveLength(3);
  });

  test('クリックで計測中になり、完了後に結果を表示する', async () => {
    let resolveFetch: ((value: Response) => void) | undefined;

    (global.fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve as (value: Response) => void;
        })
    );

    render(<App />);

    act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Run PHP' })[0]);
    });

    expect(screen.getByText('計測中')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith('/php/index.php?kind=pi');

    await act(async () => {
      resolveFetch?.({
        ok: true,
        json: async () => ({ res: '計測結果\n123ms' }),
      } as Response);
    });

    await waitFor(() => {
      expect(screen.getByText('完了')).toBeInTheDocument();
      expect(screen.getByText(/計測結果/)).toBeInTheDocument();
    });
  });

  test('各 workload のリクエストURLが既存仕様のまま', async () => {
    render(<App />);

    await act(async () => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Run PHP' })[0]);
      fireEvent.click(screen.getAllByRole('button', { name: 'Run Rust' })[1]);
      fireEvent.click(screen.getAllByRole('button', { name: 'Run Go' })[2]);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenNthCalledWith(1, '/php/index.php?kind=pi');
      expect(global.fetch).toHaveBeenNthCalledWith(2, '/rust/?kind=fib');
      expect(global.fetch).toHaveBeenNthCalledWith(3, '/golang/?kind=io');
    });
  });
});
