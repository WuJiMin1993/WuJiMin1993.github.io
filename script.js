// 导航到指定URL
function navigateTo(url) {
    window.location.href = url;
}

// 显示反馈信息
function showFeedback(isCorrect, messageOrUrl, redirectUrl = null) {
    const modal = document.getElementById('feedback-modal');
    const feedbackText = document.getElementById('feedback-text');
    
    if (isCorrect) {
        // 如果答案正确，直接跳转
        navigateTo(messageOrUrl);
    } else {
        // 如果答案错误，显示反馈信息
        feedbackText.textContent = messageOrUrl;
        modal.style.display = 'flex';
        
        // 3秒后自动关闭并跳转
        setTimeout(() => {
            modal.style.display = 'none';
            if (redirectUrl) {
                navigateTo(redirectUrl);
            }
        }, 3000);
    }
}

// 关闭模态框
function closeModal() {
    document.getElementById('feedback-modal').style.display = 'none';
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('feedback-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
