
export interface Ingredient {
  id: string;
  name: string;
  type: 'Resin' | 'Solvent' | 'Additive' | 'Monomer';
  supplier: string; // Sensitive
  costPerKg: number; // Sensitive
  properties: string[];
}

export interface Formula {
  id: string;
  code: string;
  name: string;
  date: string;
  author: string;
  ingredients: { ingredientId: string; percentage: number }[];
  performance: {
    adhesion: number; // 1-10
    cohesion: number; // 1-10
    viscosity: number; // cP
    dryingTime: number; // min
  };
  outcome: 'Success' | 'Failure' | 'Partial';
  notes: string; // "Pitfall guide" content
}

export const INGREDIENTS: Ingredient[] = [
  { id: 'R001', name: '丙烯酸树脂 A-75', type: 'Resin', supplier: '巴斯夫 (BASF)', costPerKg: 25.5, properties: ['高光泽', '快干'] },
  { id: 'R002', name: '聚氨酯 P-20', type: 'Resin', supplier: '科思创 (Covestro)', costPerKg: 32.0, properties: ['柔韧性', '耐用'] },
  { id: 'S001', name: '乙酸乙酯', type: 'Solvent', supplier: '本地化工', costPerKg: 8.0, properties: ['快挥发'] },
  { id: 'S002', name: '乙酸丁酯', type: 'Solvent', supplier: '本地化工', costPerKg: 9.5, properties: ['中等挥发'] },
  { id: 'M001', name: 'MMA (甲基丙烯酸甲酯)', type: 'Monomer', supplier: '三菱 (Mitsubishi)', costPerKg: 18.0, properties: ['硬度'] },
  { id: 'M002', name: 'BA (丙烯酸丁酯)', type: 'Monomer', supplier: '陶氏 (Dow)', costPerKg: 16.5, properties: ['柔软性', '柔韧性'] },
  { id: 'A001', name: '消泡剂 D-500', type: 'Additive', supplier: '毕克 (BYK)', costPerKg: 45.0, properties: ['消泡'] },
];

export const HISTORICAL_FORMULAS: Formula[] = [
  {
    id: 'F2023-001',
    code: 'BG-23-A01',
    name: '高光泽面漆 V1',
    date: '2023-03-15',
    author: '张博士',
    ingredients: [
      { ingredientId: 'R001', percentage: 40 },
      { ingredientId: 'S001', percentage: 30 },
      { ingredientId: 'S002', percentage: 28 },
      { ingredientId: 'A001', percentage: 2 },
    ],
    performance: { adhesion: 8, cohesion: 7, viscosity: 1200, dryingTime: 15 },
    outcome: 'Success',
    notes: '标准配方。干燥时间和光泽度平衡良好。',
  },
  {
    id: 'F2023-045',
    code: 'BG-23-B12',
    name: '实验性柔韧涂层',
    date: '2023-06-20',
    author: '李工',
    ingredients: [
      { ingredientId: 'R002', percentage: 50 },
      { ingredientId: 'M002', percentage: 10 },
      { ingredientId: 'S001', percentage: 40 },
    ],
    performance: { adhesion: 4, cohesion: 9, viscosity: 800, dryingTime: 45 },
    outcome: 'Failure',
    notes: '严重失败：对金属基材附着力差。24小时后观察到脱层。避免在没有附着力促进剂的情况下使用高比例 M002。',
  },
  {
    id: 'F2024-012',
    code: 'BG-24-C05',
    name: '环保底漆',
    date: '2024-01-10',
    author: '张博士',
    ingredients: [
      { ingredientId: 'R001', percentage: 35 },
      { ingredientId: 'R002', percentage: 15 },
      { ingredientId: 'S002', percentage: 48 },
      { ingredientId: 'A001', percentage: 2 },
    ],
    performance: { adhesion: 9, cohesion: 8, viscosity: 1500, dryingTime: 25 },
    outcome: 'Success',
    notes: '性能优异。混合树脂体系显著提高了附着力。',
  },
  {
    id: 'F2025-003',
    code: 'BG-25-X01',
    name: '超快干原型',
    date: '2025-02-05',
    author: '王工 (初级)',
    ingredients: [
      { ingredientId: 'R001', percentage: 60 },
      { ingredientId: 'S001', percentage: 40 },
    ],
    performance: { adhesion: 6, cohesion: 5, viscosity: 2500, dryingTime: 5 },
    outcome: 'Partial',
    notes: '干燥非常快但易脆。需要增塑剂或更软的单体。',
  },
];
