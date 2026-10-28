
import React, { useState } from 'react';
import { FlaskConical, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateFormulaRecommendation, UserRole } from '../services/geminiService';
import { clsx } from 'clsx';

interface FormulationLabProps {
  role: UserRole;
}

export function FormulationLab({ role }: FormulationLabProps) {
  const [adhesion, setAdhesion] = useState(8);
  const [viscosity, setViscosity] = useState(1500);
  const [focus, setFocus] = useState('平衡性能');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);

    // Simulate chart data based on inputs (Mocking the "Prediction" for visualization)
    const newChartData = [
      { subject: '附着力', A: adhesion, B: Math.min(10, adhesion + (Math.random() * 1 - 0.5)), fullMark: 10 },
      { subject: '内聚力', A: 8, B: 7.5 + Math.random(), fullMark: 10 },
      { subject: '粘度', A: (viscosity / 500), B: (viscosity / 500) + (Math.random() * 0.5 - 0.25), fullMark: 10 }, // Normalized roughly
      { subject: '成本', A: 7, B: 6 + Math.random() * 2, fullMark: 10 },
      { subject: '环保性', A: 6, B: 5 + Math.random() * 3, fullMark: 10 },
    ];
    setChartData(newChartData);

    try {
      const response = await generateFormulaRecommendation({
        targetAdhesion: adhesion,
        targetViscosity: viscosity,
        focus: focus,
      }, role);
      setResult(response);
    } catch (error) {
      console.error("Error generating formula:", error);
      setResult("生成推荐时出错，请重试。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-140px)]">
      {/* Left Panel: Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <FlaskConical className="text-teal-600" size={24} />
          <h2 className="text-lg font-semibold text-slate-800">配方约束条件</h2>
        </div>

        <div className="space-y-8 flex-1">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              目标附着力 (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={adhesion}
              onChange={(e) => setAdhesion(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>低 (1)</span>
              <span className="font-bold text-teal-700">{adhesion}</span>
              <span>高 (10)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              目标粘度 (cP)
            </label>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={viscosity}
              onChange={(e) => setViscosity(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>稀 (100)</span>
              <span className="font-bold text-teal-700">{viscosity} cP</span>
              <span>稠 (5000)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              优化侧重点
            </label>
            <select
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option>平衡性能</option>
              <option>最大化附着力</option>
              <option>最小化成本</option>
              <option>环保 (低 VOC)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={clsx(
            "w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all shadow-lg shadow-teal-900/10",
            isGenerating 
              ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
              : "bg-teal-600 hover:bg-teal-700 text-white"
          )}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              正在优化...
            </>
          ) : (
            <>
              <Zap size={18} />
              生成配方
            </>
          )}
        </button>
      </div>

      {/* Right Panel: Results */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">AI 推荐引擎</h3>
          {result && (
            <span className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-700 rounded flex items-center gap-1">
              <CheckCircle size={12} /> 已优化
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!result && !isGenerating && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <FlaskConical size={48} className="mb-4 opacity-20" />
              <p>调整约束条件并点击“生成配方”以查看 AI 推荐。</p>
            </div>
          )}

          {isGenerating && (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="h-32 bg-slate-100 rounded w-full mt-8" />
            </div>
          )}

          {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Text Result */}
              <div className="prose prose-sm max-w-none prose-slate prose-headings:text-teal-700 prose-table:border-collapse prose-td:border prose-td:border-slate-200 prose-td:p-2 prose-th:bg-slate-50 prose-th:p-2 prose-th:text-left">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result}
                </ReactMarkdown>
              </div>

              {/* Chart */}
              <div className="flex flex-col items-center justify-start pt-8">
                <h4 className="text-sm font-semibold text-slate-500 mb-4">性能预测</h4>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                      <Radar
                        name="目标"
                        dataKey="A"
                        stroke="#94A3B8"
                        strokeWidth={2}
                        fill="#94A3B8"
                        fillOpacity={0.1}
                      />
                      <Radar
                        name="预测"
                        dataKey="B"
                        stroke="#0D9488"
                        strokeWidth={2}
                        fill="#0D9488"
                        fillOpacity={0.4}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800 flex items-start gap-2">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <p>
                    <strong>注意:</strong> 预测基于历史数据回归。
                    中试生产前需要进行实验室验证。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
