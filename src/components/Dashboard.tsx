
import React from 'react';
import { TrendingUp, Clock, FileText, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '1月', successRate: 65 },
  { name: '2月', successRate: 68 },
  { name: '3月', successRate: 72 },
  { name: '4月', successRate: 75 },
  { name: '5月', successRate: 78 },
  { name: '6月', successRate: 82 },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 text-sm font-medium">平均检索时间</h3>
            <Clock className="text-teal-500" size={20} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">1.2 分钟</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <TrendingUp size={12} className="mr-1 rotate-180" /> -99.8%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">对比 5 天 (人工)</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 text-sm font-medium">配方成功率</h3>
            <CheckCircle className="text-indigo-500" size={20} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">82%</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <TrendingUp size={12} className="mr-1" /> +15%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">对比 67% (去年)</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 text-sm font-medium">知识资产</h3>
            <FileText className="text-blue-500" size={20} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">12,450</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <TrendingUp size={12} className="mr-1" /> +120
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">已索引 PDF & 报告</p>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">成功率趋势</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A', fontSize: '12px', fontWeight: 500 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="successRate" 
                  stroke="#0D9488" 
                  strokeWidth={3} 
                  dot={{ fill: '#0D9488', strokeWidth: 2, r: 4, stroke: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health / Agent Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">智能体状态</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-emerald-900">RAG Agent</p>
                  <p className="text-xs text-emerald-600">知识检索</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-200 px-2 py-1 rounded">在线</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-emerald-900">Formulation Agent</p>
                  <p className="text-xs text-emerald-600">配方优化</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-200 px-2 py-1 rounded">在线</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-emerald-900">Security Agent</p>
                  <p className="text-xs text-emerald-600">合规审计</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-200 px-2 py-1 rounded">在线</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">最近警报</h4>
            <div className="flex gap-3 items-start">
              <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={14} />
              <p className="text-xs text-slate-600">
                <span className="font-medium text-slate-900">Security Agent:</span> 已为用户 ID: 8821 (王工) 脱敏敏感供应商信息。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
