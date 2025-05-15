// 游戏数据
5454545
const gameData = {
    player: {
        gold: 0,
        inventory: {
            capacity: 20,
            used: 1,
            items: {
                wood: 0,
                stone: 0,
                copper: 0,
                iron: 0
            }
        },
        skills: {
            woodcutting: {
                level: 1,
                xp: 0,
                nextLevelXp: 83
            },
            mining: {
                level: 1,
                xp: 0,
                nextLevelXp: 83
            },
            farming: {
                level: 1,
                xp: 0,
                nextLevelXp: 83
            },
            town: {
                level: 4,
                xp: 0,
                nextLevelXp: 83
            }
        },
        combat: {
            attack: {
                level: 1,
                xp: 0,
                nextLevelXp: 83
            },
            strength: {
                level: 1,
                xp: 0,
                nextLevelXp: 83
            },
            defense: {
                level: 1,
                xp: 0,
                nextLevelXp: 83
            },
            health: {
                level: 10,
                xp: 0,
                nextLevelXp: 83
            },
            ranged: {
                level: 1,
                xp: 0,
                nextLevelXp: 83
            },
            magic: {
                level: 1,
                xp: 0,
                nextLevelXp: 83
            }
        }
    },
    resources: {
        trees: [
            {
                name: "普通树",
                xpPerAction: 10,
                timePerAction: 3,
                levelRequired: 1,
                unlocked: true
            },
            {
                name: "橡树",
                xpPerAction: 15,
                timePerAction: 4,
                levelRequired: 10,
                unlocked: false
            },
            {
                name: "柳树",
                xpPerAction: 25,
                timePerAction: 5,
                levelRequired: 25,
                unlocked: false
            },
            {
                name: "枫树",
                xpPerAction: 35,
                timePerAction: 6,
                levelRequired: 35,
                unlocked: false
            },
            {
                name: "红木",
                xpPerAction: 50,
                timePerAction: 7,
                levelRequired: 40,
                unlocked: false
            },
            {
                name: "松树",
                xpPerAction: 65,
                timePerAction: 8,
                levelRequired: 45,
                unlocked: false
            },
            {
                name: "魔法树",
                xpPerAction: 100,
                timePerAction: 10,
                levelRequired: 55,
                unlocked: false
            },
            {
                name: "远古树",
                xpPerAction: 150,
                timePerAction: 12,
                levelRequired: 60,
                unlocked: false
            }
        ],
        ores: [
            {
                name: "石头",
                xpPerAction: 10,
                timePerAction: 3,
                levelRequired: 1,
                unlocked: true,
                item: "stone"
            },
            {
                name: "铜矿",
                xpPerAction: 15,
                timePerAction: 4,
                levelRequired: 10,
                unlocked: false,
                item: "copper"
            },
            {
                name: "铁矿",
                xpPerAction: 25,
                timePerAction: 5,
                levelRequired: 20,
                unlocked: false,
                item: "iron"
            },
            {
                name: "银矿",
                xpPerAction: 40,
                timePerAction: 6,
                levelRequired: 30,
                unlocked: false,
                item: "silver"
            },
            {
                name: "金矿",
                xpPerAction: 65,
                timePerAction: 8,
                levelRequired: 40,
                unlocked: false,
                item: "gold"
            },
            {
                name: "秘银矿",
                xpPerAction: 80,
                timePerAction: 10,
                levelRequired: 55,
                unlocked: false,
                item: "mithril"
            }
        ]
    },
    town: {
        buildings: [
            {
                name: "木屋",
                level: 1,
                maxLevel: 5,
                cost: {
                    wood: 10,
                    stone: 5
                },
                benefits: {
                    population: 2
                },
                description: "基础住宅，提供少量人口"
            },
            {
                name: "伐木场",
                level: 0,
                maxLevel: 3,
                cost: {
                    wood: 20,
                    stone: 10
                },
                benefits: {
                    woodcuttingBonus: 0.1
                },
                description: "提高伐木效率",
                unlockRequirement: {
                    woodcutting: 5
                }
            },
            {
                name: "矿场",
                level: 0,
                maxLevel: 3,
                cost: {
                    wood: 15,
                    stone: 25
                },
                benefits: {
                    miningBonus: 0.1
                },
                description: "提高采矿效率",
                unlockRequirement: {
                    mining: 5
                }
            },
            {
                name: "市场",
                level: 0,
                maxLevel: 3,
                cost: {
                    wood: 30,
                    stone: 20
                },
                benefits: {
                    tradingBonus: 0.1
                },
                description: "提高交易效率，增加金币获取",
                unlockRequirement: {
                    town: 2
                }
            }
        ],
        population: 2,
        maxPopulation: 2,
        resources: {
            wood: 0,
            stone: 0,
            copper: 0,
            iron: 0
        }
    },
    currentActivity: {
        type: "woodcutting",
        resourceIndex: 0,
        inProgress: false,
        progress: 0,
        maxProgress: 100
    },
    gameTime: {
        hours: 0,
        minutes: 0,
        seconds: 47
    },
    // 添加当前活动页面状态
    currentPage: "woodcutting"
};

// 游戏状态
let isGameRunning = true;
let activeResourceElement = null;

