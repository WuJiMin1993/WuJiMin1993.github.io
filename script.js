// 游戏状态管理
const gameState = {
    currentScene: '2101', // 从第一个场景开始
    correctAnswers: 0,
    totalQuestions: 0,
    startTime: new Date(),
    endTime: null
};

// 初始化游戏
function initGame() {
    // 隐藏所有场景
    document.querySelectorAll('.game-container').forEach(scene => {
        scene.classList.add('hidden');
    });
    
    // 显示当前场景
    const currentScene = document.getElementById(`scene-${gameState.currentScene}`);
    if (currentScene) {
        currentScene.classList.remove('hidden');
    }
    
    // 如果是结束场景，计算统计数据
    if (gameState.currentScene === '2410') {
        gameState.endTime = new Date();
        showGameStats();
    }
    
    // 设置按钮事件
    setupButtons();
}

// 显示游戏统计
function showGameStats() {
    const timeUsed = Math.floor((gameState.endTime - gameState.startTime) / 1000);
    const accuracy = gameState.totalQuestions > 0 
        ? Math.floor((gameState.correctAnswers / gameState.totalQuestions) * 100) 
        : 0;
    
    document.getElementById('accuracy-rate').textContent = `${accuracy}%`;
    document.getElementById('time-used').textContent = `${timeUsed}秒`;
    
    // 重新开始按钮
    document.getElementById('restart-btn').addEventListener('click', () => {
        resetGame();
    });
}

// 重置游戏
function resetGame() {
    gameState.currentScene = '2101';
    gameState.correctAnswers = 0;
    gameState.totalQuestions = 0;
    gameState.startTime = new Date();
    gameState.endTime = null;
    initGame();
}

// 设置按钮事件
function setupButtons() {
    // 选项按钮
    document.querySelectorAll('.game-btn[data-next]').forEach(btn => {
        btn.addEventListener('click', function() {
            const isCorrect = this.getAttribute('data-correct') === 'true';
            const nextScene = this.getAttribute('data-next');
            const hint = this.getAttribute('data-hint');
            
            gameState.totalQuestions++;
            if (isCorrect) gameState.correctAnswers++;
            
            if (!isCorrect && hint) {
                showHint(hint);
                setTimeout(() => {
                    goToScene(nextScene);
                }, 3000);
            } else {
                goToScene(nextScene);
            }
        });
    });
}

// 跳转到指定场景
function goToScene(sceneId) {
    gameState.currentScene = sceneId;
    initGame();
}

// 显示提示
function showHint(text) {
    const hintBox = document.getElementById('hint-box');
    const hintText = document.getElementById('hint-text');
    
    hintText.textContent = text;
    hintBox.classList.remove('hidden');
    
    setTimeout(() => {
        hintBox.classList.add('hidden');
    }, 3000);
}

// 错误处理
window.addEventListener('error', function(event) {
    console.error('Error:', event.message, 'in', event.filename, 'at line', event.lineno);
    alert('游戏发生错误: ' + event.message);
});

// 初始化游戏
document.addEventListener('DOMContentLoaded', initGame);
