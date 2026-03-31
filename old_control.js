// =====================================================
// control.js - ミニゲーム制御スクリプト
// =====================================================

// 本番環境フラグ
// true: サーバーと接続し、デバッグボタンを非表示にする
// false: デバッグボタンを表示し、手動テストを可能にする
const Production_environment = false;

// サーバー接続URL (本番環境で使用)
const SERVER_URL = window.location.origin;

// =====================================================
// デバッグ用ボタン生成 (Production_environmentがfalseの場合のみ)
// =====================================================
function createDebugButtons() {
    // コンテナ作成
    const container = document.createElement('div');
    container.id = 'debug-control-panel';
    container.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        background: rgba(0, 0, 0, 0.7);
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    `;

    // ボタンスタイル共通
    const buttonStyle = `
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease;
    `;

    // 説明ボタン
    const instructionBtn = document.createElement('button');
    instructionBtn.textContent = '📖 説明表示';
    instructionBtn.style.cssText = buttonStyle + `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    `;
    instructionBtn.addEventListener('click', () => {
        if (typeof window.instruction === 'function') {
            window.instruction();
        } else {
            console.warn('instruction() 関数が定義されていません');
        }
    });
    instructionBtn.addEventListener('mouseenter', () => {
        instructionBtn.style.transform = 'scale(1.05)';
    });
    instructionBtn.addEventListener('mouseleave', () => {
        instructionBtn.style.transform = 'scale(1)';
    });

    // 開始ボタン
    const startBtn = document.createElement('button');
    startBtn.textContent = '▶️ ゲーム開始';
    startBtn.style.cssText = buttonStyle + `
        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        color: white;
    `;
    startBtn.addEventListener('click', () => {
        if (typeof window.gameStart === 'function') {
            window.gameStart();
        } else {
            console.warn('gameStart() 関数が定義されていません');
        }
    });
    startBtn.addEventListener('mouseenter', () => {
        startBtn.style.transform = 'scale(1.05)';
    });
    startBtn.addEventListener('mouseleave', () => {
        startBtn.style.transform = 'scale(1)';
    });

    // 終了ボタン
    const stopBtn = document.createElement('button');
    stopBtn.textContent = '⏹️ ゲーム終了';
    stopBtn.style.cssText = buttonStyle + `
        background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
        color: white;
    `;
    stopBtn.addEventListener('click', () => {
        if (typeof window.gameStop === 'function') {
            const score = window.gameStop();
            alert(`今回の点数: ${score}点`);
        } else {
            console.warn('gameStop() 関数が定義されていません');
        }
    });
    stopBtn.addEventListener('mouseenter', () => {
        stopBtn.style.transform = 'scale(1.05)';
    });
    stopBtn.addEventListener('mouseleave', () => {
        stopBtn.style.transform = 'scale(1)';
    });

    // ボタンをコンテナに追加
    container.appendChild(instructionBtn);
    container.appendChild(startBtn);
    container.appendChild(stopBtn);

    // コンテナをbodyに追加
    document.body.appendChild(container);
}

// =====================================================
// Socket.io接続 (Production_environmentがtrueの場合のみ)
// =====================================================
let socket = null;

function initializeSocket() {
    if (typeof io === 'undefined') {
        console.error('socket.io が読み込まれていません');
        return;
    }

    socket = io(SERVER_URL);

    socket.on('connect', () => {
        console.log('サーバーに接続しました');
    });

    socket.on('disconnect', () => {
        console.log('サーバーから切断されました');
    });

    // 説明表示イベント
    socket.on('instruction', () => {
        console.log('[Socket] instruction イベント受信');
        if (typeof window.instruction === 'function') {
            window.instruction();
        }
    });

    // ゲーム開始イベント
    socket.on('start', () => {
        console.log('[Socket] start イベント受信');
        if (typeof window.gameStart === 'function') {
            window.gameStart();
        }
    });

    // ゲーム終了イベント
    socket.on('stop', () => {
        console.log('[Socket] stop イベント受信');
        if (typeof window.gameStop === 'function') {
            const score = window.gameStop();
            // 点数をサーバーに送信
            socket.emit('score', { score: score });
            console.log(`[Socket] スコア送信: ${score}点`);
        }
    });
}

// =====================================================
// 初期化
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log(`[control.js] 初期化 - Production_environment: ${Production_environment}`);

    if (Production_environment) {
        // 本番環境: Socket.io接続
        initializeSocket();
    } else {
        // デバッグ環境: ボタン表示
        createDebugButtons();
    }
});