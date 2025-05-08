 游戏常量
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLORS = [
    'cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'
];

 方块形状
const SHAPES = [
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],  I
    [[1, 0, 0], [1, 1, 1], [0, 0, 0]],                          J
    [[0, 0, 1], [1, 1, 1], [0, 0, 0]],                          L
    [[1, 1], [1, 1]],                                           O
    [[0, 1, 1], [1, 1, 0], [0, 0, 0]],                          S
    [[0, 1, 0], [1, 1, 1], [0, 0, 0]],                          T
    [[1, 1, 0], [0, 1, 1], [0, 0, 0]]                           Z
];

 游戏状态
let canvas, ctx;
let board;
let currentPiece, nextPiece;
let score = 0;
let level = 1;
let gameOver = false;
let dropInterval;
let isMultiplayer = false;
let socket;
let roomCode = '';
let isHost = false;
let opponentBoard = Array(ROWS).fill().map(() = Array(COLS).fill(0));

 初始化游戏
function init() {
     设置事件监听器
    document.getElementById('single-player').addEventListener('click', startSinglePlayer);
    document.getElementById('multi-player').addEventListener('click', showMultiplayerSection);
    document.getElementById('join-room').addEventListener('click', joinRoom);
    
     键盘控制
    document.addEventListener('keydown', control);
}

 开始单人游戏
function startSinglePlayer() {
    isMultiplayer = false;
    document.getElementById('multiplayer-section').style.display = 'none';
    document.getElementById('multi-game').style.display = 'none';
    document.getElementById('single-game').style.display = 'flex';
    
    canvas = document.getElementById('tetris');
    ctx = canvas.getContext('2d');
    
    resetGame();
    startGame();
}

 显示双人游戏界面
function showMultiplayerSection() {
    document.getElementById('multiplayer-section').style.display = 'block';
    document.getElementById('single-game').style.display = 'none';
    
     生成随机房间号
    roomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    document.getElementById('room-code').value = roomCode;
    isHost = true;
}

 加入房间
function joinRoom() {
    roomCode = document.getElementById('room-code').value.trim();
    if (!roomCode) {
        alert('请输入房间号');
        return;
    }
    
     连接Socket.io服务器
    socket = io('httpsyour-socketio-server.com', {
        reconnectionAttempts 5,
        reconnectionDelay 1000
    });
    
    socket.on('connect', () = {
        document.getElementById('room-status').textContent = '连接服务器成功...';
        socket.emit('join-room', roomCode);
    });
    
    socket.on('room-joined', (data) = {
        document.getElementById('room-status').textContent = `已加入房间 ${roomCode}`;
        isHost = data.isHost;
        startMultiplayerGame();
    });
    
    socket.on('room-full', () = {
        document.getElementById('room-status').textContent = '房间已满';
    });
    
    socket.on('opponent-connected', () = {
        document.getElementById('room-status').textContent = `对手已连接，游戏即将开始`;
    });
    
    socket.on('game-state', (data) = {
        opponentBoard = data.board;
        document.getElementById('score-player2').textContent = data.score;
        document.getElementById('level-player2').textContent = data.level;
        drawOpponentBoard();
    });
    
    socket.on('opponent-disconnected', () = {
        document.getElementById('room-status').textContent = '对手已断开连接';
        setTimeout(() = {
            alert('对手已断开连接，游戏结束');
            resetGame();
        }, 1000);
    });
    
    socket.on('disconnect', () = {
        document.getElementById('room-status').textContent = '与服务器断开连接';
    });
}

 开始多人游戏
function startMultiplayerGame() {
    isMultiplayer = true;
    document.getElementById('multiplayer-section').style.display = 'none';
    document.getElementById('single-game').style.display = 'none';
    document.getElementById('multi-game').style.display = 'block';
    
     初始化玩家1的游戏
    canvas = document.getElementById('tetris-player1');
    ctx = canvas.getContext('2d');
    
     初始化玩家2的显示
    const opponentCanvas = document.getElementById('tetris-player2');
    const opponentCtx = opponentCanvas.getContext('2d');
    opponentCtx.scale(BLOCK_SIZE, BLOCK_SIZE);
    
    resetGame();
    startGame();
}

 重置游戏
function resetGame() {
    board = Array(ROWS).fill().map(() = Array(COLS).fill(0));
    score = 0;
    level = 1;
    gameOver = false;
    
    if (isMultiplayer) {
        document.getElementById('score-player1').textContent = '0';
        document.getElementById('level-player1').textContent = '1';
        document.getElementById('score-player2').textContent = '0';
        document.getElementById('level-player2').textContent = '1';
    } else {
        document.getElementById('score').textContent = '0';
        document.getElementById('level').textContent = '1';
    }
}

 开始游戏
function startGame() {
    clearInterval(dropInterval);
    createNewPiece();
    dropInterval = setInterval(drop, 1000 - (level - 1)  50);
    draw();
}

 创建新方块
