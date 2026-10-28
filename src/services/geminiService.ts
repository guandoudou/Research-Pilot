
import { GoogleGenAI } from "@google/genai";
import { HISTORICAL_FORMULAS, INGREDIENTS, Formula, Ingredient } from "../data/mockData";

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export type UserRole = 'Senior Expert' | 'Junior Engineer';

// Helper to redact sensitive data based on role
function getContextForRole(role: UserRole) {
  const safeIngredients = INGREDIENTS.map(ing => {
    if (role === 'Junior Engineer') {
      return {
        ...ing,
        supplier: '[已脱敏]',
        costPerKg: '***',
        name: ing.type === 'Resin' ? `通用 ${ing.type} ${ing.id}` : ing.name
      };
    }
    return ing;
  });

  const safeFormulas = HISTORICAL_FORMULAS.map(f => {
    const safeIngs = f.ingredients.map(i => {
      const original = INGREDIENTS.find(ing => ing.id === i.ingredientId);
      return {
        name: role === 'Junior Engineer' && original?.type === 'Resin' ? `通用 ${original.type} ${original.id}` : original?.name,
        percentage: i.percentage
      };
    });
    return {
      ...f,
      ingredients: safeIngs,
    };
  });

  return { ingredients: safeIngredients, formulas: safeFormulas };
}

export async function queryKnowledgeBase(query: string, role: UserRole) {
  if (!apiKey) return "错误: 未设置 GEMINI_API_KEY。";

  const context = getContextForRole(role);
  const contextString = JSON.stringify(context, null, 2);

  const prompt = `
    你现在是邦固化学的“研发知识基座智能体 (RAG Agent)”。
    你的目标是协助研发工程师从历史数据库中检索信息。
    
    当前用户角色: ${role}
    (如果角色是 Junior Engineer，上下文中的敏感供应商信息和成本已被脱敏。请不要编造它们。)

    历史数据上下文:
    ${contextString}

    用户查询: "${query}"

    指令:
    1. 仅根据提供的上下文回答查询。
    2. 如果用户询问配方，请提供详细信息。
    3. 如果用户询问失败案例，请重点强调“notes”和“outcome”字段作为“避坑指南”。
    4. 使用 Markdown 格式清晰地格式化回答。
    5. 保持专业和科学的语气，使用中文回答。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，处理您的请求时遇到错误。";
  }
}

export async function generateFormulaRecommendation(
  constraints: { targetAdhesion: number; targetViscosity: number; focus: string },
  role: UserRole
) {
  if (!apiKey) return "错误: 未设置 GEMINI_API_KEY。";

  const context = getContextForRole(role);
  const contextString = JSON.stringify(context, null, 2);

  const prompt = `
    你现在是邦固化学的“多目标配方生成智能体 (Formulation Agent)”。
    你的目标是根据用户约束和历史数据建议一个新的配方。

    当前用户角色: ${role}

    历史数据上下文:
    ${contextString}

    用户约束:
    - 目标附着力 (1-10): ${constraints.targetAdhesion}
    - 目标粘度 (cP): ${constraints.targetViscosity}
    - 侧重点: ${constraints.focus} (例如 "高内聚", "成本效益")

    指令:
    1. 分析历史数据，看看哪些成功了，哪些失败了。
    2. 提出一个新的配方（成分列表和百分比），以满足目标。
    3. 根据上下文中的“properties”解释为什么选择这些成分。
    4. 预测结果和潜在风险。
    5. 如果用户是 Junior Engineer，不要在推理中透露具体的供应商名称，使用上下文中提供的通用名称。
    6. 请使用中文回答。
    
    输出格式:
    ## 推荐配方
    | 成分 | 百分比 | 理由 |
    |---|---|---|
    ...
    
    ## 预测性能
    - 附着力: ...
    - 粘度: ...
    
    ## 基本原理与风险
    ...
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，生成推荐时遇到错误。";
  }
}
