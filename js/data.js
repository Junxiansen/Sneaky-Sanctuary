// 游戏数据
const gameData = {
    // 玩家数据
    player: {
        name: "管理者",
        day: 1,
        hour: 0,
        resources: {
            food: 100,
            gold: 50,
            magic: 10
        }
    },
    
    // 游戏设置
    settings: {
        soundEnabled: true,
        musicEnabled: true,
        notificationsEnabled: true,
        autoSave: true
    },
    
    // 避难所数据
    sanctuary: {
        name: "偷偷摸摸的庇护所",
        level: 1,
        maxResidents: 10,
        maxBuildings: 5
    },
    
    // 角色数据
    characters: [
        // 战士型角色
        {
            id: "character_1",
            name: "莱恩",
            title: "守卫队长",
            type: "warrior",
            level: 1,
            experience: 0,
            experienceToNextLevel: 100,
            attributes: {
                strength: 8,
                agility: 5,
                intelligence: 4
            },
            abilities: [
                {
                    id: "ability_1",
                    name: "战术指挥",
                    description: "提高所有战士型角色的战斗力",
                    effect: "warriorBoost",
                    value: 10
                },
                {
                    id: "ability_2",
                    name: "防御姿态",
                    description: "大幅减少受到的伤害",
                    effect: "defensiveStance",
                    value: 25
                }
            ],
            specializations: [
                {
                    id: "spec_1",
                    name: "护卫路线",
                    description: "专注防御和保护其他角色",
                    level: 0,
                    maxLevel: 5,
                    bonuses: [{attr: "defense", value: 5}]
                },
                {
                    id: "spec_2",
                    name: "战术路线",
                    description: "专注团队作战和战略规划",
                    level: 0,
                    maxLevel: 5,
                    bonuses: [{attr: "leadership", value: 5}]
                },
                {
                    id: "spec_3",
                    name: "武器大师路线",
                    description: "专注武器使用和单体攻击",
                    level: 0,
                    maxLevel: 5,
                    bonuses: [{attr: "damage", value: 5}]
                }
            ],
            story: "曾是王国精锐卫队的队长，在一次政变中选择保护平民而非国王，被迫流亡。",
            unlocked: false
        },
        {
            id: "character_2",
            name: "艾拉",
            title: "神秘猎手",
            type: "warrior",
            level: 1,
            experience: 0,
            experienceToNextLevel: 100,
            attributes: {
                strength: 6,
                agility: 9,
                intelligence: 5
            },
            abilities: [
                {
                    id: "ability_3",
                    name: "精准射击",
                    description: "对远距离目标造成额外伤害",
                    effect: "preciseShot",
                    value: 15
                },
                {
                    id: "ability_4",
                    name: "动物沟通",
                    description: "可以驯服一定数量的动物协助战斗或资源收集",
                    effect: "animalCommunication",
                    value: 1
                }
            ],
            specializations: [
                {
                    id: "spec_4",
                    name: "游侠路线",
                    description: "专注远程攻击和侦察",
                    level: 0,
                    maxLevel: 5,
                    bonuses: [{attr: "rangedDamage", value: 5}]
                },
                {
                    id: "spec_5",
                    name: "驯兽师路线",
                    description: "专注动物伙伴和协同作战",
                    level: 0,
                    maxLevel: 5,
                    bonuses: [{attr: "animalControl", value: 5}]
                },
                {
                    id: "spec_6",
                    name: "潜行路线",
                    description: "专注隐身和突袭攻击",
                    level: 0,
                    maxLevel: 5,
                    bonuses: [{attr: "stealth", value: 5}]
                }
            ],
            story: "生活在森林中的独行侠，擅长追踪和狩猎，对避难所周围的环境了如指掌。",
            unlocked: false
        },
        
        // 工匠型角色
        {
            id: "character_3",
            name: "托尔",
            title: "铁匠大师",
            type: "artisan",
            level: 1,
            experience: 0,
            experienceToNextLevel: 100,
            attributes: {
                strength: 7,
                agility: 6,
                intelligence: 5
            },
            abilities: [
                {
                    id: "ability_5",
                    name: "精湛工艺",
                    description: "制作的武器和装备有额外属性加成",
                    effect: "masterCrafting",
                    value: 15
                },
                {
                    id: "ability_6",
                    name: "资源节约",
                    description: "制作物品消耗更少的材料",
                    effect: "resourceSaving",
                    value: 20
                }
            ],
            specializations: [
                {
                    id: "spec_7",
                    name: "武器锻造",
                    description: "专注武器制作和强化",
                    level: 0,
                    maxLevel: 5,
                    bonuses: [{attr: "weaponCrafting", value: 5}]
                },
                {
                    id: "spec_8",
                    name: "防具制作",
                    description: "专注防具制作和耐久性提升",
                    level: 0,
                    maxLevel: 5,
                    bonuses: [{attr: "armorCrafting", value: 5}]
                },
                {
                    id: "spec_9",
                    name: "创新设计",
                    description: "专注新型装备研发和特殊效果",
                    level: 0,
                    maxLevel: 5,
                    bonuses: [{attr: "innovation", value: 5}]
                }
            ],
            story: "来自矮人王国的铁匠，因为创造了违反传统的武器被放逐，一直寻找能欣赏他创新精神的地方。",
            unlocked: false
        },
        
        // 学者型角色
        {
            id: "character_4",
            name: "莎拉",
            title: "医者",
            type: "scholar",
            level: 1,
            experience: 0,
            experienceToNextLevel: 100,
            attributes: {
                strength: 3,
                agility: 5,
                intelligence: 9
            },
            abilities: [
                {
                    id: "ability_7",
                    name: "高效治疗",
                    description: "恢复角色生命值和治疗负面状态",
                    effect: "efficientHealing",
                    value: 25
                },
                {
                    id: "ability_8",
                    name: "药物研究",
                    description: "可以研发各种药剂提升角色能力",
                    effect: "medicineResearch",
                    value: 10
                }
            ],
            specializations: [
                {
                    id: "spec_10",
                    name: "外科医生",
                    description: "专注紧急治疗和状态恢复",
                    level: 0,
                    maxLevel: 5,
                    bonuses: [{attr: "healing", value: 5}]
                },
                {
                    id: "spec_11",
                    name: "药剂师",
                    description: "专注药物研发和长期增益",
                    level: 0,
                    maxLevel: 5,
                    bonuses: [{attr: "potionEffect", value: 5}]
                },
                {
                    id: "spec_12",
                    name: "疫苗专家",
                    description: "专注疾病预防和群体防护",
                    level: 0,
                    maxLevel: 5,
                    bonuses: [{attr: "diseasePrevention", value: 5}]
                }
            ],
            story: "王国最著名的医师，因研究被视为异端的疗法而被驱逐，一直寻找能自由研究的环境。",
            unlocked: false
        }
    ],
    
    // 建筑数据
    buildings: [
        {
            id: "building_1",
            name: "食物仓库",
            description: "存储食物并提高食物产量",
            type: "farm",
            level: 0,
            maxLevel: 3,
            resourceProduction: {
                food: 5
            },
            buildCost: {
                gold: 50
            },
            upgradeCost: {
                gold: 100
            },
            buildTime: 2,
            unlocked: true
        },
        {
            id: "building_2",
            name: "金币铸造厂",
            description: "产生金币收入",
            type: "mine",
            level: 0,
            maxLevel: 3,
            resourceProduction: {
                gold: 2
            },
            buildCost: {
                gold: 100
            },
            upgradeCost: {
                gold: 200
            },
            buildTime: 4,
            unlocked: true
        },
        {
            id: "building_3",
            name: "魔法研究所",
            description: "产生魔法能量并解锁特殊研究",
            type: "library",
            level: 0,
            maxLevel: 3,
            resourceProduction: {
                magic: 1
            },
            buildCost: {
                gold: 150,
                magic: 5
            },
            upgradeCost: {
                gold: 300,
                magic: 10
            },
            buildTime: 6,
            unlocked: false
        },
        {
            id: "building_4",
            name: "居住区",
            description: "增加可容纳的居民数量",
            type: "residence",
            level: 0,
            maxLevel: 3,
            effects: {
                maxResidents: 5
            },
            buildCost: {
                gold: 80,
                food: 30
            },
            upgradeCost: {
                gold: 160,
                food: 60
            },
            buildTime: 3,
            unlocked: true
        },
        {
            id: "building_5",
            name: "训练场",
            description: "提高战士型角色的经验获取",
            level: 0,
            maxLevel: 3,
            effects: {
                warriorExpBoost: 10
            },
            buildCost: {
                gold: 120,
                food: 50
            },
            upgradeCost: {
                gold: 240,
                food: 100
            },
            buildTime: 5,
            unlocked: false
        }
    ],
    
    // 任务数据
    tasks: {
        main: [
            {
                id: "task_main_1",
                name: "新的开始",
                description: "探索避难所周围的环境，寻找可用资源。",
                requirements: {},
                rewards: {
                    food: 30,
                    gold: 50,
                    experience: 20
                },
                time: 1,
                completed: false,
                unlocked: true
            },
            {
                id: "task_main_2",
                name: "第一位居民",
                description: "在附近寻找并招募你的第一位居民。",
                requirements: {
                    tasks: ["task_main_1"]
                },
                rewards: {
                    gold: 80,
                    experience: 40,
                    character: "character_1"
                },
                time: 2,
                completed: false,
                unlocked: false
            },
            {
                id: "task_main_3",
                name: "神秘符文",
                description: "调查避难所深处发现的古老符文。",
                requirements: {
                    tasks: ["task_main_2"],
                    characters: ["character_1"]
                },
                rewards: {
                    gold: 100,
                    magic: 15,
                    experience: 60,
                    building: "building_3"
                },
                time: 4,
                completed: false,
                unlocked: false
            }
        ],
        daily: [
            {
                id: "task_daily_1",
                name: "狩猎",
                description: "在森林中狩猎野味，获取食物。",
                requirements: {},
                rewards: {
                    food: 40,
                    experience: 10
                },
                time: 2,
                completed: false,
                unlocked: true
            },
            {
                id: "task_daily_2",
                name: "采集资源",
                description: "在避难所周围采集有用的资源。",
                requirements: {},
                rewards: {
                    gold: 30,
                    food: 20,
                    experience: 10
                },
                time: 2,
                completed: false,
                unlocked: true
            }
        ],
        special: [
            {
                id: "task_special_1",
                name: "森林守护者",
                description: "寻找传说中的森林守护者，据说她能与动物交流。",
                requirements: {
                    tasks: ["task_main_2"],
                    buildings: ["building_4"]
                },
                rewards: {
                    gold: 150,
                    magic: 10,
                    experience: 80,
                    character: "character_2"
                },
                time: 6,
                completed: false,
                unlocked: false
            }
        ]
    },
    
    // 故事数据
    story: [
        {
            id: "story_1",
            title: "序章：被遗忘的避难所",
            content: "你偶然发现了这个几乎被废弃的避难所。它曾经一定十分繁荣，但现在只剩下残垣断壁和零星的痕迹。是什么导致了它的衰落？为什么所有人都离开了？这些秘密等待着你去揭开...",
            unlocked: true
        }
    ]
};

// 导出数据
if (typeof module !== 'undefined') {
    module.exports = { gameData };
} 