function createNewPiece() {
    if (!nextPiece) {
        nextPiece = {
            shape SHAPES[Math.floor(Math.random()  SHAPES.length)],
            color COLORS[Math.floor(Math.random()  COLORS.length)],
            x Math.floor(COLS  2) - 1,
            y 0
        };
    }
    
    currentPiece = nextPiece;
    nextPiece = {
        shape SHAPES[Math.floor(Math.random()  SHAPES.length)],
        color COLORS[Math.floor(Math.random()  COLORS.length)],
        x Math.floor(COLS  2) - 1,
        y 0
    };
    
     检查游戏是否结束
    if (collision()) {
        gameOver = true;
        clearInterval(dropInterval);
        setTimeout(() = {
            alert('游戏结束！你的分数 ' + score);
            resetGame();
        }, 100);
    }
}

 绘制游戏
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
     绘制已落下的方块
    for (let y = 0; y  ROWS; y++) {
        for (let x = 0; x  COLS; x++) {
            if (board[y][x]) {
                drawBlock(x, y, board[y][x]);
            }
        }
    }
    
     绘制当前方块
    if (currentPiece) {
        for (let y = 0; y  currentPiece.shape.length; y++) {
            for (let x = 0; x  currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    drawBlock(currentPiece.x + x, currentPiece.y + y, currentPiece.color);
                }
            }
        }
    }
}

 绘制对手的游戏板
function drawOpponentBoard() {
    const opponentCanvas = document.getElementById('tetris-player2');
    const opponentCtx = opponentCanvas.getContext('2d');
    opponentCtx.clearRect(0, 0, opponentCanvas.width, opponentCanvas.height);
    
    for (let y = 0; y  ROWS; y++) {
        for (let x = 0; x  COLS; x++) {
            if (opponentBoard[y][x]) {
                opponentCtx.fillStyle = opponentBoard[y][x];
                opponentCtx.fillRect(x, y, 1, 1);
            }
        }
    }
}

 绘制单个方块
function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x  BLOCK_SIZE, y  BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x  BLOCK_SIZE, y  BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

 下落方块
function drop() {
    if (!gameOver) {
        currentPiece.y++;
        if (collision()) {
            currentPiece.y--;
            lock();
            clearLines();
            createNewPiece();
        }
        draw();
        
         在多人游戏中发送游戏状态
        if (isMultiplayer && socket) {
            socket.emit('game-update', {
                room roomCode,
                board board,
                score score,
                level level
            });
        }
    }
}

 锁定方块
function lock() {
    for (let y = 0; y  currentPiece.shape.length; y++) {
        for (let x = 0; x  currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
                board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
            }
        }
    }
}

 清除已填满的行
function clearLines() {
    let linesCleared = 0;
    
    for (let y = ROWS - 1; y = 0; y--) {
        let lineFilled = true;
        for (let x = 0; x  COLS; x++) {
            if (!board[y][x]) {
                lineFilled = false;
                break;
            }
        }
        
        if (lineFilled) {
             移除该行
            for (let yy = y; yy  0; yy--) {
                for (let x = 0; x  COLS; x++) {
                    board[yy][x] = board[yy - 1][x];
                }
            }
             清空顶行
            for (let x = 0; x  COLS; x++) {
                board[0][x] = 0;
            }
            
            linesCleared++;
            y++;  重新检查当前行
        }
    }
    
    if (linesCleared  0) {
         计算得分
        score += [0, 40, 100, 300, 1200][linesCleared]  level;
        
         每10行升一级
        if (Math.floor(score  1000)  level - 1) {
            level = Math.floor(score  1000) + 1;
            clearInterval(dropInterval);
            dropInterval = setInterval(drop, 1000 - (level - 1)  50);
        }
        
         更新分数显示
        if (isMultiplayer) {
            document.getElementById('score-player1').textContent = score;
            document.getElementById('level-player1').textContent = level;
        } else {
            document.getElementById('score').textContent = score;
            document.getElementById('level').textContent = level;
        }
    }
}

 碰撞检测
function collision() {
    for (let y = 0; y  currentPiece.shape.length; y++) {
        for (let x = 0; x  currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
                const newX = currentPiece.x + x;
                const newY = currentPiece.y + y;
                
                if (newX  0  newX = COLS  newY = ROWS) {
                    return true;
                }
                
                if (newY = 0 && board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

 键盘控制
function control(e) {
    if (gameOver) return;
    
    switch (e.keyCode) {
        case 37  左箭头
            currentPiece.x--;
            if (collision()) currentPiece.x++;
            break;
        case 39  右箭头
            currentPiece.x++;
            if (collision()) currentPiece.x--;
            break;
        case 40  下箭头
            currentPiece.y++;
            if (collision()) currentPiece.y--;
            break;
        case 38  上箭头 - 旋转
            rotate();
            break;
        case 32  空格 - 硬降落
            hardDrop();
            break;
    }
    
    draw();
}

 旋转方块
function rotate() {
    const originalShape = currentPiece.shape;
    const N = currentPiece.shape.length;
    const rotated = Array(N).fill().map(() = Array(N).fill(0));
    
     转置矩阵
    for (let y = 0; y  N; y++) {
        for (let x = 0; x  N; x++) {
            rotated[x][y] = currentPiece.shape[y][x];
        }
    }
    
     反转每一行
    for (let y = 0; y  N; y++) {
        rotated[y].reverse();
    }
    
    currentPiece.shape = rotated;
    if (collision()) {
        currentPiece.shape = originalShape;
    }
}

 硬降落
function hardDrop() {
    while (!collision()) {
        currentPiece.y++;
    }
    currentPiece.y--;
    drop();  立即锁定并生成新方块
}

 初始化游戏
window.onload = init;