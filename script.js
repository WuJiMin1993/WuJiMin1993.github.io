// 游戏状态管理
const gameState = {
    currentScene: '2001', // 当前场景ID
    startTime: null,      // 游戏开始时间
    totalQuestions: 0,   // 总问题数
    correctAnswers: 0,    // 正确答案数
    answeredQuestions: 0  // 已回答问题数
};

// 初始化游戏
function initGame() {
    // 重置游戏状态
    gameState.startTime = new Date();
    gameState.totalQuestions = document.querySelectorAll('.btn-group').length;
    gameState.correctAnswers = 0;
    gameState.answeredQuestions = 0;
    
    // 隐藏所有场景
    document.querySelectorAll('.scene').forEach(scene => {
        scene.style.display = 'none';
    });
    
    // 显示第一个场景
    showScene('2101');
}

// 开始游戏
function startGame() {
    // 从indexGBL.html跳转到chapter.html
    window.location.href = 'chapter.html';
}

// 页面加载完成后初始化游戏
window.onload = function() {
    // 检查是否在章节页面
    if (window.location.pathname.includes('chapter.html') || 
        window.location.pathname.endsWith('/') || 
        window.location.pathname === '') {
        // 延迟执行以确保DOM完全加载
        setTimeout(() => {
            initGame();
        }, 100);
    }
};

// 显示指定场景
function showScene(sceneId) {
    // 更新当前场景
    gameState.currentScene = sceneId;
    
    // 隐藏所有场景
    document.querySelectorAll('.scene').forEach(scene => {
        scene.style.display = 'none';
    });
    
    // 显示目标场景
    const targetScene = document.getElementById(`scene-${sceneId}`);
    if (targetScene) {
        targetScene.style.display = 'flex';
    } else {
        console.error(`场景ID ${sceneId} 不存在`);
    }
}

// 检查答案
function checkAnswer(buttonId, isCorrect, nextSceneId, hintMessage) {
    // 更新已回答问题数
    gameState.answeredQuestions++;
    
    // 如果答案正确，增加正确计数
    if (isCorrect) {
        gameState.correctAnswers++;
    } else {
        // 显示提示信息
        showHint(hintMessage);
    }
    
    // 如果有下一个场景，跳转到下一个场景
    if (nextSceneId) {
        // 如果是错误答案且有提示，延迟跳转
        if (!isCorrect && hintMessage) {
            setTimeout(() => {
                showScene(nextSceneId);
            }, 3000); // 3秒后跳转
        } else {
            showScene(nextSceneId);
        }
    }
    
    // 如果是最后一个场景，计算并显示统计信息
    if (nextSceneId === '2410') {
        setTimeout(() => {
            showStats();
        }, 500);
    }
}

// 显示提示信息
function showHint(message) {
    const hintBox = document.getElementById('hint-box');
    const hintText = document.getElementById('hint-text');
    
    if (hintBox && hintText) {
        hintText.textContent = message;
        hintBox.style.visibility = 'visible';
        hintBox.style.opacity = '1';
        
        // 3秒后自动隐藏提示
        setTimeout(() => {
            hintBox.style.opacity = '0';
            hintBox.style.visibility = 'hidden';
        }, 3000);
    }
}

// 下一场景
function nextScene(nextSceneId) {
    showScene(nextSceneId);
    
    // 如果是最后一个场景，计算并显示统计信息
    if (nextSceneId === '2410') {
        setTimeout(() => {
            showStats();
        }, 500);
    }
}

// 显示统计信息
function showStats() {
    // 计算正确率
    const accuracy = gameState.totalQuestions > 0 
        ? Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100) 
        : 0;
    
    // 计算用时
    const endTime = new Date();
    const timeUsed = Math.round((endTime - gameState.startTime) / 1000);
    
    // 更新UI
    const accuracyElement = document.getElementById('accuracy-rate');
    const timeUsedElement = document.getElementById('time-used');
    
    if (accuracyElement) accuracyElement.textContent = `${accuracy}%`;
    if (timeUsedElement) timeUsedElement.textContent = timeUsed;
}

// 重新开始游戏
function restartGame() {
    // 重置游戏状态
    gameState.startTime = new Date();
    gameState.correctAnswers = 0;
    gameState.answeredQuestions = 0;
    
    // 重新从第一个场景开始
    showScene('2101');
}

// 错误处理：捕获全局错误
window.onerror = function(message, source, lineno, colno, error) {
    console.error(`发生错误: ${message} at ${source}:${lineno}:${colno}`);
    showHint('游戏发生错误，请刷新页面重试');
    return true; // 阻止默认错误处理
};
