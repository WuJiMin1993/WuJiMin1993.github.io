// 游戏状态管理
const gameState = {
    currentScene: null,
    correctAnswers: 0,
    totalQuestions: 0,
    startTime: null,
    endTime: null
};

// DOM元素缓存
const elements = {
    hintBox: document.getElementById('hint-box'),
    hintText: document.getElementById('hint-text'),
    accuracyRate: document.getElementById('accuracy-rate'),
    timeUsed: document.getElementById('time-used'),
    restartBtn: document.getElementById('restart-btn')
};

// 初始化游戏
function initGame() {
    try {
        // 从URL参数获取初始场景，如果没有则默认为2101
        const urlParams = new URLSearchParams(window.location.search);
        gameState.currentScene = urlParams.get('scene') || '2101';
        
        // 设置开始时间（如果是第一次进入）
        if (!gameState.startTime) {
            gameState.startTime = new Date();
        }
        
        // 隐藏所有场景
        document.querySelectorAll('.game-container').forEach(scene => {
            scene.classList.add('hidden');
        });
        
        // 显示当前场景
        const currentScene = document.getElementById(`scene-${gameState.currentScene}`);
        if (currentScene) {
            currentScene.classList.remove('hidden');
        } else {
            console.error(`场景 scene-${gameState.currentScene} 未找到，将跳转到第一个场景`);
            gameState.currentScene = '2101';
            const fallbackScene = document.getElementById('scene-2101');
            if (fallbackScene) {
                fallbackScene.classList.remove('hidden');
            } else {
                throw new Error('无法找到初始场景');
            }
        }
        
        // 如果是结束场景，计算统计数据
        if (gameState.currentScene === '2410') {
            showGameStats();
        }
        
        // 设置按钮事件
        setupButtons();
        
    } catch (error) {
        handleError(error, '初始化游戏失败');
    }
}

// 显示游戏统计
function showGameStats() {
    try {
        gameState.endTime = new Date();
        const timeUsed = Math.floor((gameState.endTime - gameState.startTime) / 1000);
        const accuracy = gameState.totalQuestions > 0 
            ? Math.floor((gameState.correctAnswers / gameState.totalQuestions) * 100) 
            : 0;
        
        elements.accuracyRate.textContent = `${accuracy}%`;
        elements.timeUsed.textContent = `${timeUsed}秒`;
        
        // 重新开始按钮事件
        if (elements.restartBtn) {
            elements.restartBtn.addEventListener('click', resetGame);
        }
    } catch (error) {
        handleError(error, '计算统计数据失败');
    }
}

// 重置游戏
function resetGame() {
    gameState.currentScene = '2101';
    gameState.correctAnswers = 0;
    gameState.totalQuestions = 0;
    gameState.startTime = new Date();
    gameState.endTime = null;
    
    // 使用replaceState避免回退到结束页面
    window.history.replaceState({}, '', 'chapter.html?scene=2101');
    initGame();
}

// 设置按钮事件
function setupButtons() {
    try {
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
        
        // 继续按钮
        document.querySelectorAll('.game-btn:not([data-next])').forEach(btn => {
            btn.addEventListener('click', function() {
                const sceneContainer = this.closest('.game-container');
                const currentSceneId = sceneContainer.id.replace('scene-', '');
                const nextScene = gameState.sceneData[currentSceneId]?.next;
                
                if (nextScene) {
                    goToScene(nextScene);
                }
            });
        });
    } catch (error) {
        handleError(error, '设置按钮事件失败');
    }
}

// 跳转到指定场景
function goToScene(sceneId) {
    try {
        gameState.currentScene = sceneId;
        
        // 更新URL但不刷新页面
        window.history.pushState({}, '', `?scene=${sceneId}`);
        
        initGame();
    } catch (error) {
        handleError(error, '跳转场景失败');
    }
}

// 显示提示
function showHint(text) {
    try {
        if (elements.hintBox && elements.hintText) {
            elements.hintText.textContent = text;
            elements.hintBox.classList.remove('hidden');
            
            setTimeout(() => {
                elements.hintBox.classList.add('hidden');
            }, 3000);
        }
    } catch (error) {
        console.error('显示提示失败:', error);
    }
}

// 错误处理
function handleError(error, context) {
    console.error(`${context}:`, error);
    
    // 创建错误显示元素
    const errorDisplay = document.createElement('div');
    errorDisplay.style.position = 'fixed';
    errorDisplay.style.top = '0';
    errorDisplay.style.left = '0';
    errorDisplay.style.right = '0';
    errorDisplay.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    errorDisplay.style.color = 'white';
    errorDisplay.style.padding = '15px';
    errorDisplay.style.zIndex = '9999';
    errorDisplay.style.textAlign = 'center';
    errorDisplay.style.fontWeight = 'bold';
    errorDisplay.textContent = `${context}，请刷新页面重试 (${error.message})`;
    
    document.body.appendChild(errorDisplay);
    
    // 5秒后自动移除错误信息
    setTimeout(() => {
        errorDisplay.remove();
    }, 5000);
}

// 全局错误处理
window.addEventListener('error', function(event) {
    handleError(event.error, '全局错误');
});

// 处理浏览器前进/后退按钮
window.addEventListener('popstate', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const scene = urlParams.get('scene');
    if (scene) {
        gameState.currentScene = scene;
        initGame();
    }
});

// DOM加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', function() {
    // 场景数据映射
    gameState.sceneData = {
        '2101': { next: '2102' },
        '2102': { next: '2103' },
        '2103': { next: '2104' },
        '2104': { next: '2201' },
        '2201': { next: '2202' },
        '2202': { next: '2203' },
        '2203': { next: '2301' },
        '2301': { next: '2302' },
        '2302': { next: '2303' },
        '2303': { next: '2304' },
        '2304': { next: '2305' },
        '2305': { next: '2401' },
        '2401': { next: '2402' },
        '2402': { next: '2403' },
        '2403': { next: '2404' },
        '2404': { next: '2405' },
        '2405': { next: '2406' },
        '2406': { next: '2407' },
        '2407': { next: '2408' },
        '2408': { next: '2409' },
        '2409': { next: '2410' },
        '2410': { next: null }
    };
    
    initGame();
});
