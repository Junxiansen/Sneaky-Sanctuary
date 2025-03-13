// 任务管理模块
const tasksModule = (() => {
    // 私有变量
    let tasks = {};
    let currentCategory = 'main';
    let activeTasksCount = 0;
    
    // 初始化任务数据
    const init = () => {
        tasks = gameData.tasks;
        
        // 添加任务类别切换事件
        document.querySelectorAll('.task-category').forEach(category => {
            category.addEventListener('click', (e) => {
                const categoryType = e.target.getAttribute('data-category');
                switchTaskCategory(categoryType);
            });
        });
        
        // 初始渲染任务列表
        renderTaskList();
        updateActiveTasksCount();
    };
    
    // 切换任务类别
    const switchTaskCategory = (category) => {
        currentCategory = category;
        
        // 更新类别样式
        document.querySelectorAll('.task-category').forEach(cat => {
            cat.classList.remove('active');
        });
        document.querySelector(`.task-category[data-category="${category}"]`).classList.add('active');
        
        // 重新渲染任务列表
        renderTaskList();
    };
    
    // 渲染任务列表
    const renderTaskList = () => {
        const taskListElement = document.querySelector('.task-list');
        const categoryTasks = tasks[currentCategory];
        
        if (!categoryTasks || categoryTasks.length === 0) {
            taskListElement.innerHTML = `
                <div class="empty-state">
                    <p>当前没有可用的${getTaskCategoryText(currentCategory)}任务。</p>
                </div>
            `;
            return;
        }
        
        // 过滤出已解锁的任务
        const unlockedTasks = categoryTasks.filter(task => task.unlocked && !task.completed);
        
        if (unlockedTasks.length === 0) {
            taskListElement.innerHTML = `
                <div class="empty-state">
                    <p>当前没有可用的${getTaskCategoryText(currentCategory)}任务。</p>
                </div>
            `;
            return;
        }
        
        let taskHTML = '';
        unlockedTasks.forEach(task => {
            taskHTML += `
                <div class="task-item" data-id="${task.id}">
                    <h3>${task.name}</h3>
                    <p>${task.description}</p>
                    <div class="task-rewards">
                        ${task.rewards.gold ? `<span><i class="fas fa-coins"></i> ${task.rewards.gold}</span>` : ''}
                        ${task.rewards.food ? `<span><i class="fas fa-drumstick-bite"></i> ${task.rewards.food}</span>` : ''}
                        ${task.rewards.magic ? `<span><i class="fas fa-magic"></i> ${task.rewards.magic}</span>` : ''}
                        ${task.rewards.experience ? `<span><i class="fas fa-star"></i> ${task.rewards.experience}</span>` : ''}
                        ${task.rewards.character ? `<span><i class="fas fa-user"></i> 角色</span>` : ''}
                        ${task.rewards.building ? `<span><i class="fas fa-building"></i> 建筑</span>` : ''}
                    </div>
                    <p>所需时间: ${task.time} 小时</p>
                    <button class="task-btn" data-id="${task.id}">开始任务</button>
                </div>
            `;
        });
        
        taskListElement.innerHTML = taskHTML;
        
        // 添加任务按钮事件监听
        document.querySelectorAll('.task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.getAttribute('data-id');
                startTask(taskId);
            });
        });
    };
    
    // 获取任务类别的中文文本
    const getTaskCategoryText = (category) => {
        const categoryMap = {
            'main': '主线',
            'daily': '日常',
            'special': '特殊'
        };
        return categoryMap[category] || category;
    };
    
    // 开始任务
    const startTask = (taskId) => {
        // 查找任务
        let task = null;
        let category = '';
        
        for (const cat in tasks) {
            const found = tasks[cat].find(t => t.id === taskId);
            if (found) {
                task = found;
                category = cat;
                break;
            }
        }
        
        if (!task) return;
        
        // 检查任务要求
        if (!checkTaskRequirements(task)) {
            gameModule.showDialog('无法开始任务', '你不满足开始此任务的要求。', null, false);
            return;
        }
        
        // 开始任务
        task.inProgress = true;
        task.startTime = gameData.player.day * 24 + gameData.player.hour;
        task.endTime = task.startTime + task.time;
        
        // 更新UI
        renderTaskList();
        updateActiveTasksCount();
        
        // 保存游戏数据
        gameModule.saveGame();
        
        // 显示任务开始消息
        gameModule.showDialog('任务已开始', `你已开始任务"${task.name}"。任务将在${task.time}小时后完成。`, null, false);
    };
    
    // 检查任务要求
    const checkTaskRequirements = (task) => {
        if (!task.requirements) return true;
        
        // 检查前置任务
        if (task.requirements.tasks) {
            for (const requiredTaskId of task.requirements.tasks) {
                let found = false;
                for (const cat in tasks) {
                    const requiredTask = tasks[cat].find(t => t.id === requiredTaskId);
                    if (requiredTask && requiredTask.completed) {
                        found = true;
                        break;
                    }
                }
                if (!found) return false;
            }
        }
        
        // 检查角色要求
        if (task.requirements.characters) {
            for (const requiredCharId of task.requirements.characters) {
                const character = gameData.characters.find(c => c.id === requiredCharId);
                if (!character || !character.unlocked) return false;
            }
        }
        
        // 检查建筑要求
        if (task.requirements.buildings) {
            for (const requiredBuildingId of task.requirements.buildings) {
                const building = gameData.buildings.find(b => b.id === requiredBuildingId);
                if (!building || building.level === 0) return false;
            }
        }
        
        return true;
    };
    
    // 更新进行中的任务
    const updateTasks = () => {
        const currentTime = gameData.player.day * 24 + gameData.player.hour;
        let tasksCompleted = false;
        
        // 检查所有任务类别
        for (const category in tasks) {
            tasks[category].forEach(task => {
                if (task.inProgress && currentTime >= task.endTime) {
                    completeTask(task);
                    tasksCompleted = true;
                }
            });
        }
        
        if (tasksCompleted) {
            renderTaskList();
            updateActiveTasksCount();
        }
        
        return tasksCompleted;
    };
    
    // 完成任务
    const completeTask = (task) => {
        task.inProgress = false;
        task.completed = true;
        
        // 给予奖励
        if (task.rewards) {
            // 资源奖励
            if (task.rewards.gold) gameData.player.resources.gold += task.rewards.gold;
            if (task.rewards.food) gameData.player.resources.food += task.rewards.food;
            if (task.rewards.magic) gameData.player.resources.magic += task.rewards.magic;
            
            // 经验奖励 (未来可能会用到)
            
            // 角色奖励
            if (task.rewards.character) {
                charactersModule.unlockCharacter(task.rewards.character);
            }
            
            // 建筑奖励
            if (task.rewards.building) {
                buildingsModule.unlockBuilding(task.rewards.building);
            }
        }
        
        // 解锁后续任务
        unlockFollowupTasks(task.id);
        
        // 显示任务完成消息
        let rewardsText = '';
        if (task.rewards) {
            if (task.rewards.gold) rewardsText += `金币: ${task.rewards.gold} `;
            if (task.rewards.food) rewardsText += `食物: ${task.rewards.food} `;
            if (task.rewards.magic) rewardsText += `魔法: ${task.rewards.magic} `;
            if (task.rewards.character) {
                const character = gameData.characters.find(c => c.id === task.rewards.character);
                if (character) rewardsText += `新角色: ${character.name} `;
            }
            if (task.rewards.building) {
                const building = gameData.buildings.find(b => b.id === task.rewards.building);
                if (building) rewardsText += `新建筑: ${building.name} `;
            }
        }
        
        gameModule.showDialog('任务完成', `你已完成任务"${task.name}"。\n获得奖励: ${rewardsText}`, null, false);
        
        // 更新游戏UI
        gameModule.updateResourceDisplay();
    };
    
    // 解锁后续任务
    const unlockFollowupTasks = (completedTaskId) => {
        for (const category in tasks) {
            tasks[category].forEach(task => {
                if (task.requirements && task.requirements.tasks && 
                    task.requirements.tasks.includes(completedTaskId) && 
                    !task.unlocked) {
                    // 检查其他要求是否满足
                    let allRequirementsMet = true;
                    
                    if (task.requirements.tasks) {
                        for (const requiredTaskId of task.requirements.tasks) {
                            if (requiredTaskId === completedTaskId) continue;
                            
                            let found = false;
                            for (const cat in tasks) {
                                const requiredTask = tasks[cat].find(t => t.id === requiredTaskId);
                                if (requiredTask && requiredTask.completed) {
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                allRequirementsMet = false;
                                break;
                            }
                        }
                    }
                    
                    if (allRequirementsMet) {
                        task.unlocked = true;
                    }
                }
            });
        }
    };
    
    // 更新活跃任务计数
    const updateActiveTasksCount = () => {
        let count = 0;
        for (const category in tasks) {
            tasks[category].forEach(task => {
                if (task.inProgress) count++;
            });
        }
        
        activeTasksCount = count;
        document.getElementById('active-tasks').textContent = count;
    };
    
    // 获取活跃任务数量
    const getActiveTasksCount = () => {
        return activeTasksCount;
    };
    
    // 显示分配任务对话框
    const showAssignTaskDialog = (characterId) => {
        // 这个功能可以在未来实现
        gameModule.showDialog('功能未实现', '角色任务分配功能将在未来版本中实现。', null, false);
    };
    
    // 公开接口
    return {
        init,
        renderTaskList,
        updateTasks,
        getActiveTasksCount,
        showAssignTaskDialog
    };
})(); 