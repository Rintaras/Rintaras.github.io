# Akima補間インタラクティブデモ

GitHub Pagesで動作するAkima補間のインタラクティブなデモページです。

## 機能

- データポイントの追加・削除・編集
- リアルタイムでスプラインの変化を確認
- 補間点数の調整
- 表示オプションの切り替え

## 使用方法

1. GitHub Pagesでホストする場合、このディレクトリをそのまま公開してください
2. ローカルで確認する場合、HTTPサーバーで起動してください：
   ```bash
   python -m http.server 8000
   ```
   または
   ```bash
   npx serve
   ```

## ファイル構成

- `index.html` - メインのHTMLファイル
- `app.js` - JavaScript制御コード
- `akima_interpolation.py` - Akima補間の実装

## 技術スタック

- Pyodide - ブラウザでPythonを実行
- Plotly.js - インタラクティブなグラフ描画
- NumPy - 数値計算

