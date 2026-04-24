import React, { useState } from 'react';
import { ChevronRight, Layers } from 'lucide-react';

const colors = [
  'border-blue-200 dark:border-blue-800/50',
  'border-indigo-200 dark:border-indigo-800/50',
  'border-purple-200 dark:border-purple-800/50',
  'border-pink-200 dark:border-pink-800/50',
];

export default function TreeView({ data, depth, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (!data || Object.keys(data).length === 0) return null;
  const root = Object.keys(data)[0];

  return (
    <div className="w-full">
      <div 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between bg-white dark:bg-[#1a2133] p-2.5 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm cursor-pointer hover:border-blue-300 dark:hover:border-blue-500/50 transition-all group"
      >
        <div className="flex items-center gap-2">
           <div className={`p-0.5 rounded-md transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`}>
             <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500" />
           </div>
           <div className="flex items-center gap-2">
             <Layers size={14} className="text-blue-500" />
             <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">Root Node <span className="text-blue-600 dark:text-blue-400">"{root}"</span></span>
           </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 px-2 py-1 rounded border border-blue-100 dark:border-blue-500/20">
          Depth: {depth}
        </span>
      </div>
      
      <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] mt-1.5 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
         <div className="overflow-hidden">
           <div className="pl-5 ml-3">
             <TreeNode node={root} childrenObj={data[root]} level={0} />
           </div>
         </div>
      </div>
    </div>
  );
}

function TreeNode({ node, childrenObj, level }) {
  const childrenKeys = Object.keys(childrenObj || {});
  if (childrenKeys.length === 0) return null;

  const colorClass = colors[level % colors.length];

  return (
    <div className={`relative pl-6 pb-1 border-l-2 ${colorClass}`}>
      {childrenKeys.map((childKey, index) => {
        return (
          <div key={childKey} className="relative pt-3">
            <div className="tree-line-h w-4 left-[-16px] top-[18px]"></div>
            <div className={`flex items-center gap-2`}>
              <div className="px-2.5 py-1 bg-white dark:bg-[#1a2133] rounded-md border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm z-10 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors cursor-default">
                {childKey}
              </div>
            </div>
            
            <div className="relative">
               <TreeNode node={childKey} childrenObj={childrenObj[childKey]} level={level + 1} />
            </div>
          </div>
        )
      })}
    </div>
  );
}
