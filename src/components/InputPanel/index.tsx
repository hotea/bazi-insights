import React from 'react';
import { useBaZiStore } from '../../store';

/**
 * 输入面板组件
 */
const InputPanel: React.FC = () => {
  const { input, setInput } = useBaZiStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    setInput({ [name]: val });
  };

  return (
    <div className="glass-card p-10 rounded-[2.5rem]">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-4">
          <span className="w-2.5 h-10 bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]"></span>
          出生信息输入
        </h2>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
           <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Precise Calculation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* 日期选择 */}
        <div className="flex flex-col gap-3 md:col-span-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            出生日期
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              name="year"
              value={input.year}
              onChange={handleChange}
              className="glass-input w-full px-5 py-4 rounded-2xl text-center font-bold text-lg"
              placeholder="年"
            />
            <input
              type="number"
              name="month"
              value={input.month}
              onChange={handleChange}
              className="glass-input w-full px-5 py-4 rounded-2xl text-center font-bold text-lg"
              placeholder="月"
            />
            <input
              type="number"
              name="day"
              value={input.day}
              onChange={handleChange}
              className="glass-input w-full px-5 py-4 rounded-2xl text-center font-bold text-lg"
              placeholder="日"
            />
          </div>
        </div>

        {/* 时间选择 */}
        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            出生时间
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              name="hour"
              value={input.hour}
              onChange={handleChange}
              className="glass-input w-full px-5 py-4 rounded-2xl text-center font-bold text-lg"
              placeholder="时"
            />
            <input
              type="number"
              name="minute"
              value={input.minute}
              onChange={handleChange}
              className="glass-input w-full px-5 py-4 rounded-2xl text-center font-bold text-lg"
              placeholder="分"
            />
          </div>
        </div>

        {/* 性别选择 */}
        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            性别
          </label>
          <div className="relative">
            <select
              name="gender"
              value={input.gender}
              onChange={handleChange}
              className="glass-input w-full px-6 py-4 rounded-2xl appearance-none cursor-pointer font-bold text-lg"
            >
              <option value="male">男 (Yang)</option>
              <option value="female">女 (Yin)</option>
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
            </div>
          </div>
        </div>

        {/* 经度输入 */}
        <div className="flex flex-col gap-3 md:col-span-2 lg:col-span-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/></svg>
            出生地经度
          </label>
          <input
            type="number"
            name="longitude"
            value={input.longitude}
            onChange={handleChange}
            step="0.1"
            className="glass-input w-full px-6 py-4 rounded-2xl font-bold text-lg"
          />
        </div>
      </div>

      <div className="mt-12 group flex items-center">
        <button
          onClick={() => useBaZiStore.getState().calculate()}
          className="pro-button w-full flex items-center justify-center gap-3 text-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          立即排盘
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></span>
        </button>
      </div>
    </div>
  );
};

export default InputPanel;
