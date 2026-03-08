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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">出生信息输入</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 日期选择 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">出生日期</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="year"
              value={input.year}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-600"
              placeholder="年"
            />
            <input
              type="number"
              name="month"
              value={input.month}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-600"
              placeholder="月"
            />
            <input
              type="number"
              name="day"
              value={input.day}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-600"
              placeholder="日"
            />
          </div>
        </div>

        {/* 时间选择 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">出生时间</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="hour"
              value={input.hour}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-600"
              placeholder="时"
            />
            <input
              type="number"
              name="minute"
              value={input.minute}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-600"
              placeholder="分"
            />
          </div>
        </div>

        {/* 性别选择 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">性别</label>
          <select
            name="gender"
            value={input.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-600"
          >
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </div>

        {/* 经度输入 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">出生地经度</label>
          <input
            type="number"
            name="longitude"
            value={input.longitude}
            onChange={handleChange}
            step="0.1"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-600"
          />
        </div>
      </div>

      <button
        onClick={() => useBaZiStore.getState().calculate()}
        className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
      >
        立即排盘
      </button>
    </div>
  );
};

export default InputPanel;
