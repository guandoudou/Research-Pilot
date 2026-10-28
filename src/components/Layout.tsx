
import React from 'react';
import { LayoutDashboard, Database, FlaskConical, ShieldCheck, Menu, User, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type View = 'dashboard' | 'knowledge' | 'formulation' | 'security';
export type Role = 'Senior Expert' | 'Junior Engineer';

interface LayoutProps {
  currentView: View;
  onViewChange: (view: View) => void;
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  children: React.ReactNode;
}

export function Layout({ currentView, onViewChange, currentRole, onRoleChange, children }: LayoutProps) {
  const navItems = [
    { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
    { id: 'knowledge', label: '知识库 (RAG)', icon: Database },
    { id: 'formulation', label: '配方实验室', icon: FlaskConical },
    { id: 'security', label: '安全审计', icon: ShieldCheck },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold tracking-tight text-teal-400">邦固化学 AI R&D</h1>
          <p className="text-xs text-slate-400 mt-1">多智能体协同系统</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as View)}
                className={twMerge(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-teal-600 text-white shadow-lg shadow-teal-900/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 text-slate-400 text-sm">
            <User size={16} />
            <span>{currentRole === 'Senior Expert' ? '张博士 (专家)' : '王工 (初级)'}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-lg font-semibold text-slate-800">
            {navItems.find(n => n.id === currentView)?.label}
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">当前角色视图:</span>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => onRoleChange('Senior Expert')}
                className={twMerge(
                  "px-4 py-1.5 rounded-md text-xs font-medium transition-all",
                  currentRole === 'Senior Expert' 
                    ? "bg-white text-teal-700 shadow-sm border border-slate-200" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                资深专家
              </button>
              <button
                onClick={() => onRoleChange('Junior Engineer')}
                className={twMerge(
                  "px-4 py-1.5 rounded-md text-xs font-medium transition-all",
                  currentRole === 'Junior Engineer' 
                    ? "bg-white text-teal-700 shadow-sm border border-slate-200" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                初级工程师
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
