/**
 * 魔法世界 - 时态学习游戏
 * 完整版脚本文件
 * 包含所有游戏场景数据、状态管理和交互逻辑
 */

// 游戏数据 - 完整版（从Excel表格转换而来）
const gameData = {
    scenes: {
        // 开始画面
        2001: {
            id: 2001,
            text: "欢迎来到魔法世界",
            image: "images/开始画面.jpg",
            buttons: [
                { id: 3001, text: "游戏开始", position: "middle", correct: null, result: 2101 }
            ]
        },
        
        // 第一章场景
        2101: {
            id: 2101,
            text: "主人公Tom生活在魔法世界的魔法学校里，他每天都_____图书馆",
            image: "images/画面01.jpg",
            buttons: [
                { id: 3101, text: "打扫", position: "left", correct: true, result: 2102 },
                { id: 3102, text: "正在打扫", position: "right", correct: false, 
                  hint: "日常行为用一般现在时", result: 2102 }
            ]
        },
        2102: {
            id: 2102,
            text: "有一天，Tom发现他昨天_____的一个箱子今天被打开了，并且里面冒着蓝光。",
            image: "images/画面02.jpg",
            buttons: [
                { id: 3103, text: "锁上", position: "left", correct: true, result: 2103 },
                { id: 3104, text: "正在锁上", position: "right", correct: false, 
                  hint: "描述昨天发生的简单行为用一般过去时", result: 2103 }
            ]
        },
        2103: {
            id: 2103,
            text: "Tom好奇，走进一看，是个闪着蓝光的魔法棒，旁白有个标签，写着'时态魔法棒'。",
            image: "images/画面03.jpg",
            buttons: [
                { id: 0, text: "继续", position: "middle", correct: null, result: 2104 }
            ]
        },
        2104: {
            id: 2104,
            text: "Tom心生好奇，他把魔法棒藏在衣服里，明天一早_____户外试一下魔法棒的威力。",
            image: "images/画面04.jpg",
            buttons: [
                { id: 0, text: "将去", position: "left", correct: true, result: 2201 },
                { id: 0, text: "已经去", position: "right", correct: false, 
                  hint: "描述未来发生的简单行为用一般将来时", result: 2201 }
            ]
        },
        
        // 第二章场景
        2201: {
            id: 2201,
            text: "时间来到第二天早上，他_____着魔法扫帚飞往学校旁边的一个森林里。",
            image: "images/画面05.jpg",
            buttons: [
                { id: 0, text: "正在骑", position: "left", correct: true, result: 2202 },
                { id: 0, text: "已经骑", position: "right", correct: false, 
                  hint: "描述正在进行的行为用现在进行时", result: 2203 }
            ]
        },
        2202: {
            id: 2202,
            text: "昨天这个时候，Tom正_____图书馆，但他觉得这个魔法棒会很好玩，所以决定今天不去打扫图书馆了。",
            image: "images/画面06.jpg",
            buttons: [
                { id: 0, text: "正在打扫", position: "left", correct: true, result: 2203 },
                { id: 0, text: "已经打扫", position: "right", correct: false, 
                  hint: "描述过去正在进行的行为用过去进行时", result: 2202 }
            ]
        },
        2203: {
            id: 2203,
            text: "为了防止图书馆馆长Jimmy发现Tom偷懒，Tom将很早到达将图书馆进行_____。",
            image: "images/画面07.jpg",
            buttons: [
                { id: 0, text: "打扫", position: "left", correct: true, result: 2301 },
                { id: 0, text: "已经打扫", position: "right", correct: false, 
                  hint: "描述将来正在进行的行为用将来进行时", result: 2301 }
            ]
        },
        
        // 第三章场景
        2301: {
            id: 2301,
            text: "Tom停在了森林里的小溪旁边，然后从衣服里拿出【一般现在】魔法棒。他想，这魔法棒叫'时态'，难道启动它的咒语和时态有关？",
            image: "images/画面08.jpg",
            buttons: [
                { id: 0, text: "拿出", position: "left", correct: true, result: 2302 },
                { id: 0, text: "已经拿出", position: "right", correct: false, 
                  hint: "描述日常行为一般现在时", result: 2302 }
            ]
        },
        2302: {
            id: 2302,
            text: "于是，他决定结合在魔法学校学习的咒语试一下。<br>Tom用魔法棒指向小溪，念了一句：'一条香喷喷的鱼已经被烤熟了【现在完成】'。",
            image: "images/画面09.jpg",
            buttons: [
                { id: 0, text: "已经被烤熟", position: "left", correct: true, result: 2303 },
                { id: 0, text: "将来被烤熟", position: "right", correct: false, 
                  hint: "咒语未生效，请重新试", result: 2302 }
            ]
        },
        2303: {
            id: 2303,
            text: "只见念完咒语之后，突然一道蓝色闪光过后，一个用树枝做的烤架，上面有一条香喷喷的烤鱼出现在了Tom的面前。",
            image: "images/画面10.jpg",
            buttons: [
                { id: 0, text: "继续", position: "middle", correct: null, result: 2304 }
            ]
        },
        2304: {
            id: 2304,
            text: "Tom想，我来这之前，还没吃东西呢【过去完成】。正好可以饱餐一顿。<br>Tom拿起吃了起来。",
            image: "images/画面11.jpg",
            buttons: [
                { id: 0, text: "已经烤好的鱼", position: "left", correct: true, result: 2305 },
                { id: 0, text: "将要烤好", position: "right", correct: false, 
                  hint: "描述已经完成的的行为用现在完成时", result: 2305 }
            ]
        },
        2305: {
            id: 2305,
            text: "Tom边吃边想，当我掌握了这根魔杖，那个总是欺负我的巫师就会被打败。【将来完成】。（By the time I have mastered this magic wand, the wizard who always bullies me will have been defeated.）",
            image: "images/画面12.jpg",
            buttons: [
                { id: 0, text: "将会被打败", position: "left", correct: true, result: 2401 },
                { id: 0, text: "已经被打败", position: "right", correct: false, 
                  hint: "描述将来完成的的行为用将来完成时", result: 2401 }
            ]
        },
        
        // 第四章场景
        2401: {
            id: 2401,
            text: "虽然Tom已经来到魔法学校_____一年时间【现在完成进行】，但是魔法的知识还是比不过巫师Mike。",
            image: "images/画面13.jpg",
            buttons: [
                { id: 0, text: "学习了", position: "left", correct: true, result: 2402 },
                { id: 0, text: "将学习", position: "right", correct: false, 
                  hint: "描述过去的行为持续到现在用现在完成进行", result: 2402 }
            ]
        },
        2402: {
            id: 2402,
            text: "Tom意识到了魔法棒的厉害之处，于是Tom来到了以前经常戏弄他的巫师Mike的家里。<br>Tom说：'Mike，现在我_____魔法打败你了，你出来接受我的挑战吧'",
            image: "images/画面14.jpg",
            buttons: [
                { id: 0, text: "可以用", position: "left", correct: true, result: 2403 },
                { id: 0, text: "正在用", position: "right", correct: false, 
                  hint: "描述正在进行的行为用现在进行时", result: 2403 }
            ]
        },
        2403: {
            id: 2403,
            text: "今天是个阳光明媚的日子，只见Mike带着一个大大的灰色巫师帽从房间里走了出来，说到'Tom，在过去的一年时间里，已经多次_____我了【过去完成进行时】。（You had been repeatedly losing to me over the past year.）还是不服输吗'",
            image: "images/画面15.jpg",
            buttons: [
                { id: 0, text: "输给", position: "left", correct: true, result: 2404 },
                { id: 0, text: "将输给", position: "right", correct: false, 
                  hint: "描述正在进行的行为用现在进行时", result: 2404 }
            ]
        },
        2404: {
            id: 2404,
            text: "只见Tom用魔法棒指向天空，用咒语说了一句：'It's going to rain soon'，魔法棒发出来蓝光。",
            image: "images/画面16.jpg",
            buttons: [
                { id: 0, text: "继续", position: "middle", correct: null, result: 2405 }
            ]
        },
        2405: {
            id: 2405,
            text: "果然，不一会儿天空出现了乌云，打起了雷，开始下起了下雨点。",
            image: "images/画面17.jpg",
            buttons: [
                { id: 0, text: "继续", position: "middle", correct: null, result: 2406 }
            ]
        },
        2406: {
            id: 2406,
            text: "Mike看见后下了一跳，说到：'到明天为止，我已经学了魔法2年了【将来完成进行时】（By tomorrow, I have been studying magic for 2 years now）。却从来没看过这么厉害的魔法，我承认你已经比我厉害了'",
            image: "images/画面18.jpg",
            buttons: [
                { id: 0, text: "已经学了", position: "left", correct: true, result: 2407 },
                { id: 0, text: "将要学", position: "right", correct: false, 
                  hint: "描述将来完成进行时", result: 2407 }
            ]
        },
        2407: {
            id: 2407,
            text: "Tom想再炫耀一下魔法棒的威力，准备念出下一个咒语时，突然一道光闪过，图书馆馆长Jimmy出现在面前。",
            image: "images/画面19.jpg",
            buttons: [
                { id: 0, text: "继续", position: "middle", correct: null, result: 2408 }
            ]
        },
        2408: {
            id: 2408,
            text: "馆长说到：'Tom，我找了它找了一整天，原来被你拿走了'。",
            image: "images/画面20.jpg",
            buttons: [
                { id: 0, text: "找了", position: "left", correct: true, result: 2409 },
                { id: 0, text: "将找", position: "right", correct: false, 
                  hint: "描述过去完成", result: 2409 }
            ]
        },
        2409: {
            id: 2409,
            text: "Jimmy举起手，魔法棒自动飞到Jimmy的手里。然后，Jimmy领着Tom，说道'赶紧回去给我打扫图书馆'.....",
            image: "images/画面21.jpg",
            buttons: [
                { id: 0, text: "继续", position: "middle", correct: null, result: 2410 }
            ]
        },
        2410: {
            id: 2410,
            text: "排行榜：显示正确率、闯关所用时间",
            image: "images/画面22.jpg",
            buttons: [
                { id: 0, text: "重新开始", position: "middle", correct: null, result: 2001 }
            ]
        }
    },
    
    // 游戏状态管理
    state: {
        currentScene: 2001,       // 当前场景ID
        correctAnswers: 0,       // 正确答案计数
        totalQuestions: 0,       // 总问题计数
        startTime: null,          // 游戏开始时间
        endTime: null,            // 游戏结束时间
        sceneHistory: []         // 场景历史记录（用于调试）
    }
};