// 初始化游戏
function initGame() {
    // 确保初始状态下采集活动是停止的
    gameData.currentActivity.inProgress = false;
    gameData.currentActivity.progress = 0;
    
    // 初始化时禁用采集按钮
    const gatheringBtn = document.getElementById('gathering-btn');
    if (gatheringBtn) {
        gatheringBtn.disabled = true;
        gatheringBtn.classList.add('start');
    }
    
    // 首先设置事件监听器
    setupEventListeners();
    
    // 然后根据当前页面类型显示对应页面
    switchPage(gameData.currentPage);
    
    // 启动游戏循环
    startGameLoop();
    
    // 启动游戏计时器
    startGameTimer();
    
    // 显示欢迎信息
    showMessage('欢迎来到隐秘圣所！选择一项技能开始你的冒险。');
}

// 更新UI
function updateUI() {
    // 更新金币
    document.getElementById('gold-amount').textContent = gameData.player.gold;
    
    // 更新库存
    document.getElementById('inventory-space').textContent = `${gameData.player.inventory.used} / ${gameData.player.inventory.capacity}`;
    
    // 更新战斗属性
    document.getElementById('attack-level').textContent = `${gameData.player.combat.attack.level} / 120`;
    document.getElementById('strength-level').textContent = `${gameData.player.combat.strength.level} / 120`;
    document.getElementById('defense-level').textContent = `${gameData.player.combat.defense.level} / 120`;
    document.getElementById('health-level').textContent = `${gameData.player.combat.health.level} / 120`;
    document.getElementById('ranged-level').textContent = `${gameData.player.combat.ranged.level} / 120`;
    document.getElementById('magic-level').textContent = `${gameData.player.combat.magic.level} / 120`;
    
    // 更新技能等级
    document.getElementById('woodcutting-level').textContent = `${gameData.player.skills.woodcutting.level} / 120`;
    document.getElementById('mining-level').textContent = `${gameData.player.skills.mining.level} / 120`;
    document.getElementById('farming-level').textContent = `${gameData.player.skills.farming.level} / 120`;
    document.getElementById('town-level').textContent = `${gameData.player.skills.town.level} / 120`;
    
    // 更新当前技能信息
    const currentSkill = gameData.currentPage === 'woodcutting' ? 'woodcutting' : 
                        gameData.currentPage === 'mining' ? 'mining' : 
                        gameData.currentPage === 'farming' ? 'farming' : 'town';
    
    document.getElementById('current-skill-level').textContent = gameData.player.skills[currentSkill].level;
    document.getElementById('current-skill-xp').textContent = gameData.player.skills[currentSkill].xp;
    
    // 更新资源进度条和按钮状态
    if (gameData.currentActivity.inProgress) {
        if (gameData.currentActivity.type === "woodcutting") {
            const progressPercent = (gameData.currentActivity.progress / gameData.currentActivity.maxProgress) * 100;
            const progressBar = document.getElementById('normal-tree-progress');
            if (progressBar) {
                progressBar.style.width = `${progressPercent}%`;
            }
        } else if (gameData.currentActivity.type === "mining") {
            const progressPercent = (gameData.currentActivity.progress / gameData.currentActivity.maxProgress) * 100;
            const progressBar = document.getElementById(`ore-progress-${gameData.currentActivity.resourceIndex}`);
            if (progressBar) {
                progressBar.style.width = `${progressPercent}%`;
            }
        }
    }
    
    // 更新采集按钮状态
    updateGatheringButton();
    
    // 更新当前活动图标和名称
    updateCurrentActivity();
}

// 更新当前活动显示
function updateCurrentActivity() {
    const activityIcon = document.querySelector('.activity-icon i');
    const activityName = document.querySelector('.activity-name');
    
    switch(gameData.currentPage) {
        case "woodcutting":
            activityIcon.className = "fas fa-tree";
            activityName.textContent = "伐木";
            break;
        case "mining":
            activityIcon.className = "fas fa-gem";
            activityName.textContent = "采矿";
            break;
        case "farming":
            activityIcon.className = "fas fa-seedling";
            activityName.textContent = "农务";
            break;
        case "town":
            activityIcon.className = "fas fa-city";
            activityName.textContent = "城镇";
            break;
        default:
            activityIcon.className = "fas fa-tree";
            activityName.textContent = "伐木";
    }
}

// 设置事件监听器
function setupEventListeners() {
    console.log('设置事件监听器');
    
    // 移除所有现有事件监听器
    const skillItems = document.querySelectorAll('.skill-item');
    const newSkillItems = [];
    
    // 技能点击事件 - 使用直接点击而不是事件委托
    skillItems.forEach(item => {
        console.log('为技能绑定事件:', item.textContent.trim());
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        newSkillItems.push(newItem);
    });
    
    // 为新元素添加事件监听器
    newSkillItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('点击了技能:', this.textContent.trim());
            
            // 移除所有激活状态
            newSkillItems.forEach(i => i.classList.remove('active'));
            // 添加当前项的激活状态
            this.classList.add('active');
            
            // 确定技能类型
            let skillType = '';
            const icon = this.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-tree')) {
                    skillType = 'woodcutting';
                } else if (icon.classList.contains('fa-gem')) {
                    skillType = 'mining';
                } else if (icon.classList.contains('fa-seedling')) {
                    skillType = 'farming';
                } else if (icon.classList.contains('fa-city')) {
                    skillType = 'town';
                }
            }
            
            console.log('切换到技能类型:', skillType);
            
            // 如果确定了技能类型，切换页面
            if (skillType) {
                switchPage(skillType);
            }
        });
    });
    
    // 其他事件监听器...
    setupButtonListeners();
}

