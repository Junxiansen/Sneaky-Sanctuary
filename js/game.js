// 游戏主模块
const gameModule = (() => {
    // 私有变量
    let gameLoaded = false;
    let gameRunning = false;
    let gameInterval = null;
    let buildings = [];
    const GAME_TICK_INTERVAL = 1000; // 游戏时钟间隔（毫秒）
    const SAVE_INTERVAL = 60000; // 自动保存间隔（毫秒）
    
    // 初始化游戏
    const init = () => {
        console.log('初始化游戏...');
        
        // 模拟加载进度
        simulateLoading(() => {
            // 加载完成后显示主菜单
            document.getElementById('loading-screen').classList.add('hidden');
            document.getElementById('main-menu').classList.remove('hidden');
            
            // 检查是否有保存的游戏
            if (localStorage.getItem('sneakySanctuarySave')) {
                document.getElementById('continue-btn').disabled = false;
            }
            
            // 添加按钮事件监听
            addEventListeners();
        });
    };
    
    // 模拟加载进度
    const simulateLoading = (callback) => {
        let progress = 0;
        const progressBar = document.querySelector('.loading-progress');
        
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                setTimeout(callback, 500);
            }
            progressBar.style.width = `${progress}%`;
        }, 300);
    };
    
    // 添加事件监听器
    const addEventListeners = () => {
        // 主菜单按钮
        document.getElementById('new-game-btn').addEventListener('click', startNewGame);
        document.getElementById('continue-btn').addEventListener('click', continueGame);
        document.getElementById('settings-btn').addEventListener('click', showSettings);
        document.getElementById('credits-btn').addEventListener('click', showCredits);
        
        // 游戏内按钮
        document.getElementById('save-btn').addEventListener('click', saveGame);
        document.getElementById('menu-btn').addEventListener('click', showInGameMenu);
        
        // 导航项点击事件
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const targetView = e.currentTarget.getAttribute('data-target');
                switchView(targetView);
            });
        });
        
        // 对话框关闭按钮
        document.querySelector('.close-dialog-btn').addEventListener('click', closeDialog);
        document.getElementById('dialog-confirm-btn').addEventListener('click', closeDialog);
        document.getElementById('dialog-cancel-btn').addEventListener('click', closeDialog);
    };
    
    // 开始新游戏
    const startNewGame = () => {
        console.log('开始新游戏...');
        
        // 隐藏主菜单，显示游戏界面
        document.getElementById('main-menu').classList.add('hidden');
        document.getElementById('game-main').classList.remove('hidden');
        
        // 初始化游戏数据
        initGameData();
        
        // 初始化各模块
        charactersModule.init();
        tasksModule.init();
        buildingsModule.init();
        storyModule.init();
        
        // 更新资源显示
        updateResourceDisplay();
        
        // 开始游戏循环
        startGameLoop();
        
        // 显示欢迎对话框
        showDialog('欢迎来到隐秘避难所', '你发现了这个被遗忘的避难所，现在它由你来管理。完成任务，招募居民，建造设施，揭开避难所的秘密！', null, false);
    };
    
    // 继续游戏
    const continueGame = () => {
        console.log('继续游戏...');
        
        // 尝试加载保存的游戏数据
        if (loadGame()) {
            // 隐藏主菜单，显示游戏界面
            document.getElementById('main-menu').classList.add('hidden');
            document.getElementById('game-main').classList.remove('hidden');
            
            // 获取建筑数据
            buildings = gameData.buildings || [];
            
            // 初始化各模块
            charactersModule.init();
            tasksModule.init();
            buildingsModule.init();
            storyModule.init();
            
            // 生成地图
            generateMap();
            
            // 更新资源显示
            updateResourceDisplay();
            
            // 开始游戏循环
            startGameLoop();
            
            // 显示欢迎回来对话框
            showDialog('欢迎回来', '你回到了隐秘避难所。在你离开的这段时间，一切都保持原样。', null, false);
        } else {
            // 如果加载失败，显示错误消息
            showDialog('加载失败', '无法加载保存的游戏数据。可能是保存文件已损坏或不存在。', null, false);
        }
    };
    
    // 显示设置
    const showSettings = () => {
        const settingsContent = `
            <div class="settings-container">
                <div class="setting-item">
                    <label for="sound-toggle">音效</label>
                    <input type="checkbox" id="sound-toggle" ${gameData.settings.soundEnabled ? 'checked' : ''}>
                </div>
                <div class="setting-item">
                    <label for="music-toggle">音乐</label>
                    <input type="checkbox" id="music-toggle" ${gameData.settings.musicEnabled ? 'checked' : ''}>
                </div>
                <div class="setting-item">
                    <label for="notifications-toggle">通知</label>
                    <input type="checkbox" id="notifications-toggle" ${gameData.settings.notificationsEnabled ? 'checked' : ''}>
                </div>
                <div class="setting-item">
                    <label for="autosave-toggle">自动保存</label>
                    <input type="checkbox" id="autosave-toggle" ${gameData.settings.autoSave ? 'checked' : ''}>
                </div>
            </div>
        `;
        
        showDialog('游戏设置', settingsContent, () => {
            // 添加设置项的事件监听
            document.getElementById('sound-toggle').addEventListener('change', (e) => {
                gameData.settings.soundEnabled = e.target.checked;
                saveGame();
            });
            
            document.getElementById('music-toggle').addEventListener('change', (e) => {
                gameData.settings.musicEnabled = e.target.checked;
                saveGame();
            });
            
            document.getElementById('notifications-toggle').addEventListener('change', (e) => {
                gameData.settings.notificationsEnabled = e.target.checked;
                saveGame();
            });
            
            document.getElementById('autosave-toggle').addEventListener('change', (e) => {
                gameData.settings.autoSave = e.target.checked;
                saveGame();
            });
        });
    };
    
    // 显示制作团队
    const showCredits = () => {
        const creditsContent = `
            <div class="credits-container">
                <h3>游戏设计</h3>
                <p>隐秘避难所团队</p>
                
                <h3>程序开发</h3>
                <p>隐秘避难所团队</p>
                
                <h3>美术设计</h3>
                <p>隐秘避难所团队</p>
                
                <h3>故事编写</h3>
                <p>隐秘避难所团队</p>
                
                <h3>特别感谢</h3>
                <p>所有支持本游戏的玩家</p>
            </div>
        `;
        
        showDialog('制作团队', creditsContent);
    };
    
    // 显示游戏内菜单
    const showInGameMenu = () => {
        const menuContent = `
            <div class="ingame-menu">
                <button id="resume-btn">继续游戏</button>
                <button id="save-game-btn">保存游戏</button>
                <button id="game-settings-btn">游戏设置</button>
                <button id="exit-game-btn">退出游戏</button>
            </div>
        `;
        
        showDialog('游戏菜单', menuContent, () => {
            // 添加按钮事件监听
            document.getElementById('resume-btn').addEventListener('click', closeDialog);
            
            document.getElementById('save-game-btn').addEventListener('click', () => {
                saveGame();
                closeDialog();
                showDialog('游戏已保存', '你的游戏进度已成功保存。', null, false);
            });
            
            document.getElementById('game-settings-btn').addEventListener('click', () => {
                closeDialog();
                showSettings();
            });
            
            document.getElementById('exit-game-btn').addEventListener('click', () => {
                closeDialog();
                exitGame();
            });
        });
        
        // 暂停游戏
        pauseGame();
    };
    
    // 切换视图
    const switchView = (targetView) => {
        // 隐藏所有视图
        document.querySelectorAll('.content-view').forEach(view => {
            view.classList.add('hidden');
        });
        
        // 移除所有导航项的活跃状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 显示目标视图
        document.getElementById(targetView).classList.remove('hidden');
        
        // 设置对应导航项为活跃状态
        document.querySelector(`.nav-item[data-target="${targetView}"]`).classList.add('active');
    };
    
    // 显示对话框
    const showDialog = (title, content, onOpen = null, showCancelButton = true) => {
        document.getElementById('dialog-title').textContent = title;
        document.getElementById('dialog-content').innerHTML = content;
        
        // 控制取消按钮显示
        document.getElementById('dialog-cancel-btn').style.display = showCancelButton ? 'block' : 'none';
        
        // 显示对话框
        document.getElementById('dialog-container').classList.remove('hidden');
        
        // 如果有回调函数，执行它
        if (onOpen && typeof onOpen === 'function') {
            onOpen();
        }
    };
    
    // 关闭对话框
    const closeDialog = () => {
        document.getElementById('dialog-container').classList.add('hidden');
        
        // 如果游戏已暂停，恢复游戏
        if (gameLoaded && !gameRunning) {
            resumeGame();
        }
    };
    
    // 初始化游戏数据
    const initGameData = () => {
        // 使用默认游戏数据
        gameLoaded = true;
        
        // 获取建筑数据
        buildings = gameData.buildings || [];
        
        // 生成地图
        generateMap();
        
        // 更新游戏时间显示
        updateGameTimeDisplay();
    };
    
    // 生成地图
    const generateMap = () => {
        const mapContainer = document.getElementById('map-container');
        if (!mapContainer) return;
        
        // 清空地图容器
        mapContainer.innerHTML = '';
        
        // 创建5x5的地图网格
        for (let i = 0; i < 25; i++) {
            const tile = document.createElement('div');
            tile.className = 'map-tile empty';
            tile.dataset.index = i;
            
            // 添加图标
            const icon = document.createElement('i');
            icon.className = 'fas fa-question';
            tile.appendChild(icon);
            
            // 添加点击事件
            tile.addEventListener('click', () => {
                showTileInfo(i);
            });
            
            mapContainer.appendChild(tile);
        }
        
        // 更新地图上的建筑
        updateMapBuildings();
    };
    
    // 更新地图上的建筑
    const updateMapBuildings = () => {
        // 获取已建造的建筑
        const builtBuildings = buildings.filter(building => building.level > 0);
        
        // 随机选择一些位置放置建筑
        builtBuildings.forEach((building, index) => {
            // 简单的随机位置，实际应用中可能需要更复杂的逻辑
            const position = Math.floor(Math.random() * 25);
            const tile = document.querySelector(`.map-tile[data-index="${position}"]`);
            
            if (tile) {
                tile.className = 'map-tile building';
                tile.dataset.buildingId = building.id;
                
                // 更新图标
                const icon = tile.querySelector('i');
                if (icon) {
                    icon.className = getBuildingIcon(building.type);
                }
            }
        });
    };
    
    // 获取建筑图标
    const getBuildingIcon = (buildingType) => {
        const iconMap = {
            'residence': 'fas fa-home',
            'farm': 'fas fa-seedling',
            'mine': 'fas fa-hammer',
            'tower': 'fas fa-chess-rook',
            'workshop': 'fas fa-tools',
            'library': 'fas fa-book',
            'temple': 'fas fa-place-of-worship'
        };
        
        return iconMap[buildingType] || 'fas fa-building';
    };
    
    // 显示地块信息
    const showTileInfo = (tileIndex) => {
        const tile = document.querySelector(`.map-tile[data-index="${tileIndex}"]`);
        
        if (tile.classList.contains('building')) {
            const buildingId = tile.dataset.buildingId;
            const building = buildings.find(b => b.id === buildingId);
            
            if (building) {
                showDialog(
                    `${building.name}`,
                    `<p>${building.description}</p>
                    <p>等级: ${building.level}/${building.maxLevel}</p>
                    ${building.resourceProduction ? 
                        `<p>产出: ${Object.entries(building.resourceProduction)
                            .map(([resource, amount]) => `${getResourceName(resource)} +${amount}/小时`)
                            .join(', ')}</p>` 
                        : ''}`,
                    null,
                    false
                );
            }
        } else {
            showDialog(
                '空地',
                '<p>这块地还没有建筑。你可以在建筑菜单中建造新的建筑。</p>',
                null,
                false
            );
        }
    };
    
    // 获取资源名称
    const getResourceName = (resource) => {
        const resourceNames = {
            'food': '食物',
            'gold': '金币',
            'magic': '魔力'
        };
        
        return resourceNames[resource] || resource;
    };
    
    // 开始游戏循环
    const startGameLoop = () => {
        if (gameInterval) {
            clearInterval(gameInterval);
        }
        
        gameRunning = true;
        let tickCount = 0;
        let lastSaveTime = Date.now();
        
        gameInterval = setInterval(() => {
            if (!gameRunning) return;
            
            tickCount++;
            
            // 每10个tick（10秒）增加一小时游戏时间
            if (tickCount % 10 === 0) {
                advanceGameTime();
            }
            
            // 检查是否需要自动保存
            if (gameData.settings.autoSave && Date.now() - lastSaveTime >= SAVE_INTERVAL) {
                saveGame();
                lastSaveTime = Date.now();
            }
        }, GAME_TICK_INTERVAL);
    };
    
    // 暂停游戏
    const pauseGame = () => {
        gameRunning = false;
    };
    
    // 恢复游戏
    const resumeGame = () => {
        gameRunning = true;
    };
    
    // 退出游戏
    const exitGame = () => {
        // 保存游戏
        saveGame();
        
        // 停止游戏循环
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
        }
        
        gameRunning = false;
        gameLoaded = false;
        
        // 返回主菜单
        document.getElementById('game-main').classList.add('hidden');
        document.getElementById('main-menu').classList.remove('hidden');
    };
    
    // 推进游戏时间
    const advanceGameTime = () => {
        // 增加一小时
        gameData.player.hour++;
        
        // 如果到了24小时，增加一天
        if (gameData.player.hour >= 24) {
            gameData.player.hour = 0;
            gameData.player.day++;
        }
        
        // 更新游戏时间显示
        updateGameTimeDisplay();
        
        // 更新资源（每小时产出）
        updateResources();
        
        // 检查任务完成情况
        tasksModule.updateTasks();
        
        // 检查建筑完成情况
        buildingsModule.updateBuildings();
        
        // 检查故事触发条件
        storyModule.checkStoryTriggers();
    };
    
    // 更新游戏时间显示
    const updateGameTimeDisplay = () => {
        const timeElement = document.getElementById('game-time');
        const hour = gameData.player.hour.toString().padStart(2, '0');
        timeElement.textContent = `第${gameData.player.day}天 ${hour}:00`;
    };
    
    // 更新资源
    const updateResources = () => {
        // 获取建筑产出
        const production = buildingsModule.getBuildingProduction();
        
        // 更新资源
        for (const [resource, amount] of Object.entries(production)) {
            if (gameData.player.resources[resource] !== undefined) {
                gameData.player.resources[resource] += amount;
            }
        }
        
        // 更新资源显示
        updateResourceDisplay();
    };
    
    // 更新资源显示
    const updateResourceDisplay = () => {
        document.getElementById('food-value').textContent = gameData.player.resources.food;
        document.getElementById('gold-value').textContent = gameData.player.resources.gold;
        document.getElementById('magic-value').textContent = gameData.player.resources.magic;
    };
    
    // 保存游戏
    const saveGame = () => {
        try {
            const saveData = JSON.stringify(gameData);
            localStorage.setItem('sneakySanctuarySave', saveData);
            console.log('游戏已保存');
            return true;
        } catch (error) {
            console.error('保存游戏失败:', error);
            return false;
        }
    };
    
    // 加载游戏
    const loadGame = () => {
        try {
            const saveData = localStorage.getItem('sneakySanctuarySave');
            if (!saveData) return false;
            
            const parsedData = JSON.parse(saveData);
            
            // 将保存的数据合并到游戏数据中
            Object.assign(gameData, parsedData);
            
            gameLoaded = true;
            console.log('游戏已加载');
            return true;
        } catch (error) {
            console.error('加载游戏失败:', error);
            return false;
        }
    };
    
    // 公开接口
    return {
        init,
        saveGame,
        loadGame,
        showDialog,
        closeDialog,
        updateResourceDisplay,
        pauseGame,
        resumeGame,
        generateMap
    };
})();

// 当页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    gameModule.init();
}); 