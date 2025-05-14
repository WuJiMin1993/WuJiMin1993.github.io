// 游戏状态
let gameState = {
    currentScene: 2001, // 初始场景
    correctAnswers: 0,
    totalQuestions: 0,
    startTime: null,
    endTime: null
};

// 初始化游戏
function initGame() {
    gameState = {
        currentScene: 2001,
        correctAnswers: 0,
        totalQuestions: 0,
        startTime: new Date(),
        endTime: null
    };
    
    // 显示初始场景
    navigateToScene(2001);
}

// 导航到指定场景
function navigateToScene(sceneId) {
    // 隐藏所有场景
    document.querySelectorAll('.game-container').forEach(container => {
        container.classList.add('hidden');
    });
    
    // 显示目标场景
    const targetScene = document.getElementById(`scene-${sceneId}`);
    if (targetScene) {
        targetScene.classList.remove('hidden');
        gameState.currentScene = sceneId;
    } else {
        console.error(`Scene ${sceneId} not found`);
    }
}

// 显示反馈
function showFeedback(isCorrect, feedbackMessage, nextSceneId) {
    if (isCorrect) {
        gameState.correctAnswers++;
    }
    gameState.totalQuestions++;
    
    const feedbackModal = document.getElementById('feedback-modal');
    const feedbackMessageElement = document.getElementById('feedback-message');
    
    // 设置反馈消息
    if (typeof feedbackMessage === 'string' && feedbackMessage.includes('高亮弹出小方框提示：')) {
        // 提取提示内容
        const message = feedbackMessage.match(/"(.*?)"/)[1];
        feedbackMessageElement.textContent = message;
    } else {
        feedbackMessageElement.textContent = isCorrect ? "回答正确！" : "回答错误！";
    }
    
    // 显示模态框
    feedbackModal.classList.remove('hidden');
    
    // 3秒后隐藏模态框并跳转到下一个场景
    setTimeout(() => {
        feedbackModal.classList.add('hidden');
        
        if (typeof feedbackMessage === 'string' && feedbackMessage.includes('跳转画面')) {
            const targetScene = parseInt(feedbackMessage.match(/跳转画面(\d+)/)[1]);
            navigateToScene(targetScene);
        } else if (nextSceneId) {
            navigateToScene(nextSceneId);
        }
        
        // 如果是最后一个场景，计算成绩
        if (nextSceneId === 2410 || gameState.currentScene === 2410) {
            calculateScore();
        }
    }, 3000);
}

// 计算分数
function calculateScore() {
    gameState.endTime = new Date();
    const timeUsed = Math.floor((gameState.endTime - gameState.startTime) / 1000);
    
    const correctRate = gameState.totalQuestions > 0 
        ? Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100) 
        : 0;
    
    document.getElementById('correct-rate').textContent = `${correctRate}%`;
    document.getElementById('time-used').textContent = `${timeUsed}秒`;
}

// 重新开始游戏
function restartGame() {
    initGame();
}

// 页面加载时初始化游戏
window.onload = function() {
    // 检查是否在章节页面
    if (document.getElementById('scene-2101')) {
        // 如果在章节页面，根据URL参数跳转到相应场景
        const urlParams = new URLSearchParams(window.location.search);
        const sceneParam = urlParams.get('scene');
        if (sceneParam) {
            navigateToScene(parseInt(sceneParam));
        } else {
            navigateToScene(2101); // 默认显示章节1第一个场景
        }
    } else {
        // 如果在首页，初始化游戏
        initGame();
    }
};
