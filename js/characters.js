// 角色管理模块
const charactersModule = (() => {
    // 私有变量
    let characters = [];
    
    // 初始化角色数据
    const init = () => {
        characters = gameData.characters;
        renderCharacterList();
    };
    
    // 渲染角色列表
    const renderCharacterList = () => {
        const characterListElement = document.querySelector('.character-list');
        const unlockedCharacters = characters.filter(char => char.unlocked);
        
        if (unlockedCharacters.length === 0) {
            characterListElement.innerHTML = `
                <div class="empty-state">
                    <p>尚未招募角色。完成任务来招募你的第一个角色！</p>
                </div>
            `;
            return;
        }
        
        let characterHTML = '';
        unlockedCharacters.forEach(character => {
            characterHTML += `
                <div class="character-card" data-id="${character.id}">
                    <div class="character-header">
                        <h3>${character.name}</h3>
                        <span class="character-title">${character.title}</span>
                    </div>
                    <div class="character-info">
                        <p>类型: ${getCharacterTypeText(character.type)}</p>
                        <p>等级: ${character.level}</p>
                        <div class="character-attributes">
                            <span>力量: ${character.attributes.strength}</span>
                            <span>敏捷: ${character.attributes.agility}</span>
                            <span>智力: ${character.attributes.intelligence}</span>
                        </div>
                    </div>
                    <div class="character-actions">
                        <button class="view-details-btn" data-id="${character.id}">查看详情</button>
                        <button class="assign-task-btn" data-id="${character.id}">分配任务</button>
                    </div>
                </div>
            `;
        });
        
        characterListElement.innerHTML = characterHTML;
        
        // 添加事件监听器
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const characterId = e.target.getAttribute('data-id');
                showCharacterDetails(characterId);
            });
        });
        
        document.querySelectorAll('.assign-task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const characterId = e.target.getAttribute('data-id');
                // 调用任务模块的分配任务方法
                tasksModule.showAssignTaskDialog(characterId);
            });
        });
    };
    
    // 获取角色类型的中文文本
    const getCharacterTypeText = (type) => {
        const typeMap = {
            'warrior': '战士',
            'artisan': '工匠',
            'scholar': '学者',
            'special': '特殊'
        };
        return typeMap[type] || type;
    };
    
    // 显示角色详情
    const showCharacterDetails = (characterId) => {
        const character = characters.find(char => char.id === characterId);
        if (!character) return;
        
        // 构建角色详情内容
        let dialogContent = `
            <div class="character-details">
                <h3>${character.name} - ${character.title}</h3>
                <p class="character-story">${character.story}</p>
                
                <div class="character-stats">
                    <h4>属性</h4>
                    <p>力量: ${character.attributes.strength}</p>
                    <p>敏捷: ${character.attributes.agility}</p>
                    <p>智力: ${character.attributes.intelligence}</p>
                </div>
                
                <div class="character-abilities">
                    <h4>能力</h4>
                    ${character.abilities.map(ability => `
                        <div class="ability-item">
                            <h5>${ability.name}</h5>
                            <p>${ability.description}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="character-specializations">
                    <h4>专精路线</h4>
                    ${character.specializations.map(spec => `
                        <div class="specialization-item">
                            <h5>${spec.name} (等级 ${spec.level}/${spec.maxLevel})</h5>
                            <p>${spec.description}</p>
                            ${spec.level < spec.maxLevel ? `<button class="upgrade-spec-btn" data-char-id="${character.id}" data-spec-id="${spec.id}">提升</button>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // 显示对话框
        gameModule.showDialog('角色详情', dialogContent, () => {
            // 添加专精提升按钮的事件监听
            document.querySelectorAll('.upgrade-spec-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const charId = e.target.getAttribute('data-char-id');
                    const specId = e.target.getAttribute('data-spec-id');
                    upgradeSpecialization(charId, specId);
                });
            });
        });
    };
    
    // 提升角色专精
    const upgradeSpecialization = (characterId, specializationId) => {
        const character = characters.find(char => char.id === characterId);
        if (!character) return;
        
        const specialization = character.specializations.find(spec => spec.id === specializationId);
        if (!specialization || specialization.level >= specialization.maxLevel) return;
        
        // 这里可以添加升级所需的资源检查
        // 如果资源足够，则提升专精等级
        specialization.level += 1;
        
        // 更新角色详情显示
        showCharacterDetails(characterId);
        
        // 保存游戏数据
        gameModule.saveGame();
    };
    
    // 解锁新角色
    const unlockCharacter = (characterId) => {
        const character = characters.find(char => char.id === characterId);
        if (!character) return false;
        
        character.unlocked = true;
        renderCharacterList();
        
        // 保存游戏数据
        gameModule.saveGame();
        return true;
    };
    
    // 获取已解锁角色数量
    const getUnlockedCharacterCount = () => {
        return characters.filter(char => char.unlocked).length;
    };
    
    // 公开接口
    return {
        init,
        renderCharacterList,
        unlockCharacter,
        getUnlockedCharacterCount
    };
})(); 