// 这个文件目前为空，因为所有游戏逻辑都已经直接在HTML文件中实现
// 如果需要添加更多通用功能，可以在这里添加

// 例如，可以添加一个通用的显示提示函数
function showGlobalHint(message, duration = 3000) {
    const hintBox = document.createElement('div');
    hintBox.className = 'hint-box';
    hintBox.innerHTML = `<div>${message}</div>`;
    document.body.appendChild(hintBox);
    
    setTimeout(() => {
        hintBox.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(hintBox);
        }, 500);
    }, duration);
}

// 或者添加一个通用的页面跳转函数
function navigateToScene(sceneId) {
    window.location.href = `chapter.html?scene=${sceneId}`;
}
