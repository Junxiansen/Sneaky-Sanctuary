// 建筑管理模块
const buildingsModule = (() => {
    // 私有变量
    let buildings = [];
    let buildingsInProgress = [];
    
    // 初始化建筑数据
    const init = () => {
        buildings = gameData.buildings;
        renderBuildingList();
        updateBuildingsCount();
    };
    
    // 渲染建筑列表
    const renderBuildingList = () => {
        const buildingGridElement = document.querySelector('.building-grid');
        const unlockedBuildings = buildings.filter(building => building.unlocked);
        
        if (unlockedBuildings.length === 0) {
            buildingGridElement.innerHTML = `
                <div class="empty-state">
                    <p>还没有建筑。建造你的第一个建筑来增强避难所！</p>
                </div>
            `;
            return;
        }
        
        let buildingHTML = '';
        unlockedBuildings.forEach(building => {
            const inProgress = buildingsInProgress.find(b => b.id === building.id);
            const isBuilt = building.level > 0;
            const canUpgrade = building.level < building.maxLevel;
            
            buildingHTML += `
                <div class="building-card" data-id="${building.id}">
                    <div class="building-header">
                        <h3>${building.name}</h3>
                        <span class="building-level">等级 ${building.level}/${building.maxLevel}</span>
                    </div>
                    <p>${building.description}</p>
                    
                    <div class="building-effects">
                        ${building.resourceProduction ? Object.entries(building.resourceProduction).map(([resource, amount]) => 
                            `<p>产出 ${getResourceName(resource)}: +${amount}/小时</p>`
                        ).join('') : ''}
                        
                        ${building.effects ? Object.entries(building.effects).map(([effect, value]) => 
                            `<p>${getEffectDescription(effect, value)}</p>`
                        ).join('') : ''}
                    </div>
                    
                    <div class="building-actions">
                        ${!isBuilt ? `
                            <div class="building-cost">
                                ${Object.entries(building.buildCost).map(([resource, amount]) => 
                                    `<span>${getResourceName(resource)}: ${amount}</span>`
                                ).join('')}
                            </div>
                            <button class="build-btn" data-id="${building.id}" ${inProgress ? 'disabled' : ''}>
                                ${inProgress ? `建造中 (${inProgress.remainingTime}小时)` : '建造'}
                            </button>
                        ` : canUpgrade ? `
                            <div class="building-cost">
                                ${Object.entries(building.upgradeCost).map(([resource, amount]) => 
                                    `<span>${getResourceName(resource)}: ${amount}</span>`
                                ).join('')}
                            </div>
                            <button class="upgrade-btn" data-id="${building.id}" ${inProgress ? 'disabled' : ''}>
                                ${inProgress ? `升级中 (${inProgress.remainingTime}小时)` : '升级'}
                            </button>
                        ` : `
                            <p class="max-level">已达到最高等级</p>
                        `}
                    </div>
                </div>
            `;
        });
        
        buildingGridElement.innerHTML = buildingHTML;
        
        // 添加建造按钮事件监听
        document.querySelectorAll('.build-btn').forEach(btn => {
            if (!btn.disabled) {
                btn.addEventListener('click', (e) => {
                    const buildingId = e.target.getAttribute('data-id');
                    buildBuilding(buildingId);
                });
            }
        });
        
        // 添加升级按钮事件监听
        document.querySelectorAll('.upgrade-btn').forEach(btn => {
            if (!btn.disabled) {
                btn.addEventListener('click', (e) => {
                    const buildingId = e.target.getAttribute('data-id');
                    upgradeBuilding(buildingId);
                });
            }
        });
    };
    
    // 获取资源名称
    const getResourceName = (resource) => {
        const resourceMap = {
            'food': '食物',
            'gold': '金币',
            'magic': '魔法'
        };
        return resourceMap[resource] || resource;
    };
    
    // 获取效果描述
    const getEffectDescription = (effect, value) => {
        const effectMap = {
            'maxResidents': `居民上限 +${value}`,
            'warriorExpBoost': `战士经验 +${value}%`,
            'artisanExpBoost': `工匠经验 +${value}%`,
            'scholarExpBoost': `学者经验 +${value}%`
        };
        return effectMap[effect] || `${effect}: ${value}`;
    };
    
    // 建造建筑
    const buildBuilding = (buildingId) => {
        const building = buildings.find(b => b.id === buildingId);
        if (!building) return;
        
        // 检查资源是否足够
        if (!checkResources(building.buildCost)) {
            gameModule.showDialog('资源不足', '你没有足够的资源来建造这个建筑。', null, false);
            return;
        }
        
        // 检查是否达到建筑上限
        const builtBuildingsCount = buildings.filter(b => b.level > 0).length;
        if (builtBuildingsCount >= gameData.sanctuary.maxBuildings) {
            gameModule.showDialog('建筑上限', '你的避难所已达到建筑上限。升级避难所以增加建筑上限。', null, false);
            return;
        }
        
        // 扣除资源
        for (const [resource, amount] of Object.entries(building.buildCost)) {
            gameData.player.resources[resource] -= amount;
        }
        
        // 添加到建造中的建筑
        buildingsInProgress.push({
            id: building.id,
            action: 'build',
            totalTime: building.buildTime,
            remainingTime: building.buildTime,
            startTime: gameData.player.day * 24 + gameData.player.hour
        });
        
        // 更新UI
        gameModule.updateResourceDisplay();
        renderBuildingList();
        
        // 保存游戏数据
        gameModule.saveGame();
        
        // 显示建造开始消息
        gameModule.showDialog('建造开始', `你已开始建造"${building.name}"。建造将在${building.buildTime}小时后完成。`, null, false);
    };
    
    // 升级建筑
    const upgradeBuilding = (buildingId) => {
        const building = buildings.find(b => b.id === buildingId);
        if (!building || building.level >= building.maxLevel) return;
        
        // 检查资源是否足够
        if (!checkResources(building.upgradeCost)) {
            gameModule.showDialog('资源不足', '你没有足够的资源来升级这个建筑。', null, false);
            return;
        }
        
        // 扣除资源
        for (const [resource, amount] of Object.entries(building.upgradeCost)) {
            gameData.player.resources[resource] -= amount;
        }
        
        // 添加到建造中的建筑
        buildingsInProgress.push({
            id: building.id,
            action: 'upgrade',
            totalTime: building.buildTime,
            remainingTime: building.buildTime,
            startTime: gameData.player.day * 24 + gameData.player.hour
        });
        
        // 更新UI
        gameModule.updateResourceDisplay();
        renderBuildingList();
        
        // 保存游戏数据
        gameModule.saveGame();
        
        // 显示升级开始消息
        gameModule.showDialog('升级开始', `你已开始升级"${building.name}"。升级将在${building.buildTime}小时后完成。`, null, false);
    };
    
    // 检查资源是否足够
    const checkResources = (costs) => {
        for (const [resource, amount] of Object.entries(costs)) {
            if (gameData.player.resources[resource] < amount) {
                return false;
            }
        }
        return true;
    };
    
    // 更新建筑进度
    const updateBuildings = () => {
        const currentTime = gameData.player.day * 24 + gameData.player.hour;
        let buildingsCompleted = false;
        
        // 更新剩余时间
        buildingsInProgress.forEach(building => {
            const elapsedTime = currentTime - building.startTime;
            building.remainingTime = Math.max(0, building.totalTime - elapsedTime);
        });
        
        // 检查完成的建筑
        const completedBuildings = buildingsInProgress.filter(building => building.remainingTime <= 0);
        if (completedBuildings.length > 0) {
            completedBuildings.forEach(building => {
                completeBuilding(building);
                buildingsInProgress = buildingsInProgress.filter(b => b.id !== building.id);
            });
            buildingsCompleted = true;
        }
        
        if (buildingsCompleted) {
            renderBuildingList();
            updateBuildingsCount();
        }
        
        return buildingsCompleted;
    };
    
    // 完成建筑建造或升级
    const completeBuilding = (buildingProgress) => {
        const building = buildings.find(b => b.id === buildingProgress.id);
        if (!building) return;
        
        if (buildingProgress.action === 'build') {
            building.level = 1;
            
            // 显示建造完成消息
            gameModule.showDialog('建造完成', `"${building.name}"已建造完成！`, null, false);
        } else if (buildingProgress.action === 'upgrade') {
            building.level += 1;
            
            // 显示升级完成消息
            gameModule.showDialog('升级完成', `"${building.name}"已升级到等级${building.level}！`, null, false);
        }
        
        // 更新游戏UI
        gameModule.updateResourceDisplay();
    };
    
    // 解锁新建筑
    const unlockBuilding = (buildingId) => {
        const building = buildings.find(b => b.id === buildingId);
        if (!building) return false;
        
        building.unlocked = true;
        renderBuildingList();
        
        // 保存游戏数据
        gameModule.saveGame();
        return true;
    };
    
    // 更新建筑计数
    const updateBuildingsCount = () => {
        const builtBuildingsCount = buildings.filter(b => b.level > 0).length;
        document.getElementById('buildings-count').textContent = builtBuildingsCount;
    };
    
    // 获取建筑产出
    const getBuildingProduction = () => {
        const production = {
            food: 0,
            gold: 0,
            magic: 0
        };
        
        buildings.forEach(building => {
            if (building.level > 0 && building.resourceProduction) {
                for (const [resource, amount] of Object.entries(building.resourceProduction)) {
                    production[resource] += amount * building.level;
                }
            }
        });
        
        return production;
    };
    
    // 公开接口
    return {
        init,
        renderBuildingList,
        updateBuildings,
        unlockBuilding,
        getBuildingProduction
    };
})(); 