// 设置按钮事件监听器
function setupButtonListeners() {
    // 采集按钮点击事件
    const gatheringBtn = document.getElementById('gathering-btn');
    if (gatheringBtn) {
        // 移除旧的事件监听器
        const newBtn = gatheringBtn.cloneNode(true);
        gatheringBtn.parentNode.replaceChild(newBtn, gatheringBtn);
        
        // 添加新的事件监听器
        newBtn.addEventListener('click', toggleGathering);
    }
    
    // 保存按钮点击事件
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        const newSaveBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
        newSaveBtn.addEventListener('click', saveGame);
    }
    
    // 清除数据按钮点击事件
    const clearDataBtn = document.getElementById('clear-data');
    if (clearDataBtn) {
        const newClearBtn = clearDataBtn.cloneNode(true);
        clearDataBtn.parentNode.replaceChild(newClearBtn, clearDataBtn);
        newClearBtn.addEventListener('click', clearGameData);
    }
    
    // 设置按钮点击事件
    const settingsBtn = document.querySelector('.settings-btn');
    if (settingsBtn) {
        const newSettingsBtn = settingsBtn.cloneNode(true);
        settingsBtn.parentNode.replaceChild(newSettingsBtn, settingsBtn);
        newSettingsBtn.addEventListener('click', openSettings);
    }
}

// 切换页面
function switchPage(pageType) {
    console.log('切换页面到:', pageType);
    
    // 停止当前活动
    if (gameData.currentActivity.inProgress) {
        stopResourceGathering();
    }
    
    // 保存当前页面类型
    gameData.currentPage = pageType;
    
    // 清空资源网格
    const resourceGrid = document.querySelector('.resource-grid');
    if (resourceGrid) {
        resourceGrid.innerHTML = '';
    }
    
    // 根据页面类型显示不同内容
    switch(pageType) {
        case 'woodcutting':
            console.log('显示伐木页面');
            showWoodcuttingPage();
            break;
        case 'mining':
            console.log('显示采矿页面');
            showMiningPage();
            break;
        case 'town':
            console.log('显示城镇页面');
            showTownPage();
            break;
        case 'farming':
            console.log('显示农务页面');
            const farmingMsg = document.createElement('div');
            farmingMsg.className = 'feature-soon';
            farmingMsg.innerHTML = `
                <div class="feature-icon"><i class="fas fa-seedling fa-4x"></i></div>
                <h2>农务功能</h2>
                <p>正在开发中，敬请期待！</p>
            `;
            resourceGrid.appendChild(farmingMsg);
            showMessage(`${getSkillDisplayName(pageType)} 功能正在开发中，敬请期待！`);
            break;
        default:
            console.log('显示默认页面');
            const defaultMsg = document.createElement('div');
            defaultMsg.className = 'feature-soon';
            defaultMsg.innerHTML = `
                <div class="feature-icon"><i class="fas fa-tools fa-4x"></i></div>
                <h2>${getSkillDisplayName(pageType)}功能</h2>
                <p>正在开发中，敬请期待！</p>
            `;
            resourceGrid.appendChild(defaultMsg);
            showMessage(`${getSkillDisplayName(pageType)} 功能正在开发中，敬请期待！`);
            break;
    }
    
    // 更新UI显示
    updateCurrentActivity();
    updateUI();
}

// 设置伐木页面的事件
function setupWoodcuttingEvents() {
    console.log('设置伐木页面事件');
    
    // 找到所有非锁定的资源项
    const resourceItems = document.querySelectorAll('.resource-item:not(.locked)');
    console.log('找到可点击资源项:', resourceItems.length);
    
    // 移除并重新绑定事件
    resourceItems.forEach((item, index) => {
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        newItem.addEventListener('click', function() {
            console.log('点击了伐木资源:', index);
            
            // 移除其他资源的active类
            document.querySelectorAll('.resource-item').forEach(i => i.classList.remove('active'));
            
            // 添加当前资源的active类
            this.classList.add('active');
            activeResourceElement = this;
            
            // 获取资源索引
            const resourceIndex = Array.from(this.parentNode.children).indexOf(this);
            console.log('资源索引:', resourceIndex);
            
            // 显示信息
            showMessage(`已选择 ${gameData.resources.trees[resourceIndex].name}，点击"开始采集"按钮开始采集。`);
            
            // 启用采集按钮
            const gatheringBtn = document.getElementById('gathering-btn');
            if (gatheringBtn) {
                gatheringBtn.disabled = false;
                updateGatheringButton();
            }
        });
    });
    
    // 重新绑定采集按钮事件
    const gatheringBtn = document.getElementById('gathering-btn');
    if (gatheringBtn) {
        console.log('绑定采集按钮事件');
        const newBtn = gatheringBtn.cloneNode(true);
        gatheringBtn.parentNode.replaceChild(newBtn, gatheringBtn);
        newBtn.addEventListener('click', function() {
            console.log('点击了采集按钮');
            toggleGathering();
        });
    } else {
        console.error('找不到采集按钮');
    }
}

