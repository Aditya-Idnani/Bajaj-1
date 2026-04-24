import React, { useState } from 'react';
import { Loader2, Wand2, SendHorizonal, Check, AlertTriangle } from 'lucide-react';

export default function GraphInput({ onSubmit, loading }) {
  const [inputVal, setInputVal] = useState('{\n  "data": [\n    "A->B",\n    "A->C",\n    "B->D"\n  ]\n}');

  const handleFill = () => {
    setInputVal('{\n  "data": [\n    "A->B",\n    "A->C",\n    "B->D",\n    "D->E",\n    "X->Y"\n  ]\n}');
  };

  const getValidationState = () => {
    try {
      const parsed = JSON.parse(inputVal);
      if (parsed && Array.isArray(parsed.data)) {
        return { isValid: true, message: 'Valid JSON strictly formatted' };
      }
      return { isValid: false, message: 'Missing "data" string array' };
    } catch {
      return { isValid: false, message: 'Invalid JSON syntax' };
    }
  };

  const { isValid, message } = getValidationState();

  const submitForm = () => {
    if (isValid) {
      onSubmit(JSON.parse(inputVal));
    } else {
      onSubmit({ error_invalid_json: true });
    }
  };

  return (
    <div className="glass-panel p-6 flex flex-col gap-4 overflow-hidden relative h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />
      
      <div>
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
          Source Data
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
          Supply valid JSON with a "data" array containing directed edge relationships (e.g., "A-&gt;B"). Whitespace is ignored.
        </p>
      </div>
      
      <div className="relative group flex-1 flex flex-col min-h-[16rem]">
        <textarea
          className="w-full flex-1 p-5 rounded-xl font-mono text-sm bg-white/60 dark:bg-[#151b2b]/60 border border-gray-200/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/50 outline-none resize-none transition-all shadow-inner leading-relaxed"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          spellCheck={false}
        />
        <div className="absolute bottom-3 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-100 dark:border-gray-700 shadow-sm transition-all pointer-events-none">
          {isValid ? (
             <><Check size={14} className="text-emerald-500"/> <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{message}</span></>
          ) : (
             <><AlertTriangle size={14} className="text-amber-500"/> <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">{message}</span></>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleFill}
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl glass-panel hover:bg-black/5 dark:hover:bg-white/5 transition-all font-medium text-sm text-gray-700 dark:text-gray-200"
        >
          <Wand2 size={16} className="text-blue-500" />
          <span>Autofill</span>
        </button>
        <button
          onClick={submitForm}
          disabled={loading || !isValid}
          className="flex-[1.5] flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 dark:shadow-blue-500/10 hover:shadow-blue-500/40 disabled:opacity-50 disabled:grayscale-[30%]"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spinner" />
              <span>Parsing...</span>
            </>
          ) : (
            <>
              <SendHorizonal size={16} />
              <span>Generate Flow</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