/**
 * 初始化游戏
 */
function initGame() {
    // 设置初始场景
    gameData.state.startTime = new Date();
    
    // 根据当前页面设置初始场景
    if (window.location.pathname.includes('chapter.html')) {
        gameData.state.currentScene = 2101; // 章节页面从第一个章节场景开始
    } else {
        gameData.state.currentScene = 2001; // 首页从开始画面开始
    }
    
    // 重置游戏统计
    gameData.state.correctAnswers = 0;
    gameData.state.totalQuestions = 0;
    gameData.state.sceneHistory = [];
    
    // 加载初始场景
    loadScene(gameData.state.currentScene);
    
    // 更新统计信息
    updateStats();
}

/**
 * 加载指定场景
 * @param {number} sceneId - 场景ID
 */
function loadScene(sceneId) {
    const scene = gameData.scenes[sceneId];
    if (!scene) {
        console.error(`场景 ${sceneId} 不存在`);
        return;
    }
    
    // 记录场景历史
    gameData.state.sceneHistory.push(sceneId);
    
    const container = document.getElementById('scene-container');
    if (!container) {
        console.error('场景容器未找到');
        return;
    }
    
    // 创建场景元素
    const sceneElement = document.createElement('div');
    sceneElement.className = 'scene active';
    sceneElement.id = `scene-${scene.id}`;
    sceneElement.dataset.sceneId = scene.id;
    
    // 处理换行符
    const processedText = scene.text.replace(/\n/g, '<br>');
    
    // 生成按钮HTML
    let buttonsHTML = '';
    if (scene.buttons && scene.buttons.length > 0) {
        scene.buttons.forEach(button => {
            const buttonClass = button.position === 'left' ? 'left-button' : 
                             button.position === 'right' ? 'right-button' : 'main-button';
            buttonsHTML += `
                <button class="${buttonClass}" id="button-${button.id}" 
                    onclick="handleButtonClick(${button.id}, ${scene.id})">
                    ${button.text}
                </button>
            `;
        });
    } else {
        // 没有按钮的场景，添加默认继续按钮
        buttonsHTML = '<button class="main-button" onclick="handleButtonClick(0, ${scene.id})">继续</button>';
    }
    
    // 组装场景HTML
    sceneElement.innerHTML = `
        <div class="scene-content">
            <h1>${processedText}</h1>
            ${scene.image ? `<div class="scene-image"><img src="${scene.image}" alt="场景图片" onerror="handleImageError(this)"></div>` : ''}
            <div class="button-container">
                ${buttonsHTML}
            </div>
        </div>
    `;
    
    // 清空容器并添加新场景
    container.innerHTML = '';
    container.appendChild(sceneElement);
    
    // 如果是结束场景，显示最终统计
    if (sceneId === 2410) {
        showFinalStats();
    }
}