// 显示伐木页面
function showWoodcuttingPage() {
    console.log('显示伐木页面');
    showMessage('欢迎来到伐木区域，点击树木开始采集资源。');
    
    // 创建伐木页面内容
    const resourceGrid = document.querySelector('.resource-grid');
    if (!resourceGrid) {
        console.error('找不到资源网格元素');
        return;
    }
    
    // 清空资源网格
    resourceGrid.innerHTML = '';
    
    // 添加普通树资源
    const normalTree = document.createElement('div');
    normalTree.className = 'resource-item active';
    normalTree.setAttribute('data-type', 'woodcutting');
    normalTree.innerHTML = `
        <div class="resource-header">
            <span class="resource-name">普通树</span>
        </div>
        <div class="resource-image">
            <i class="fas fa-tree fa-4x"></i>
        </div>
        <div class="resource-info">
            10 经验 / 3 秒
        </div>
        <div class="resource-progress">
            <div class="progress-bar" id="normal-tree-progress"></div>
        </div>
        <div class="resource-xp">
            ${gameData.player.skills.woodcutting.xp} / ${gameData.player.skills.woodcutting.nextLevelXp}
        </div>
        <div class="resource-actions">
            <button class="action-btn" id="gathering-btn">
                <i class="fas fa-play" id="gathering-icon"></i> <span id="gathering-text">开始采集</span>
            </button>
        </div>
    `;
    resourceGrid.appendChild(normalTree);
    
    // 添加其他锁定的树木
    for (let i = 1; i < gameData.resources.trees.length; i++) {
        const tree = gameData.resources.trees[i];
        const treeElement = document.createElement('div');
        treeElement.className = 'resource-item locked';
        treeElement.setAttribute('data-type', 'woodcutting');
        treeElement.innerHTML = `
            <div class="resource-header">
                <span class="resource-name">Locked</span>
            </div>
            <div class="resource-image">
                <i class="fas fa-lock fa-4x"></i>
            </div>
            <div class="resource-info">
                等级 ${tree.levelRequired}
            </div>
        `;
        resourceGrid.appendChild(treeElement);
    }
    
    // 更新当前技能信息
    const currentSkillLevel = document.getElementById('current-skill-level');
    const currentSkillXp = document.getElementById('current-skill-xp');
    if (currentSkillLevel && currentSkillXp) {
        currentSkillLevel.textContent = gameData.player.skills.woodcutting.level;
        currentSkillXp.textContent = gameData.player.skills.woodcutting.xp;
    }
    
    // 绑定事件
    setupWoodcuttingEvents();
}

// 显示采矿页面
function showMiningPage() {
    console.log('显示采矿页面');
    showMessage('欢迎来到采矿区域，点击矿石开始采集资源。');
    
    // 创建采矿页面内容
    const resourceGrid = document.querySelector('.resource-grid');
    if (!resourceGrid) {
        console.error('找不到资源网格元素');
        return;
    }
    
    // 清空资源网格
    resourceGrid.innerHTML = '';
    
    // 更新当前技能信息
    const currentSkillLevel = document.getElementById('current-skill-level');
    const currentSkillXp = document.getElementById('current-skill-xp');
    if (currentSkillLevel && currentSkillXp) {
        currentSkillLevel.textContent = gameData.player.skills.mining.level;
        currentSkillXp.textContent = gameData.player.skills.mining.xp;
    }
    
    // 添加矿石资源
    if (!gameData.resources.ores || gameData.resources.ores.length === 0) {
        console.error('没有矿石数据');
        resourceGrid.innerHTML = '<div class="error-message">矿石数据加载失败</div>';
        return;
    }
    
    console.log('添加矿石:', gameData.resources.ores.length);
    
    gameData.resources.ores.forEach((ore, index) => {
        const isUnlocked = ore.unlocked || gameData.player.skills.mining.level >= ore.levelRequired;
        console.log(`矿石 ${index}: ${ore.name}, 解锁: ${isUnlocked}`);
        
        const resourceItem = document.createElement('div');
        resourceItem.className = `resource-item ${isUnlocked ? '' : 'locked'}`;
        resourceItem.setAttribute('data-type', 'mining');
        if (index === 0) resourceItem.classList.add('active');
        
        resourceItem.innerHTML = `
            <div class="resource-header">
                <span class="resource-name">${isUnlocked ? ore.name : 'Locked'}</span>
            </div>
            <div class="resource-image">
                <i class="fas ${isUnlocked ? 'fa-gem' : 'fa-lock'} fa-4x"></i>
            </div>
            <div class="resource-info">
                ${isUnlocked ? `${ore.xpPerAction} 经验 / ${ore.timePerAction} 秒` : `等级 ${ore.levelRequired}`}
            </div>
            ${isUnlocked ? `
            <div class="resource-progress">
                <div class="progress-bar" id="ore-progress-${index}"></div>
            </div>
            <div class="resource-xp">
                ${gameData.player.skills.mining.xp} / ${gameData.player.skills.mining.nextLevelXp}
            </div>
            <div class="resource-actions">
                <button class="action-btn start" id="mining-btn-${index}">
                    <i class="fas fa-play"></i> 开始采集
                </button>
            </div>
            ` : ''}
        `;
        
        resourceGrid.appendChild(resourceItem);
        
        // 添加点击事件
        if (isUnlocked) {
            const miningBtn = resourceItem.querySelector(`#mining-btn-${index}`);
            if (miningBtn) {
                console.log(`为矿石 ${index} 添加按钮点击事件`);
                miningBtn.addEventListener('click', function() {
                    console.log(`点击开始采集矿石 ${index}`);
                    startMining(index);
                });
            }
            
            resourceItem.addEventListener('click', function() {
                console.log(`选择矿石 ${index}`);
                document.querySelectorAll('.resource-item').forEach(item => item.classList.remove('active'));
                this.classList.add('active');
                showMessage(`已选择 ${ore.name}，点击"开始采集"按钮开始采集。`);
            });
        }
    });
}

