// control.js
// ミニゲーム用サーバー通信コントローラー
// URLパラメータからIPを取得し、type="client"としてサーバーに接続する。
// ゲームのライフサイクル（instruction → gameStart → gameStop）を管理する。
//
// 使い方:
//   <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
//   <script src="/control.js" defer></script>
//
// URLパラメータ:
//   ?ip=192.168.x.x  - 接続先サーバーIPを指定（デフォルト: 127.0.0.1）
//   ?debug=true      - デバッグモードを有効にし、手動操作ボタンを表示する
//
// ミニゲーム側で実装必須の関数:
//   instruction() - 説明画面を表示
//   gameStart()   - ゲームを開始
//   gameStop()    - ゲームを停止し、得点(0-100)を返す

(function () {
    "use strict";

    // URLパラメータからIPを取得
    const urlParams = new URLSearchParams(window.location.search);
    const deviceIp = urlParams.get("ip") || "127.0.0.1";

    // 本番環境フラグ
    // true : サーバーと接続し、デバッグボタンを非表示にする
    // false: デバッグボタンを表示し、手動テストを可能にする
    // URLパラメータ ?debug=true で強制的にデバッグモードにもできる
    const Production_environment =
        urlParams.get("debug") === "true" ? false : true;

    // =====================================================
    // デバッグ用ボタン生成 (Production_environmentがfalseの場合のみ)
    // =====================================================
    function createDebugButtons() {
        const container = document.createElement("div");
        container.id = "debug-control-panel";
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
        const instructionBtn = document.createElement("button");
        instructionBtn.textContent = "📖 説明表示";
        instructionBtn.style.cssText =
            buttonStyle +
            `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;`;
        instructionBtn.addEventListener("click", () => {
            if (typeof window.instruction === "function") {
                window.instruction();
            } else {
                console.warn("[control.js] instruction() が定義されていません");
            }
        });
        instructionBtn.addEventListener("mouseenter", () => {
            instructionBtn.style.transform = "scale(1.05)";
        });
        instructionBtn.addEventListener("mouseleave", () => {
            instructionBtn.style.transform = "scale(1)";
        });

        // 開始ボタン
        const startBtn = document.createElement("button");
        startBtn.textContent = "▶️ ゲーム開始";
        startBtn.style.cssText =
            buttonStyle +
            `background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white;`;
        startBtn.addEventListener("click", () => {
            if (typeof window.gameStart === "function") {
                window.gameStart();
            } else {
                console.warn("[control.js] gameStart() が定義されていません");
            }
        });
        startBtn.addEventListener("mouseenter", () => {
            startBtn.style.transform = "scale(1.05)";
        });
        startBtn.addEventListener("mouseleave", () => {
            startBtn.style.transform = "scale(1)";
        });

        // 終了ボタン
        const stopBtn = document.createElement("button");
        stopBtn.textContent = "⏹️ ゲーム終了";
        stopBtn.style.cssText =
            buttonStyle +
            `background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%); color: white;`;
        stopBtn.addEventListener("click", () => {
            if (typeof window.gameStop === "function") {
                const score = window.gameStop();
                const clampedScore = Math.min(
                    Math.max(Number(score) || 0, 0),
                    100
                );
                alert(`今回の点数: ${clampedScore}点`);
            } else {
                console.warn("[control.js] gameStop() が定義されていません");
            }
        });
        stopBtn.addEventListener("mouseenter", () => {
            stopBtn.style.transform = "scale(1.05)";
        });
        stopBtn.addEventListener("mouseleave", () => {
            stopBtn.style.transform = "scale(1)";
        });

        container.appendChild(instructionBtn);
        container.appendChild(startBtn);
        container.appendChild(stopBtn);
        document.body.appendChild(container);
    }

    console.log(
        `[control.js] デバイスIP: ${deviceIp} / Production_environment: ${Production_environment}`
    );

    window._controlDeviceIp = deviceIp;

    // =====================================================
    // 本番環境: Socket.IO接続 + ゲームライフサイクル
    // =====================================================
    if (Production_environment) {
        const socket = io({
            auth: {
                ip: deviceIp,
                type: "client",
            },
        });

        socket.on("connect", () => {
            console.log("[control.js] サーバーに接続しました:", socket.id);
        });

        socket.on("disconnect", (reason) => {
            console.log("[control.js] サーバーから切断:", reason);
        });

        socket.on("connect_error", (err) => {
            console.error("[control.js] 接続エラー:", err.message);
        });

        // ===== ゲームライフサイクル =====

        // 説明画面表示
        socket.on("printEvent", (data) => {
            console.log("[control.js] printEvent received");
            if (typeof window.instruction === "function") {
                window.instruction();
            } else {
                console.warn("[control.js] instruction()が定義されていません");
            }
        });

        // ゲーム開始
        socket.on("startEvent", (data) => {
            console.log("[control.js] startEvent received");
            if (typeof window.gameStart === "function") {
                window.gameStart();
            } else {
                console.warn("[control.js] gameStart()が定義されていません");
            }
        });

        // ゲーム終了
        socket.on("finishEvent", (data) => {
            console.log("[control.js] finishEvent received");
            if (typeof window.gameStop === "function") {
                const score = window.gameStop();
                console.log("[control.js] ゲーム終了 スコア:", score);

                // スコアをサーバーに送信
                if (score !== undefined && score !== null) {
                    const clampedScore = Math.min(
                        Math.max(Number(score) || 0, 0),
                        100
                    );
                    socket.emit("add_point", {
                        group_name: window._controlGroupName || "",
                        point: clampedScore,
                    });
                    // スコアをalertで表示
                    alert(`スコア: ${clampedScore}点`);
                }
            } else {
                console.warn("[control.js] gameStop()が定義されていません");
            }
        });

        // チーム情報受信（グループ名を保存）
        socket.on("setTeamDeteils", (data) => {
            console.log("[control.js] setTeamDeteils:", data);
            window._controlGroupName = data.name || "";
        });

        // 全削除
        socket.on("delAll", () => {
            console.log("[control.js] delAll received");
        });

        // マス目設定
        socket.on("setIndex", (data) => {
            console.log("[control.js] setIndex:", data);
        });

        // グローバルに公開 (デバッグ用)
        window._controlSocket = socket;

    // =====================================================
    // デバッグ環境: デバッグボタン表示
    // =====================================================
    } else {
        console.log("[control.js] デバッグモード - ボタンを表示します");
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", createDebugButtons);
        } else {
            createDebugButtons();
        }
    }
})();