/**
 * 处理按钮点击事件
 * @param {number} buttonId - 按钮ID
 * @param {number} sceneId - 当前场景ID
 */
function handleButtonClick(buttonId, sceneId) {
    const currentScene = gameData.scenes[sceneId || gameData.state.currentScene];
    let button;
    
    // 查找点击的按钮
    if (currentScene.buttons) {
        button = currentScene.buttons.find(b => b.id === buttonId);
    } else {
        // 没有按钮的场景，使用默认跳转
        button = { result: currentScene.defaultResult || 2101 };
    }
    
    if (!button) {
        console.error(`按钮 ${buttonId} 未找到`);
        return;
    }
    
    // 更新游戏状态
    if (button.correct !== null) {
        gameData.state.totalQuestions++;
        if (button.correct) {
            gameData.state.correctAnswers++;
        } else {
            // 显示错误提示
            showHint(button.hint);
        }
    }
    
    // 更新统计信息
    updateStats();
    
    // 跳转到下一个场景
    if (button.result) {
        setTimeout(() => {
            gameData.state.currentScene = button.result;
            loadScene(button.result);
        }, button.correct === false ? 3000 : 0);
    }
}

/**
 * 显示提示信息
 * @param {string} message - 提示消息内容
 */
function showHint(message) {
    if (!message) return;
    
    const hintBox = document.getElementById('hint-box');
    const hintMessage = document.getElementById('hint-message');
    
    if (!hintBox || !hintMessage) {
        console.error('提示框元素未找到');
        return;
    }
    
    hintMessage.innerHTML = message;
    hintBox.style.display = 'block';
    
    // 3秒后自动隐藏
    setTimeout(() => {
        hintBox.style.display = 'none';
    }, 3000);
}