// 显示城镇页面
function showTownPage() {
    showMessage('欢迎来到城镇管理，这里可以建造和升级建筑。');
    
    // 创建城镇页面内容
    const mainContent = document.querySelector('.main-content');
    const contentHeader = mainContent.querySelector('.content-header');
    const contentMessage = mainContent.querySelector('.content-message');
    const resourceGrid = mainContent.querySelector('.resource-grid');
    
    // 更新技能信息
    const currentSkillLevel = contentHeader.querySelector('#current-skill-level');
    const currentSkillXp = contentHeader.querySelector('#current-skill-xp');
    currentSkillLevel.textContent = gameData.player.skills.town.level;
    currentSkillXp.textContent = gameData.player.skills.town.xp;
    
    // 清空资源网格
    resourceGrid.innerHTML = '';
    
    // 隐藏伐木采集按钮
    const gatheringBtn = document.getElementById('gathering-btn');
    if (gatheringBtn) {
        gatheringBtn.style.display = 'none';
    }
    
    // 添加城镇信息
    const townInfoDiv = document.createElement('div');
    townInfoDiv.className = 'town-info';
    townInfoDiv.innerHTML = `
        <div class="town-stats">
            <div class="town-stat">
                <i class="fas fa-users"></i> 人口: ${gameData.town.population} / ${gameData.town.maxPopulation}
            </div>
            <div class="town-stat">
                <i class="fas fa-tree"></i> 木材: ${gameData.town.resources.wood}
            </div>
            <div class="town-stat">
                <i class="fas fa-gem"></i> 石头: ${gameData.town.resources.stone}
            </div>
        </div>
    `;
    resourceGrid.appendChild(townInfoDiv);
    
    // 添加建筑
    gameData.town.buildings.forEach((building, index) => {
        const isUnlocked = building.level > 0 || !building.unlockRequirement || 
                          (building.unlockRequirement.woodcutting && gameData.player.skills.woodcutting.level >= building.unlockRequirement.woodcutting) ||
                          (building.unlockRequirement.mining && gameData.player.skills.mining.level >= building.unlockRequirement.mining) ||
                          (building.unlockRequirement.town && gameData.player.skills.town.level >= building.unlockRequirement.town);
        
        const canUpgrade = building.level < building.maxLevel && 
                          gameData.town.resources.wood >= building.cost.wood &&
                          gameData.town.resources.stone >= building.cost.stone;
        
        const buildingItem = document.createElement('div');
        buildingItem.className = `resource-item ${isUnlocked ? '' : 'locked'}`;
        
        buildingItem.innerHTML = `
            <div class="resource-header">
                <span class="resource-name">${building.name} ${building.level > 0 ? `(等级 ${building.level})` : ''}</span>
            </div>
            <div class="resource-image">
                <i class="fas ${getBuildingIcon(building.name)} fa-4x"></i>
            </div>
            <div class="resource-info">
                ${building.description}
            </div>
            ${isUnlocked ? `
            <div class="building-cost">
                <div><i class="fas fa-tree"></i> 木材: ${building.cost.wood}</div>
                <div><i class="fas fa-gem"></i> 石头: ${building.cost.stone}</div>
            </div>
            <div class="resource-actions">
                <button class="action-btn ${canUpgrade ? 'start' : ''}" id="building-btn-${index}" 
                        ${canUpgrade ? '' : 'disabled'}>
                    <i class="fas fa-arrow-up"></i> ${building.level > 0 ? '升级' : '建造'}
                </button>
            </div>
            ` : `
            <div class="resource-info">
                需要: ${getUnlockRequirementText(building.unlockRequirement)}
            </div>
            `}
        `;
        
        resourceGrid.appendChild(buildingItem);
        
        // 添加点击事件
        if (isUnlocked) {
            const upgradeBtn = buildingItem.querySelector(`#building-btn-${index}`);
            if (upgradeBtn) {
                upgradeBtn.addEventListener('click', function() {
                    upgradeBuilding(index);
                });
            }
        }
    });
}

// 获取建筑图标
function getBuildingIcon(buildingName) {
    switch(buildingName) {
        case '木屋': return 'fa-home';
        case '伐木场': return 'fa-tree';
        case '矿场': return 'fa-gem';
        case '市场': return 'fa-store';
        default: return 'fa-building';
    }
}

// 获取解锁需求文本
function getUnlockRequirementText(requirement) {
    if (!requirement) return '无';
    
    const requirements = [];
    if (requirement.woodcutting) {
        requirements.push(`伐木等级 ${requirement.woodcutting}`);
    }
    if (requirement.mining) {
        requirements.push(`采矿等级 ${requirement.mining}`);
    }
    if (requirement.town) {
        requirements.push(`城镇等级 ${requirement.town}`);
    }
    
    return requirements.join(', ');
}

// 切换采集状态
function toggleGathering() {
    if (gameData.currentActivity.inProgress) {
        // 如果正在采集，则停止
        stopResourceGathering();
    } else {
        // 如果没有采集，则开始
        startResourceGathering(0); // 假设点击的是第一个资源
    }
    
    // 更新按钮状态
    updateGatheringButton();
}

// 更新采集按钮状态
function updateGatheringButton() {
    const gatheringBtn = document.getElementById('gathering-btn');
    const gatheringIcon = document.getElementById('gathering-icon');
    const gatheringText = document.getElementById('gathering-text');
    
    if (gameData.currentActivity.inProgress) {
        // 如果正在采集，显示停止状态
        gatheringBtn.classList.remove('start');
        gatheringBtn.classList.add('stop');
        gatheringIcon.className = 'fas fa-hand-paper';
        gatheringText.textContent = '停止采集';
    } else {
        // 如果没有采集，显示开始状态
        gatheringBtn.classList.remove('stop');
        gatheringBtn.classList.add('start');
        gatheringIcon.className = 'fas fa-play';
        gatheringText.textContent = '开始采集';
        
        // 如果没有选中资源，禁用按钮
        gatheringBtn.disabled = !activeResourceElement;
    }
}

