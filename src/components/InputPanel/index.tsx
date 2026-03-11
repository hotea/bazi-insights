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
    <div className="glass-card p-8 rounded-3xl">
      <h2 className="text-2xl font-bold mb-8 text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
        出生信息输入
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 日期选择 */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">出生日期</label>
          <div className="flex gap-3">
            <input
              type="number"
              name="year"
              value={input.year}
              onChange={handleChange}
              className="glass-input w-full px-4 py-3 rounded-xl text-center"
              placeholder="年"
            />
            <input
              type="number"
              name="month"
              value={input.month}
              onChange={handleChange}
              className="glass-input w-full px-4 py-3 rounded-xl text-center"
              placeholder="月"
            />
            <input
              type="number"
              name="day"
              value={input.day}
              onChange={handleChange}
              className="glass-input w-full px-4 py-3 rounded-xl text-center"
              placeholder="日"
            />
          </div>
        </div>

        {/* 时间选择 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">出生时间</label>
          <div className="flex gap-3">
            <input
              type="number"
              name="hour"
              value={input.hour}
              onChange={handleChange}
              className="glass-input w-full px-4 py-3 rounded-xl text-center"
              placeholder="时"
            />
            <input
              type="number"
              name="minute"
              value={input.minute}
              onChange={handleChange}
              className="glass-input w-full px-4 py-3 rounded-xl text-center"
              placeholder="分"
            />
          </div>
        </div>

        {/* 性别选择 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">性别</label>
          <select
            name="gender"
            value={input.gender}
            onChange={handleChange}
            className="glass-input w-full px-4 py-3 rounded-xl appearance-none cursor-pointer"
          >
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </div>

        {/* 经度输入 */}
        <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-1">
          <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">出生地经度</label>
          <input
            type="number"
            name="longitude"
            value={input.longitude}
            onChange={handleChange}
            step="0.1"
            className="glass-input w-full px-4 py-3 rounded-xl"
          />
        </div>
      </div>

      <button
        onClick={() => useBaZiStore.getState().calculate()}
        className="mt-10 w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98]"
      >
        立即排盘
      </button>
    </div>
  );
};

export default InputPanel;
