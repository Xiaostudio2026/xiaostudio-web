if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // 確保 sw.js 路徑正確
        navigator.serviceWorker.register('./sw.js').catch((err) => {
            console.log("Service Worker 註冊失敗:", err);
        });
    });
}