// 开始资源采集
function startResourceGathering(resourceIndex) {
    const resource = gameData.resources.trees[resourceIndex];
    
    // 检查是否已解锁
    if (!resource.unlocked) {
        showMessage(`需要达到 ${resource.levelRequired} 级才能采集 ${resource.name}`);
        return;
    }
    
    // 设置当前活动
    gameData.currentActivity = {
        type: "woodcutting",
        resourceIndex: resourceIndex,
        inProgress: true,
        progress: 0,
        maxProgress: 100
    };
    
    showMessage(`正在采集 ${resource.name}...`);
}

// 停止资源采集
function stopResourceGathering() {
    if (gameData.currentActivity.inProgress) {
        // 设置活动状态为非进行中
        gameData.currentActivity.inProgress = false;
        // 重置进度
        gameData.currentActivity.progress = 0;
        
        // 更新进度条
        document.getElementById('normal-tree-progress').style.width = '0%';
        
        // 确保立即更新UI
        updateUI();
        
        showMessage('已停止采集资源。');
        
        // 保存游戏状态，确保停止状态被保存
        saveGame();
    }
}

// 更新资源采集进度
function updateResourceGathering(deltaTime) {
    // 确保只有在活动进行中时才更新进度
    if (!gameData.currentActivity.inProgress) {
        return;
    }
    
    const resource = gameData.resources.trees[gameData.currentActivity.resourceIndex];
    const progressPerSecond = 100 / resource.timePerAction;
    
    // 更新进度
    gameData.currentActivity.progress += progressPerSecond * (deltaTime / 1000);
    
    // 检查是否完成
    if (gameData.currentActivity.progress >= gameData.currentActivity.maxProgress) {
        completeResourceGathering();
    } else {
        // 只在进度变化时更新UI
        updateUI();
    }
}

// 完成资源采集
function completeResourceGathering() {
    const resource = gameData.resources.trees[gameData.currentActivity.resourceIndex];
    
    // 增加经验值
    gameData.player.skills.woodcutting.xp += resource.xpPerAction;
    
    // 检查是否升级
    checkLevelUp('woodcutting');
    
    // 增加物品
    gameData.player.inventory.items.wood += 1;
    gameData.player.inventory.used = Object.values(gameData.player.inventory.items).reduce((a, b) => a + b, 0);
    
    // 重置进度
    gameData.currentActivity.progress = 0;
    
    showMessage(`获得了木材和 ${resource.xpPerAction} 点经验值！`);
    
    // 自动继续采集
    if (gameData.currentActivity.inProgress) {
        // 继续采集
        updateUI();
    }
}

// 检查技能升级
function checkLevelUp(skillName) {
    const skill = gameData.player.skills[skillName];
    
    if (skill.xp >= skill.nextLevelXp) {
        skill.level += 1;
        skill.xp -= skill.nextLevelXp;
        skill.nextLevelXp = calculateNextLevelXp(skill.level);
        
        showMessage(`恭喜！${getSkillDisplayName(skillName)} 技能升级到 ${skill.level} 级！`);
        
        // 检查是否解锁新资源
        if (skillName === 'woodcutting') {
            checkWoodcuttingUnlocks();
        } else if (skillName === 'mining') {
            checkMiningUnlocks();
        }
        
        // 更新UI
        updateUI();
    }
}

// 获取技能显示名称
function getSkillDisplayName(skillName) {
    switch(skillName) {
        case 'woodcutting': return '伐木';
        case 'mining': return '采矿';
        case 'farming': return '农务';
        case 'town': return '城镇';
        default: return skillName;
    }
}

// 检查伐木解锁
function checkWoodcuttingUnlocks() {
    const woodcuttingLevel = gameData.player.skills.woodcutting.level;
    
    gameData.resources.trees.forEach(tree => {
        if (!tree.unlocked && woodcuttingLevel >= tree.levelRequired) {
            tree.unlocked = true;
            showMessage(`解锁了新的树木：${tree.name}！`);
        }
    });
}

// 检查采矿解锁
function checkMiningUnlocks() {
    const miningLevel = gameData.player.skills.mining.level;
    
    gameData.resources.ores.forEach(ore => {
        if (!ore.unlocked && miningLevel >= ore.levelRequired) {
            ore.unlocked = true;
            showMessage(`解锁了新的矿石：${ore.name}！`);
        }
    });
}

// 计算下一级所需经验值
function calculateNextLevelXp(level) {
    // 简单的经验值计算公式
    return Math.floor(83 * Math.pow(1.1, level - 1));
}

// 显示消息
function showMessage(message) {
    const messageElement = document.querySelector('.content-message');
    messageElement.textContent = message;
    
    // 添加一个简单的动画效果
    messageElement.style.animation = 'none';
    setTimeout(() => {
        messageElement.style.animation = 'pulse 0.5s';
    }, 10);
}

// 保存游戏
function saveGame() {
    localStorage.setItem('sneakySanctuaryGame', JSON.stringify(gameData));
    showMessage('游戏已保存！');
}

// 加载游戏
function loadGame() {
    const savedGame = localStorage.getItem('sneakySanctuaryGame');
    if (savedGame) {
        try {
            const parsedData = JSON.parse(savedGame);
            Object.assign(gameData, parsedData);
            
            // 确保UI更新
            updateUI();
            
            showMessage('游戏已加载！');
        } catch (error) {
            console.error('加载游戏数据时出错:', error);
            showMessage('加载游戏数据时出错，使用默认数据。');
        }
    }
}

