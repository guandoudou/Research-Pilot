
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Bot, User, Sparkles, Loader2, Plus, FileText } from 'lucide-react';
import { queryKnowledgeBase, UserRole } from '../services/geminiService';
import { clsx } from 'clsx';

interface KnowledgeBaseProps {
  role: UserRole;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'process-log';
}

const SUGGESTED_QUERIES = [
  "查找2023年的高光泽面漆配方",
  "为什么配方 BG-23-B12 失败了？",
  "列出所有使用乙酸丁酯的配方",
  "使用高含量 MMA 有什么风险？",
];

export function KnowledgeBase({ role }: KnowledgeBaseProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `您好！我是邦固化学的 **RAG Agent**。我可以访问 10 年的历史配方数据。
      \n\n**当前访问级别:** ${role === 'Senior Expert' ? '资深专家 (完全访问)' : '初级工程师 (已脱敏)'}
      \n\n请问有什么可以帮您？`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isUploading]);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await queryKnowledgeBase(text, role);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || "我没有找到相关信息。",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error querying knowledge base:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "抱歉，遇到错误，请重试。",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const addProcessLog = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: text,
        timestamp: new Date(),
        type: 'process-log',
      },
    ]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. User uploads file
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `已上传文件: **${file.name}**`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsUploading(true);

    // Mock parsed content from the "document"
    const mockDocContent = `
**解析到的需求文档内容：**
- **项目**: 新款电动车内饰触感漆
- **基材**: PC/ABS 合金
- **关键指标**: 
  - 附着力: 5B (0级)
  - 耐磨性: RCA > 300次
  - 手感: 绒感细腻
- **环保要求**: 符合 GB 30981-2020
- **成本目标**: < 25 元/kg
    `.trim();

    // 2. Simulate multi-agent workflow
    setTimeout(() => {
      addProcessLog("正在读取文件流...");
      
      setTimeout(() => {
        addProcessLog("NLP 引擎正在解析非结构化文本...");
        // Show the parsed content to the user to make it feel real
        setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: `### 📄 文档解析成功
系统已自动提取关键技术指标：

${mockDocContent}

正在启动多智能体协同分析...`,
          timestamp: new Date(),
        }]);

        setTimeout(() => {
          addProcessLog("RAG Agent 正在检索 'PC/ABS' 相关历史配方...");
          
          setTimeout(() => {
            addProcessLog("Formulation Agent 正在平衡 '绒感' 与 '耐磨性'...");
            
            setTimeout(() => {
              addProcessLog("Security Agent 正在审查原材料合规性...");
              
              setTimeout(async () => {
                setIsUploading(false);
                
                // Construct a specific prompt based on the mock doc content
                const prompt = `
我上传了一份客户需求文档，内容如下：
${mockDocContent}

请基于上述需求：
1. 推荐一个最接近的历史参考配方。
2. 分析技术难点（特别是绒感和耐磨性的平衡）。
3. 给出具体的配方调整建议。
`;
                const response = await queryKnowledgeBase(prompt, role);
                
                const aiMsg: Message = {
                  id: (Date.now() + 100).toString(),
                  role: 'assistant',
                  content: response || "分析生成失败，请重试。",
                  timestamp: new Date(),
                };
                setMessages((prev) => [...prev, aiMsg]);
              }, 1000);
            }, 1500);
          }, 1500);
        }, 1500);
      }, 1500);
    }, 1000);

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-teal-500" size={18} />
          <h3 className="font-semibold text-slate-800">RAG 知识助手</h3>
        </div>
        <span className="text-xs font-medium px-2 py-1 bg-slate-200 text-slate-600 rounded">
          上下文: {role === 'Senior Expert' ? '完全访问' : '已脱敏 (初级)'}
        </span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg) => {
          if (msg.type === 'process-log') {
            return (
              <div key={msg.id} className="flex gap-4 max-w-3xl animate-pulse">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-transparent">
                </div>
                <div className="px-5 py-2 rounded-lg text-xs font-mono text-slate-500 bg-slate-100 border border-slate-200 flex items-center gap-2">
                  <Loader2 size={12} className="animate-spin text-teal-500" />
                  {msg.content}
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={clsx(
                "flex gap-4 max-w-3xl",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  msg.role === 'assistant' ? "bg-teal-100 text-teal-600" : "bg-slate-200 text-slate-600"
                )}
              >
                {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
              </div>
              
              <div
                className={clsx(
                  "px-5 py-3.5 rounded-2xl text-sm shadow-sm",
                  msg.role === 'assistant' 
                    ? "bg-white border border-slate-100 text-slate-800" 
                    : "bg-teal-600 text-white"
                )}
              >
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none prose-slate prose-headings:font-semibold prose-a:text-teal-600">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {msg.content.includes('已上传文件') && <FileText size={16} />}
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
                <span className="text-[10px] opacity-50 mt-2 block text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        {isLoading && !isUploading && (
          <div className="flex gap-4 max-w-3xl">
            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
              <Bot size={18} />
            </div>
            <div className="bg-white px-5 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
              <Loader2 className="animate-spin text-teal-500" size={16} />
              <span className="text-sm text-slate-500">正在检索 12,450 份文档...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        {/* Suggested Queries */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {SUGGESTED_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-600 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt"
          />
          <div className="flex flex-col gap-1">
             <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isUploading}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl px-3 py-3 flex items-center justify-center transition-colors border border-slate-200 h-full"
              title="上传需求文档"
            >
              <Plus size={20} />
            </button>
          </div>
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="询问历史配方、成分或失败案例..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            disabled={isLoading || isUploading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || isUploading || !inputValue.trim()}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl px-4 flex items-center justify-center transition-colors shadow-sm shadow-teal-600/20"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-2 text-right">
            <button 
                onClick={() => {
                    const content = `项目名称: 新款电动车内饰触感漆\n基材类型: PC/ABS 合金\n关键技术指标:\n1. 附着力: 5B (0级)\n2. 耐磨性: RCA > 300次\n3. 手感要求: 绒感细腻，肤感好\n环保要求: 符合国标 GB 30981-2020\n成本目标: 控制在 25 元/kg 以内`;
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = '客户需求_电动车内饰漆.txt';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }}
                className="text-xs text-teal-600 hover:text-teal-700 hover:underline flex items-center justify-end gap-1"
            >
                <FileText size={12} />
                下载示例需求文档
            </button>
        </div>
      </div>
    </div>
  );
}
