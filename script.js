/**
 * 游戏通用功能脚本
 * 包含跨页面共享的功能
 */

// 游戏状态管理
class GameState {
    constructor() {
        this.currentScene = '2001'; // 默认开始场景
        this.startTime = null;
        this.endTime = null;
        this.score = 0;
        this.correctAnswers = 0;
        this.totalQuestions = 0;
    }
    
    // 开始游戏
    startGame() {
        this.startTime = new Date();
        this.calculateTotalQuestions();
    }
    
    // 计算总题目数
    calculateTotalQuestions() {
        // 在实际场景中，这应该在页面加载时计算
        // 这里只是一个示例实现
        this.totalQuestions = document.querySelectorAll('[data-correct="true"]').length || 15; // 默认15题
    }
    
    // 记录答案
    recordAnswer(isCorrect) {
        if (isCorrect) {
            this.correctAnswers++;
        }
    }
    
    // 计算分数
    calculateScore() {
        this.endTime = new Date();
        
        // 计算用时（毫秒）
        const timeUsedMs = this.endTime - this.startTime;
        const timeUsedSec = Math.floor(timeUsedMs / 1000);
        const minutes = Math.floor(timeUsedSec / 60);
        
        // 计算时间分数（每满一分钟2分，不满1分）
        const timeScore = minutes > 0 ? minutes * 2 : 1;
        
        // 计算答题分数（每道题100/N分）
        const questionScore = Math.floor(100 / this.totalQuestions);
        const totalQuestionScore = this.correctAnswers * questionScore;
        
        // 总分数 = 答题总分 - 时间分数
        this.score = totalQuestionScore - timeScore;
        
        return {
            accuracy: Math.round((this.correctAnswers / this.totalQuestions) * 100),
            timeUsed: `${minutes}分${timeUsedSec % 60}秒`,
            score: this.score > 0 ? this.score : 0
        };
    }
}

// 初始化游戏状态
const gameState = new GameState();

// 场景切换功能
function navigateToScene(sceneId) {
    if (sceneId === '2001') {
        window.location.href = 'index.html';
    } else if (sceneId === '2101' || sceneId === '2201' || sceneId === '2301' || sceneId === '2401') {
        window.location.href = `chapter.html?scene=${sceneId}`;
    } else {
        // 在同一页面内切换场景
        showScene(sceneId);
    }
}

// 显示指定场景
function showScene(sceneId) {
    // 隐藏所有场景
    document.querySelectorAll('.scene').forEach(scene => {
        scene.style.display = 'none';
    });
    
    // 显示当前场景
    const currentScene = document.getElementById(`scene-${sceneId}`);
    if (currentScene) {
        currentScene.style.display = 'block';
        gameState.currentScene = sceneId;
        
        // 如果是结果场景，计算并显示结果
        if (sceneId === '2410') {
            showResults();
        }
    }
}

// 显示结果
function showResults() {
    const results = gameState.calculateScore();
    
    // 更新DOM显示结果
    if (document.getElementById('accuracy-rate')) {
        document.getElementById('accuracy-rate').textContent = `${results.accuracy}%`;
        document.getElementById('time-used').textContent = results.timeUsed;
        document.getElementById('total-score').textContent = results.score;
    }
}

// 显示错误消息
function showError(message) {
    // 创建错误消息元素如果不存在
    let errorBox = document.getElementById('error-message');
    let errorText = document.getElementById('error-text');
    
    if (!errorBox) {
        errorBox = document.createElement('div');
        errorBox.id = 'error-message';
        errorBox.className = 'error-message';
        errorBox.style.display = 'none';
        
        errorText = document.createElement('p');
        errorText.id = 'error-text';
        
        errorBox.appendChild(errorText);
        document.body.appendChild(errorBox);
    }
    
    errorText.textContent = message;
    errorBox.style.display = 'block';
    
    // 3秒后隐藏
    setTimeout(() => {
        errorBox.style.display = 'none';
    }, 3000);
}

// 初始化按钮事件
function initButtons() {
    document.querySelectorAll('.game-button').forEach(button => {
        button.addEventListener('click', function() {
            const targetScene = this.getAttribute('data-target');
            const isCorrect = this.getAttribute('data-correct') === 'true';
            const errorMessage = this.getAttribute('data-message');
            
            // 如果是答题按钮，更新分数
            if (this.hasAttribute('data-correct')) {
                gameState.recordAnswer(isCorrect);
                
                if (!isCorrect && errorMessage) {
                    showError(errorMessage);
                }
            }
            
            // 跳转到目标场景
            if (targetScene) {
                navigateToScene(targetScene);
            }
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 从URL获取当前场景ID
    const urlParams = new URLSearchParams(window.location.search);
    const currentSceneId = urlParams.get('scene') || '2001';
    
    // 初始化游戏状态
    gameState.currentScene = currentSceneId;
    
    // 如果是章节页面，显示对应场景
    if (window.location.pathname.includes('chapter.html')) {
        showScene(currentSceneId);
    }
    
    // 初始化按钮
    initButtons();
    
    // 如果是开始页面，初始化游戏状态
    if (window.location.pathname.includes('index.html')) {
        document.getElementById('button-3001').addEventListener('click', function() {
            gameState.startGame();
        });
    }
});
