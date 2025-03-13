// 故事管理模块
const storyModule = (() => {
    // 私有变量
    let storyEntries = [];
    
    // 初始化故事数据
    const init = () => {
        storyEntries = gameData.story;
        renderStoryLog();
    };
    
    // 渲染故事日志
    const renderStoryLog = () => {
        const storyLogElement = document.querySelector('.story-log');
        const unlockedEntries = storyEntries.filter(entry => entry.unlocked);
        
        if (unlockedEntries.length === 0) {
            storyLogElement.innerHTML = `
                <div class="empty-state">
                    <p>还没有故事记录。随着游戏进行，你将解锁更多故事内容。</p>
                </div>
            `;
            return;
        }
        
        let storyHTML = '';
        // 按照ID排序，确保故事按顺序显示
        unlockedEntries.sort((a, b) => {
            const idA = parseInt(a.id.split('_')[1]);
            const idB = parseInt(b.id.split('_')[1]);
            return idA - idB;
        }).forEach(entry => {
            storyHTML += `
                <div class="story-entry" data-id="${entry.id}">
                    <h3>${entry.title}</h3>
                    <p>${entry.content}</p>
                </div>
            `;
        });
        
        storyLogElement.innerHTML = storyHTML;
    };
    
    // 解锁新故事
    const unlockStory = (storyId) => {
        const story = storyEntries.find(entry => entry.id === storyId);
        if (!story) return false;
        
        story.unlocked = true;
        renderStoryLog();
        
        // 显示新故事通知
        gameModule.showDialog('新故事解锁', `你解锁了新的故事章节: "${story.title}"`, null, false);
        
        // 保存游戏数据
        gameModule.saveGame();
        return true;
    };
    
    // 添加新故事
    const addStory = (title, content) => {
        const newId = `story_${storyEntries.length + 1}`;
        const newStory = {
            id: newId,
            title: title,
            content: content,
            unlocked: true
        };
        
        storyEntries.push(newStory);
        renderStoryLog();
        
        // 显示新故事通知
        gameModule.showDialog('新故事解锁', `你解锁了新的故事章节: "${title}"`, null, false);
        
        // 保存游戏数据
        gameModule.saveGame();
        return newId;
    };
    
    // 检查故事触发条件
    const checkStoryTriggers = () => {
        // 这里可以添加基于游戏状态的故事触发逻辑
        // 例如，当玩家达到特定天数、完成特定任务或招募特定角色时触发新故事
        
        // 示例：当玩家招募第一个角色时
        if (charactersModule.getUnlockedCharacterCount() === 1) {
            // 检查是否已有相关故事
            const hasFirstCharacterStory = storyEntries.some(entry => entry.id === 'story_2' && entry.unlocked);
            if (!hasFirstCharacterStory) {
                // 添加新故事
                addStory(
                    '第一位伙伴',
                    '随着第一位居民的加入，避难所开始有了生气。这只是一个开始，但你感到一种责任感在心中萌生。这些人信任你，选择跟随你，你必须保护好他们，并带领大家共同发展这个避难所。'
                );
            }
        }
        
        // 可以添加更多故事触发条件
    };
    
    // 公开接口
    return {
        init,
        renderStoryLog,
        unlockStory,
        addStory,
        checkStoryTriggers
    };
})(); 