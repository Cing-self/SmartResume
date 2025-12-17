'use client';

import React from 'react';
import { Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'url';
  multiline?: boolean;
  onOptimize?: () => void;
  isOptimizing?: boolean;
  suggestions?: string[];
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  multiline = false,
  onOptimize,
  isOptimizing = false,
  suggestions = [],
  className
}) => {
  return (
    <div className={cn('mb-4', className)}>
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {onOptimize && value && value.length > 10 && (
          <button
            onClick={onOptimize}
            disabled={isOptimizing}
            className="text-xs flex items-center text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded transition-colors"
            title="使用 AI 润色这段文字"
          >
            {isOptimizing ? (
              <span className="animate-spin mr-1">⏳</span>
            ) : (
              <Wand2 className="w-3 h-3 mr-1" />
            )}
            AI 润色
          </button>
        )}
      </div>

      {multiline ? (
        <div className="space-y-2">
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] resize-none"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
          />
          {suggestions && suggestions.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-md p-3 animate-fadeIn">
              <p className="text-xs font-bold text-indigo-700 mb-2 flex items-center">
                <Wand2 className="w-3 h-3 mr-1" /> 选择一个优化版本替换:
              </p>
              <div className="space-y-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => onChange(suggestion)}
                    className="block w-full text-left text-xs text-gray-700 hover:bg-white p-2 rounded border border-transparent hover:border-indigo-200 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <input
          type={type}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};