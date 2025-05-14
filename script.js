// 游戏状态管理
const gameState = {
    currentScene: '2001',
    correctAnswers: 0,
    totalQuestions: 0,
    startTime: null,
    endTime: null,
    sceneData: {
        // 场景跳转映射
        '2001': { next: '2101' },
        '2101': { 
            options: {
                '3101': { next: '2102', correct: true },
                '3102': { next: '2102', correct: false, hint: '日常行为用一般现在时' }
            }
        },
        '2102': { 
            options: {
                '3103': { next: '2103', correct: true },
                '3104': { next: '2103', correct: false, hint: '描述昨天发生的简单行为用一般过去时' }
            }
        },
        '2103': { next: '2104' },
        '2104': { 
            options: {
                'left': { next: '2201', correct: true },
                'right': { next: '2201', correct: false, hint: '描述未来发生的简单行为用一般将来时' }
            }
        },
        '2201': { 
            options: {
                'left': { next: '2202', correct: true },
                'right': { next: '2203', correct: false, hint: '描述正在进行的行为用现在进行时' }
            }
        },
        '2202': { 
            options: {
                'left': { next: '2203', correct: true },
                'right': { next: '2202', correct: false, hint: '描述过去正在进行的行为用过去进行时' }
            }
        },
        '2203': { 
            options: {
                'left': { next: '2301', correct: true },
                'right': { next: '2301', correct: false, hint: '描述将来正在进行的行为用将来进行时' }
            }
        },
        '2301': { 
            options: {
                'left': { next: '2302', correct: true },
                'right': { next: '2302', correct: false, hint: '描述日常行为一般现在时' }
            }
        },
        '2302': { 
            options: {
                'left': { next: '2303', correct: true },
                'right': { next: '2302', correct: false, hint: '咒语未生效，请重新试' }
            }
        },
        '2303': { next: '2304' },
        '2304': { 
            options: {
                'left': { next: '2305', correct: true },
                'right': { next: '2305', correct: false, hint: '描述已经完成的的行为用现在完成时' }
            }
        },
        '2305': { 
            options: {
                'left': { next: '2401', correct: true },
                'right': { next: '2401', correct: false, hint: '描述将来完成的的行为用将来完成时' }
            }
        },
        '2401': { 
            options: {
                'left': { next: '2402', correct: true },
                'right': { next: '2402', correct: false, hint: '描述过去的行为持续到现在用现在完成进行' }
            }
        },
        '2402': { 
            options: {
                'left': { next: '2403', correct: true },
                'right': { next: '2403', correct: false, hint: '描述正在进行的行为用现在进行时' }
            }
        },
        '2403': { 
            options: {
                'left': { next: '2404', correct: true },
                'right': { next: '2404', correct: false, hint: '描述正在进行的行为用现在进行时' }
            }
        },
        '2404': { next: '2405' },
        '2405': { next: '2406' },
        '2406': { 
            options: {
                'left': { next: '2407', correct: true },
                'right': { next: '2407', correct: false, hint: '描述将来完成进行时' }
            }
        },
        '2407': { next: '2408' },
        '2408': { 
            options: {
                'left': { next: '2409', correct: true },
                'right': { next: '2409', correct: false, hint: '描述过去完成' }
            }
        },
        '2409': { next: '2410' },
        '2410': { next: null }
    }
};

// 初始化游戏
function initGame() {
    // 如果是开始场景，初始化游戏状态
    if (gameState.currentScene === '2001') {
        gameState.correctAnswers = 0;
        gameState.totalQuestions = 0;
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
        console.error(`Scene scene-${gameState.currentScene} not found`);
        return;
    }
    
    // 如果是结束场景，计算并显示统计数据
    if (gameState.currentScene === '2410') {
        gameState.endTime = new Date();
        const timeUsed = Math.floor((gameState.endTime - gameState.startTime) / 1000);
        const accuracy = gameState.totalQuestions > 0 
            ? Math.floor((gameState.correctAnswers / gameState.totalQuestions) * 100) 
            : 0;
        
        document.getElementById('accuracy-rate').textContent = `${accuracy}%`;
        document.getElementById('time-used').textContent = `${timeUsed}秒`;
        
        // 添加重新开始按钮事件
        document.getElementById('restart-btn').addEventListener('click', () => {
            gameState.currentScene = '2001';
            initGame();
        });
    }
    
    // 为当前场景的按钮添加事件
    setupSceneButtons();
}

// 设置场景按钮事件
function setupSceneButtons() {
    const sceneConfig = gameState.sceneData[gameState.currentScene];
    
    // 如果有选项按钮
    if (sceneConfig.options) {
        gameState.totalQuestions++;
        
        // 为左按钮添加事件
        const leftBtn = document.querySelector(`#scene-${gameState.currentScene} .button-group .left`);
        if (leftBtn) {
            leftBtn.addEventListener('click', () => handleOptionClick('left'));
        }
        
        // 为右按钮添加事件
        const rightBtn = document.querySelector(`#scene-${gameState.currentScene} .button-group .right`);
        if (rightBtn) {
            rightBtn.addEventListener('click', () => handleOptionClick('right'));
        }
    }
    
    // 为继续按钮添加事件
    const continueBtns = document.querySelectorAll(`#scene-${gameState.currentScene} .full-width .game-btn`);
    continueBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            gameState.currentScene = sceneConfig.next;
            initGame();
        });
    });
    
    // 特殊按钮处理（如游戏开始按钮）
    if (gameState.currentScene === '2001') {
        const startBtn = document.getElementById('btn-3001');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                gameState.currentScene = '2101';
                initGame();
            });
        }
    }
}

// 处理选项点击
function handleOptionClick(option) {
    const sceneConfig = gameState.sceneData[gameState.currentScene];
    const optionConfig = sceneConfig.options[option];
    
    if (optionConfig.correct) {
        gameState.correctAnswers++;
    } else {
        showHint(optionConfig.hint);
    }
    
    // 延迟跳转以显示提示
    setTimeout(() => {
        gameState.currentScene = optionConfig.next;
        initGame();
    }, optionConfig.correct ? 0 : 3000);
}

// 显示提示
function showHint(text) {
    const hintBox = document.getElementById('hint-box');
    const hintText = document.getElementById('hint-text');
    
    if (!hintBox || !hintText) {
        console.error('Hint box elements not found');
        return;
    }
    
    hintText.textContent = text;
    hintBox.classList.remove('hidden');
    
    // 3秒后隐藏提示
    setTimeout(() => {
        hintBox.classList.add('hidden');
    }, 3000);
}

// 错误处理
window.addEventListener('error', function(event) {
    console.error('Error:', event.message, 'in', event.filename, 'at line', event.lineno);
    alert('游戏发生错误，请刷新页面重试。错误信息: ' + event.message);
});

// 初始化游戏
document.addEventListener('DOMContentLoaded', initGame);