// 打开设置
function openSettings() {
    showMessage('设置功能尚未实现');
}

// 清除游戏数据
function clearGameData() {
    if (confirm('确定要清除所有游戏数据吗？此操作不可恢复！')) {
        // 停止当前活动
        stopResourceGathering();
        
        // 清除localStorage中的游戏数据
        localStorage.removeItem('sneakySanctuaryGame');
        
        // 重置游戏数据到初始状态
        resetGameData();
        
        // 更新UI
        updateUI();
        
        showMessage('游戏数据已清除！');
    }
}

// 重置游戏数据到初始状态
function resetGameData() {
    // 重置玩家数据
    gameData.player = {
        gold: 0,
        inventory: {
            capacity: 20,
            used: 1,
            items: {
                wood: 0,
                stone: 0,
                copper: 0,
                iron: 0
            }
        },
        skills: {
            woodcutting: {
                level: 1,
                xp: 0,
                nextLevelXp: 83
            },
            mining: {
                level: 1,
                xp: 0,
                nextLevelXp: 83
            },
            farming: {
                level: 1,
                xp: 0,
                nextLevelXp: 83
            },
            town: {
                level: 4,
                xp: 0,
                nextLevelXp: 83
            }
        },
        combat: {
            attack: {
                level: 1,
                xp: 0,
                nextLevelXp: 83
            },
            strength: {
                level: 1,
                xp: 0,
                nextLevelXp: 83
            },
            defense: {
                level: 1,
                xp: 0,
                nextLevelXp: 83
            },
            health: {
                level: 10,
                xp: 0,
                nextLevelXp: 83
            },
            ranged: {
                level: 1,
                xp: 0,
                nextLevelXp: 83
            },
            magic: {
                level: 1,
                xp: 0,
                nextLevelXp: 83
            }
        }
    };
    
    // 重置资源解锁状态
    gameData.resources.trees.forEach((tree, index) => {
        tree.unlocked = index === 0; // 只有第一个树（普通树）是解锁的
    });
    
    gameData.resources.ores.forEach((ore, index) => {
        ore.unlocked = index === 0; // 只有第一个矿石（石头）是解锁的
    });
    
    // 重置城镇数据
    gameData.town = {
        buildings: [
            {
                name: "木屋",
                level: 1,
                maxLevel: 5,
                cost: {
                    wood: 10,
                    stone: 5
                },
                benefits: {
                    population: 2
                },
                description: "基础住宅，提供少量人口"
            },
            {
                name: "伐木场",
                level: 0,
                maxLevel: 3,
                cost: {
                    wood: 20,
                    stone: 10
                },
                benefits: {
                    woodcuttingBonus: 0.1
                },
                description: "提高伐木效率",
                unlockRequirement: {
                    woodcutting: 5
                }
            },
            {
                name: "矿场",
                level: 0,
                maxLevel: 3,
                cost: {
                    wood: 15,
                    stone: 25
                },
                benefits: {
                    miningBonus: 0.1
                },
                description: "提高采矿效率",
                unlockRequirement: {
                    mining: 5
                }
            },
            {
                name: "市场",
                level: 0,
                maxLevel: 3,
                cost: {
                    wood: 30,
                    stone: 20
                },
                benefits: {
                    tradingBonus: 0.1
                },
                description: "提高交易效率，增加金币获取",
                unlockRequirement: {
                    town: 2
                }
            }
        ],
        population: 2,
        maxPopulation: 2,
        resources: {
            wood: 0,
            stone: 0,
            copper: 0,
            iron: 0
        }
    };
    
    // 重置当前活动
    gameData.currentActivity = {
        type: "woodcutting",
        resourceIndex: 0,
        inProgress: false,
        progress: 0,
        maxProgress: 100
    };
    
    // 重置游戏时间
    gameData.gameTime = {
        hours: 0,
        minutes: 0,
        seconds: 0
    };
    
    // 保持当前页面
    gameData.currentPage = "woodcutting";
}

