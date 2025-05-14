// 游戏状态管理
const gameState = {
    currentScene: null, // 初始为null，根据URL参数或默认值设置
    correctAnswers: 0,
    totalQuestions: 0,
    startTime: null,
    endTime: null
};

// 初始化游戏
function initGame() {
    // 从URL参数获取初始场景，如果没有则默认为2101(第一个章节场景)
    const urlParams = new URLSearchParams(window.location.search);
    gameState.currentScene = urlParams.get('scene') || '2101';
    
    // 如果是第一次进入章节页面，设置开始时间
    if (!gameState.startTime) {
        gameState.startTime = new Date();
    }
    
    // 隐藏所有场景
    document.querySelectorAll('.game-container').forEach(scene => {
        scene.classList.add('hidden');
    });
    
    // 显示当前场景
    const currentScene = document.getElementById(`scene-${gameState.currentScene}`);
    if (!currentScene) {
        console.error(`场景 scene-${gameState.currentScene} 未找到`);
        // 如果场景不存在，默认跳转到第一个场景
        gameState.currentScene = '2101';
        const fallbackScene = document.getElementById(`scene-2101`);
        if (fallbackScene) {
            fallbackScene.classList.remove('hidden');
        } else {
            alert('游戏初始化错误，请刷新页面');
            return;
        }
    } else {
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

// 其余函数保持不变...
