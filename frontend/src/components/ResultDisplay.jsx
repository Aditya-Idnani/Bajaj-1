import React from 'react';
import TreeView from './TreeView';
import GraphVisualizer from './GraphVisualizer';
import { Download, Trees, WrapText, CheckCircle, Database, AlertCircle, Mail } from 'lucide-react';

export default function ResultDisplay({ result }) {
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "bfhl_result.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="glass-panel p-5 lg:p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="flex justify-between items-center mb-5 relative z-10">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Analysis Overview
          </h2>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/40 dark:hover:to-blue-800/40 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 transition-all border border-gray-300/50 dark:border-gray-600/50 hover:border-blue-300 dark:hover:border-blue-500/50 shadow-sm"
          >
            <Download size={16} /> Export JSON
          </button>
        </div>
        
        <div className="flex flex-col gap-3 lg:gap-4 relative z-10">
          <div className="grid grid-cols-3 gap-3 lg:gap-4">
             <StatCard icon={<Trees size={18}/>} label="Total Trees" value={result.total_trees} />
             <StatCard icon={<WrapText size={18}/>} label="Total Cycles" value={result.total_cycles} />
             <StatCard icon={<CheckCircle size={18}/>} label="Largest Root" value={result.largest_tree_root || "N/A"} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
             <StatCard icon={<Database size={18}/>} label="Roll Number" value={result.college_roll_number} isText />
             <StatCard icon={<Mail size={18}/>} label="Email ID" value={result.email_id} isText />
          </div>
        </div>
      </div>

      <div className="glass-panel p-5 lg:p-6 flex flex-col gap-4 relative overflow-hidden flex-1 min-h-[400px]">
        <div className="flex items-center justify-between mb-1">
           <div className="flex items-center gap-3">
             <h3 className="text-lg font-bold">Interactive Graph</h3>
             <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 rounded-lg">Pan & Zoom</span>
           </div>
        </div>
        <div className="w-full h-full min-h-[300px] rounded-xl bg-gradient-to-br from-[#f8fafc] to-white dark:from-[#0d1323] dark:to-[#12192b] border border-gray-200/60 dark:border-gray-800 overflow-hidden relative shadow-inner">
           <GraphVisualizer trees={result.trees || []} />
        </div>
      </div>

      <div className="glass-panel p-5 lg:p-6 flex flex-col gap-3">
         <h3 className="text-lg font-bold">Hierarchical Data Elements</h3>
         <div className="bg-white/50 dark:bg-[#151b2b]/50 p-4 lg:p-5 rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-inner flex flex-col gap-3 max-h-[300px] overflow-y-auto">
           {(result.trees || []).every(t => Object.keys(t.tree || {}).length === 0 && !t.has_cycle) ? (
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">No nodes structured.</div>
           ) : null}
           
           {(result.trees || []).map((t, idx) => (
             <div key={idx}>
               {t.has_cycle ? (
                 <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 font-medium text-sm flex items-center gap-3">
                    <AlertCircle size={16} />
                    <span>Cycle identified near fallback root node: {t.root}</span>
                 </div>
               ) : (
                 <TreeView data={t.tree} depth={t.depth} defaultExpanded={idx === 0} />
               )}
             </div>
           ))}
         </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, isText }) {
  return (
    <div className="interactive-card p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 flex flex-col justify-center gap-1 h-full min-h-[6rem] relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 opacity-10 text-blue-500 transition duration-500 group-hover:scale-150 group-hover:opacity-20 group-hover:rotate-12 pointer-events-none">
         {icon}
      </div>
      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest z-10 relative">{label}</span>
      <span 
        className={`font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 z-10 relative leading-tight ${isText ? 'text-lg lg:text-xl break-words' : 'text-3xl'}`}
      >
        {value}
      </span>
    </div>
  );
}
