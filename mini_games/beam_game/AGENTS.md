# AGENTS.md

このドキュメントは、ミニゲームテンプレートを使用してゲームを開発する際の注意事項をまとめたものです。

---

## 重要な前提条件

このミニゲームは**サーバーから制御されて動作します**。以下のことを必ず理解してください：

1. **サーバーがゲームの開始・終了を管理する**
2. **クライアント側（このHTML/JS）は、サーバーからの指示を受けて動作する**
3. **`control.js` がサーバーとの通信を担当し、ゲームロジック関数を呼び出す**

---

## やってはいけないこと

### 1. ゲーム開始ボタンを作らない
```javascript
// ダメな例
const startButton = document.createElement('button');
startButton.textContent = 'ゲーム開始';
startButton.onclick = () => gameStart();
```
**理由**: ゲームの開始はサーバーが制御します。ユーザーが自由に開始できてはいけません。

### 2. カウントダウンタイマーを作らない
```javascript
// ダメな例
let countdown = 3;
setInterval(() => {
    countdown--;
    if (countdown === 0) gameStart();
}, 1000);
```
**理由**: ゲームの開始タイミングはサーバーが決定します。

### 3. 自動的にゲームを終了させない（時間制限ゲーム以外）
```javascript
// ダメな例（時間制限がゲームルールの一部でない場合）
setTimeout(() => gameStop(), 30000);
```
**理由**: ゲームの終了もサーバーが制御します。ただし、ゲームルールとして制限時間がある場合（例：10秒チャレンジ）は内部タイマーを使用しても構いません。

### 4. 点数をalertで表示しない
```javascript
// ダメな例
function gameStop() {
    alert(`スコア: ${points}点`);  // これはcontrol.jsがやる
    return points;
}
```
**理由**: `control.js` が `gameStop()` の戻り値を受け取って、alertを表示します。

---

## 必ず実装する3つの関数

### 1. `instruction()` - 説明画面を表示
```javascript
function instruction() {
    // 開始画面を非表示にする
    startScreen.style.display = "none";
    // 説明画面を表示する
    instructionScreen.style.display = "flex";
    // ゲーム画面を非表示にする
    gameScreen.style.display = "none";
}
```
**呼び出されるタイミング**: サーバーから `instruction` イベントを受信したとき

### 2. `gameStart()` - ゲームを開始
```javascript
function gameStart() {
    // 画面切り替え
    startScreen.style.display = "none";
    instructionScreen.style.display = "none";
    gameScreen.style.display = "flex";
    
    // ゲーム状態を初期化
    points = 0;
    // ゲームロジックを開始...
}
```
**呼び出されるタイミング**: サーバーから `start` イベントを受信したとき

### 3. `gameStop()` - ゲームを終了し、点数を返す
```javascript
function gameStop() {
    // ゲームを停止する処理
    // ...
    
    // 開始画面に戻す
    startScreen.style.display = "flex";
    instructionScreen.style.display = "none";
    gameScreen.style.display = "none";
    
    // 点数を返す（最大100点）
    return Math.min(points, 100);
}
```
**呼び出されるタイミング**: サーバーから `stop` イベントを受信したとき

> **重要**: `gameStop()` は必ず **点数を `return` する** 必要があります。`control.js` がこの値を受け取ってサーバーに送信します。

---

## 画面構成

HTMLには3つの画面（div）があります：

| ID | 用途 | 初期状態 |
|---|---|---|
| `start-screen` | 開始画面・待機画面 | 表示 |
| `instruction-screen` | 説明画面 | 非表示 |
| `game-screen` | ゲームプレイ画面 | 非表示 |

```html
<div id="start-screen" class="screen">
    <!-- 待機中に表示する内容 -->
</div>
<div id="instruction-screen" class="screen" style="display: none;">
    <!-- ゲームの遊び方 -->
</div>
<div id="game-screen" class="screen" style="display: none;">
    <!-- ゲーム本体 -->
</div>
```

---

## 点数について

- **点数は0〜100点の範囲**で設定してください
- `gameStop()` で `return Math.min(points, 100)` のように最大値を制限することを推奨
- 点数の計算ロジックはゲームごとに自由に設計してください

---

## ゲーム開発の流れ

1. **開始画面のデザイン**: ゲームのタイトルや簡単な説明を配置
2. **説明画面の作成**: 遊び方を分かりやすく説明
3. **ゲーム画面の実装**: ゲームのメインロジック
4. **3つの関数を実装**: `instruction()`, `gameStart()`, `gameStop()`
5. **点数計算ロジック**: ゲーム結果に応じた点数を計算

---

## デバッグ方法

`control.js` の `Production_environment` を `false` にすると、左上にデバッグ用ボタンが表示されます：

- **説明表示**: `instruction()` を呼び出す
- **ゲーム開始**: `gameStart()` を呼び出す
- **ゲーム終了**: `gameStop()` を呼び出し、alertで点数を表示

ですが、基本的にcontrol.jsはオンラインから取得するのでいじる必要はありません。また、デフォルトでfalseになっています。

---

## ファイル構成

```
exsample/
├── index.html      # ゲーム本体（編集するファイル）
├── AI.md           # このファイル
└── data/
    └── background.png  # 背景画像（任意）

オンライン control.js
```

---

## サンプル：シンプルなゲームの例

```javascript
// 点数変数
let points = 0;

// 説明画面
function instruction() {
    startScreen.style.display = "none";
    instructionScreen.style.display = "flex";
    gameScreen.style.display = "none";
}

// ゲーム開始
function gameStart() {
    startScreen.style.display = "none";
    instructionScreen.style.display = "none";
    gameScreen.style.display = "flex";
    
    points = 0;
    // ここにゲーム初期化処理を書く
}

// ゲーム終了
function gameStop() {
    // ゲーム停止処理
    
    startScreen.style.display = "flex";
    instructionScreen.style.display = "none";
    gameScreen.style.display = "none";
    
    return Math.min(points, 100);
}
```

---

## よくある質問

### Q: ゲーム中に独自のタイマーを使っていい？
**A**: ゲームルールの一部として制限時間がある場合は使用OK。ただし、ゲームの開始・終了のトリガーとしては使わない。

### Q: 外部ライブラリを使っていい？
**A**: 使用可能ですが、CDNから読み込む場合は `index.html` の `<head>` 内に追加してください。

### Q: 背景画像を変更したい
**A**: `data/background.png` を差し替えるか、CSSの `background-image` を変更してください。

### Q: 音を鳴らしたい
**A**: Web Audio API や `<audio>` タグを使用できます。ただし、自動再生はブラウザでブロックされる可能性があります。
