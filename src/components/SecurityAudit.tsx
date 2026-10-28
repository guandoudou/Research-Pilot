
import React from 'react';
import { ShieldAlert, ShieldCheck, User, FileText, Clock } from 'lucide-react';
import { clsx } from 'clsx';

const LOGS = [
  { id: 1, time: '10:42 AM', user: '张博士 (专家)', action: '查看配方', resource: 'BG-23-A01', status: '允许', details: '完全访问权限' },
  { id: 2, time: '10:45 AM', user: '王工 (初级)', action: '查看配方', resource: 'BG-23-A01', status: '已脱敏', details: '供应商信息已屏蔽' },
  { id: 3, time: '11:05 AM', user: '王工 (初级)', action: '导出数据', resource: '原材料清单', status: '已拦截', details: '权限不足' },
  { id: 4, time: '11:15 AM', user: '张博士 (专家)', action: '修改配方', resource: 'BG-24-C05', status: '允许', details: '版本号递增' },
  { id: 5, time: '11:30 AM', user: '系统 (RAG Agent)', action: '索引文档', resource: 'Lab_Report_2025_02.pdf', status: '成功', details: '向量嵌入已更新' },
];

export function SecurityAudit() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-teal-600" size={20} />
          <h3 className="font-semibold text-slate-800">安全与合规日志</h3>
        </div>
        <div className="flex gap-2">
          <span className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-700 rounded flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            系统安全
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">时间戳</th>
              <th className="px-6 py-3">用户</th>
              <th className="px-6 py-3">操作</th>
              <th className="px-6 py-3">资源</th>
              <th className="px-6 py-3">状态</th>
              <th className="px-6 py-3">详情</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {LOGS.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    {log.time}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <User size={16} className="text-slate-400" />
                    {log.user}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{log.action}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <FileText size={14} className="text-slate-400" />
                    {log.resource}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={clsx(
                      "px-2 py-1 rounded-full text-xs font-medium border",
                      log.status === '允许' && "bg-emerald-50 text-emerald-700 border-emerald-100",
                      log.status === '成功' && "bg-blue-50 text-blue-700 border-blue-100",
                      log.status === '已脱敏' && "bg-amber-50 text-amber-700 border-amber-100",
                      log.status === '已拦截' && "bg-red-50 text-red-700 border-red-100"
                    )}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-xs">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