/**
 * 更新游戏统计信息
 */
function updateStats() {
    // 计算正确率
    const accuracy = gameData.state.totalQuestions > 0 
        ? Math.round((gameData.state.correctAnswers / gameData.state.totalQuestions) * 100) 
        : 0;
    
    // 计算用时
    const now = new Date();
    const timeDiff = now - gameData.state.startTime;
    const minutes = Math.floor(timeDiff / 60000);
    const seconds = Math.floor((timeDiff % 60000) / 1000);
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // 更新UI
    const accuracyElement = document.getElementById('accuracy-rate');
    const timeElement = document.getElementById('time-used');
    
    if (accuracyElement) accuracyElement.textContent = `${accuracy}%`;
    if (timeElement) timeElement.textContent = timeString;
}

/**
 * 显示最终统计信息
 */
function showFinalStats() {
    const accuracy = gameData.state.totalQuestions > 0 
        ? Math.round((gameData.state.correctAnswers / gameData.state.totalQuestions) * 100) 
        : 0;
    
    const now = new Date();
    const timeDiff = now - gameData.state.startTime;
    const minutes = Math.floor(timeDiff / 60000);
    const seconds = Math.floor((timeDiff % 60000) / 1000);
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // 更新结束场景文本
    const sceneElement = document.querySelector(`#scene-2410 .scene-content h1`);
    if (sceneElement) {
        sceneElement.innerHTML = `
            游戏结束！<br><br>
            正确率: ${accuracy}%<br>
            用时: ${timeString}<br><br>
            感谢游玩魔法世界时态学习游戏！
        `;
    }
}

/**
 * 处理图片加载错误
 * @param {HTMLElement} imgElement - 图片元素
 */
function handleImageError(imgElement) {
    console.error(`图片加载失败: ${imgElement.src}`);
    imgElement.style.display = 'none'; // 隐藏无法加载的图片
}

// 全局函数
window.handleButtonClick = handleButtonClick;
window.initGame = initGame;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否在Github Pages上运行
    if (window.location.hostname === 'yourgithubusername.github.io') {
        // 确保图片路径正确
        Object.values(gameData.scenes).forEach(scene => {
            if (scene.image) {
                scene.image = scene.image.replace('images/', '/your-repo-name/images/');
            }
        });
    }
    
    initGame();
});
