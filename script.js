// 游戏状态
const gameState = {
    currentScene: null,
    correctAnswers: 0,
    totalQuestions: 0,
    startTime: new Date(),
    endTime: null
};

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
        
        // 更新URL但不刷新页面
        history.pushState(null, '', `?scene=${sceneId}`);
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
    feedbackMessageElement.textContent = extractFeedbackMessage(feedbackMessage);
    feedbackModal.classList.remove('hidden');
    
    // 3秒后隐藏模态框并跳转
    setTimeout(() => {
        feedbackModal.classList.add('hidden');
        handleSceneTransition(feedbackMessage, nextSceneId);
    }, 3000);
}

// 提取反馈消息
function extractFeedbackMessage(message) {
    if (message.includes('高亮弹出小方框提示：')) {
        return message.match(/"(.*?)"/)[1];
    }
    return message;
}

// 处理场景跳转
function handleSceneTransition(feedbackMessage, nextSceneId) {
    if (feedbackMessage.includes('跳转画面')) {
        const targetScene = parseInt(feedbackMessage.match(/跳转画面(\d+)/)[1]);
        navigateToScene(targetScene);
    } else if (nextSceneId) {
        navigateToScene(nextSceneId);
    }
    
    // 如果是结束场景，计算分数
    if (gameState.currentScene === 2410) {
        calculateScore();
    }
}

// 计算分数
function calculateScore() {
    gameState.endTime = new Date();
    const timeUsed = Math.floor((gameState.endTime - gameState.startTime) / 1000);
    const correctRate = gameState.totalQuestions > 0 
        ? Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100) 
        : 0;
    
    // 更新UI
    if (document.getElementById('correct-rate')) {
        document.getElementById('correct-rate').textContent = `${correctRate}%`;
        document.getElementById('time-used').textContent = `${timeUsed}秒`;
    }
}

// 重新开始游戏
function restartGame() {
    window.location.href = 'indexGBL.html';
}

// 初始化按钮事件
function initButtonEvents() {
    // 为所有按钮添加事件监听
    document.querySelectorAll('.game-button').forEach(button => {
        button.addEventListener('click', function() {
            const isCorrect = this.classList.contains('correct');
            const feedback = this.getAttribute('data-feedback') || '';
            const nextScene = this.getAttribute('data-next-scene') || '';
            
            showFeedback(isCorrect, feedback, parseInt(nextScene));
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initButtonEvents();
    
    // 如果是从首页跳转过来的，初始化第一个场景
    const urlParams = new URLSearchParams(window.location.search);
    const initialScene = urlParams.get('scene');
    if (initialScene) {
        navigateToScene(parseInt(initialScene));
    }
});