// 游戏主循环
function startGameLoop() {
    let lastTime = Date.now();
    
    function gameLoop() {
        if (!isGameRunning) return;
        
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        
        updateResourceGathering(deltaTime);
        
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
}

// 游戏计时器
function startGameTimer() {
    setInterval(() => {
        gameData.gameTime.seconds++;
        
        if (gameData.gameTime.seconds >= 60) {
            gameData.gameTime.seconds = 0;
            gameData.gameTime.minutes++;
            
            if (gameData.gameTime.minutes >= 60) {
                gameData.gameTime.minutes = 0;
                gameData.gameTime.hours++;
            }
        }
        
        updateGameTimer();
    }, 1000);
}

// 更新游戏计时器显示
function updateGameTimer() {
    const { hours, minutes, seconds } = gameData.gameTime;
    const timerElement = document.querySelector('.timer');
    timerElement.textContent = `${hours.toString().padStart(2, '0')}h${minutes.toString().padStart(2, '0')}m${seconds.toString().padStart(2, '0')}s`;
}

// 开始采矿
function startMining(oreIndex) {
    const ore = gameData.resources.ores[oreIndex];
    
    // 检查是否已解锁
    if (!ore.unlocked && gameData.player.skills.mining.level < ore.levelRequired) {
        showMessage(`需要达到采矿等级 ${ore.levelRequired} 才能开采 ${ore.name}`);
        return;
    }
    
    // 设置当前活动
    gameData.currentActivity = {
        type: "mining",
        resourceIndex: oreIndex,
        inProgress: true,
        progress: 0,
        maxProgress: 100
    };
    
    // 更新按钮状态
    updateMiningButtons(oreIndex, true);
    
    showMessage(`正在开采 ${ore.name}...`);
    
    // 开始进度更新
    updateMiningProgress();
}

// 停止采矿
function stopMining() {
    if (gameData.currentActivity.inProgress && gameData.currentActivity.type === "mining") {
        // 设置活动状态为非进行中
        gameData.currentActivity.inProgress = false;
        // 重置进度
        gameData.currentActivity.progress = 0;
        
        // 更新按钮状态
        updateMiningButtons(gameData.currentActivity.resourceIndex, false);
        
        // 更新进度条
        const progressBar = document.getElementById(`ore-progress-${gameData.currentActivity.resourceIndex}`);
        if (progressBar) {
            progressBar.style.width = '0%';
        }
        
        showMessage('已停止采矿。');
        
        // 保存游戏状态
        saveGame();
    }
}

// 更新采矿按钮状态
function updateMiningButtons(activeIndex, isActive) {
    gameData.resources.ores.forEach((ore, index) => {
        const button = document.getElementById(`mining-btn-${index}`);
        if (button) {
            if (index === activeIndex && isActive) {
                button.innerHTML = '<i class="fas fa-hand-paper"></i> 停止采集';
                button.classList.remove('start');
                button.classList.add('stop');
                button.onclick = function() { stopMining(); };
            } else {
                button.innerHTML = '<i class="fas fa-play"></i> 开始采集';
                button.classList.remove('stop');
                button.classList.add('start');
                button.onclick = function() { startMining(index); };
                button.disabled = isActive;
            }
        }
    });
}

// 更新采矿进度
function updateMiningProgress() {
    if (!gameData.currentActivity.inProgress || gameData.currentActivity.type !== "mining") return;
    
    const ore = gameData.resources.ores[gameData.currentActivity.resourceIndex];
    const progressPerSecond = 100 / ore.timePerAction;
    
    // 更新进度
    gameData.currentActivity.progress += progressPerSecond / 10; // 更新频率为100ms
    
    // 更新进度条
    const progressBar = document.getElementById(`ore-progress-${gameData.currentActivity.resourceIndex}`);
    if (progressBar) {
        const progressPercent = (gameData.currentActivity.progress / gameData.currentActivity.maxProgress) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
    
    // 检查是否完成
    if (gameData.currentActivity.progress >= gameData.currentActivity.maxProgress) {
        completeMining();
    } else {
        // 继续更新
        setTimeout(updateMiningProgress, 100);
    }
}

// 完成采矿
function completeMining() {
    const ore = gameData.resources.ores[gameData.currentActivity.resourceIndex];
    
    // 增加经验值
    gameData.player.skills.mining.xp += ore.xpPerAction;
    
    // 检查是否升级
    checkLevelUp('mining');
    
    // 增加物品
    if (gameData.player.inventory.items[ore.item] !== undefined) {
        gameData.player.inventory.items[ore.item] += 1;
    } else {
        gameData.player.inventory.items[ore.item] = 1;
    }
    
    // 更新库存使用量
    gameData.player.inventory.used = Object.values(gameData.player.inventory.items).reduce((a, b) => a + b, 0);
    
    // 重置进度
    gameData.currentActivity.progress = 0;
    
    // 更新UI
    const xpDisplay = document.querySelector(`.resource-item.active .resource-xp`);
    if (xpDisplay) {
        xpDisplay.textContent = `${gameData.player.skills.mining.xp} / ${gameData.player.skills.mining.nextLevelXp}`;
    }
    
    showMessage(`获得了${ore.name}和 ${ore.xpPerAction} 点采矿经验值！`);
    
    // 继续采矿
    if (gameData.currentActivity.inProgress) {
        updateMiningProgress();
    }
}

// 升级建筑
function upgradeBuilding(buildingIndex) {
    const building = gameData.town.buildings[buildingIndex];
    
    // 检查是否可以升级
    if (building.level >= building.maxLevel) {
        showMessage(`${building.name}已经达到最高等级！`);
        return;
    }
    
    // 检查资源是否足够
    if (gameData.town.resources.wood < building.cost.wood || 
        gameData.town.resources.stone < building.cost.stone) {
        showMessage(`资源不足，无法升级${building.name}！`);
        return;
    }
    
    // 扣除资源
    gameData.town.resources.wood -= building.cost.wood;
    gameData.town.resources.stone -= building.cost.stone;
    
    // 升级建筑
    building.level += 1;
    
    // 应用建筑效果
    applyBuildingEffects(building);
    
    // 增加城镇经验
    gameData.player.skills.town.xp += 20;
    checkLevelUp('town');
    
    // 更新UI
    showTownPage();
    
    showMessage(`成功升级${building.name}到等级${building.level}！`);
    
    // 保存游戏
    saveGame();
}

// 应用建筑效果
function applyBuildingEffects(building) {
    switch(building.name) {
        case '木屋':
            gameData.town.maxPopulation = 2 * building.level;
            gameData.town.population = gameData.town.maxPopulation;
            break;
        case '伐木场':
            // 伐木效率提升在采集时计算
            break;
        case '矿场':
            // 采矿效率提升在采集时计算
            break;
        case '市场':
            // 交易效率提升在交易时计算
            break;
    }
}

// 尝试加载保存的游戏，然后初始化
window.onload = function() {
    loadGame();
    initGame();
}; 