import React, { useMemo, useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export default function GraphVisualizer({ trees }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  const { nodes, edges, maxW, maxH } = useMemo(() => {
    let resultNodes = [];
    let resultEdges = [];
    let currentXOffset = 20;
    let maximumH = 0;

    const buildLayout = (nodeId, treeObj, depth, xOffset) => {
      const children = Object.keys(treeObj);
      const y = depth * 100 + 40;
      maximumH = Math.max(maximumH, y + 40);

      if (children.length === 0) {
        return { width: 50, x: xOffset, y, id: nodeId, label: nodeId };
      }

      let childOffset = xOffset;
      const childLayouts = [];

      for (const child of children) {
        const layout = buildLayout(child, treeObj[child], depth + 1, childOffset);
        childLayouts.push({ id: child, label: child, ...layout });
        childOffset += layout.width + 30;
      }

      const totalWidth = childOffset - xOffset - 30;
      const x = xOffset + totalWidth / 2;

      for (const cl of childLayouts) {
        resultNodes.push({ id: cl.id, label: cl.label, x: cl.x, y: cl.y });
        resultEdges.push({ fromX: x + 20, fromY: y + 40, toX: cl.x + 20, toY: cl.y });
      }

      return { width: totalWidth, x, y, id: nodeId, label: nodeId };
    };

    for (const data of trees) {
      if (data.has_cycle) {
        const root = data.root;
        resultNodes.push({ id: `${root}_cycle`, label: root, x: currentXOffset, y: 40, isCycle: true });
        currentXOffset += 100;
        maximumH = Math.max(maximumH, 100);
      } else {
        const rootRaw = Object.keys(data.tree)[0];
        if (rootRaw) {
          const l = buildLayout(rootRaw, data.tree[rootRaw], 0, currentXOffset);
          resultNodes.push({ id: rootRaw, label: rootRaw, x: l.x, y: l.y });
          currentXOffset += l.width + 60;
        }
      }
    }

    return { nodes: resultNodes, edges: resultEdges, maxW: currentXOffset, maxH: maximumH };
  }, [trees]);

  const centerGraph = () => {
    if (maxW > 0 || maxH > 0) {
      const targetScale = Math.min(1.2, Math.min(dimensions.width / (maxW + 80), dimensions.height / (maxH + 80)));
      const cx = (dimensions.width - (maxW + 30) * targetScale) / 2;
      const cy = (dimensions.height - (maxH + 30) * targetScale) / 2;
      setTransform({ x: cx, y: Math.max(cy, 40), scale: targetScale });
    }
  };

  useEffect(() => {
    centerGraph();
  }, [maxW, maxH, dimensions]);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      const scaleAmount = -e.deltaY * 0.002;
      setTransform(prev => {
        let newScale = prev.scale + scaleAmount;
        newScale = Math.min(Math.max(0.2, newScale), 3);
        return { ...prev, scale: newScale };
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (factor) => {
    setTransform(prev => ({
       ...prev,
       scale: Math.min(Math.max(0.2, prev.scale + factor), 3)
    }));
  };

  return (
    <div className="absolute inset-0 block w-full h-full">
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
         <button onClick={() => handleZoom(0.2)} className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg shadow border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-blue-500 hover:border-blue-300 transition-all">
           <ZoomIn size={18} />
         </button>
         <button onClick={() => handleZoom(-0.2)} className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg shadow border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-blue-500 hover:border-blue-300 transition-all">
           <ZoomOut size={18} />
         </button>
         <button onClick={centerGraph} className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg shadow border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-blue-500 hover:border-blue-300 transition-all">
           <Maximize size={18} />
         </button>
      </div>

      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} overflow-hidden relative touch-none`}
      >
        <div style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: '0 0' }} className="absolute inset-0 transition-transform duration-100 ease-out will-change-transform">
          <svg width={Math.max(1000, maxW + 200)} height={Math.max(1000, maxH + 200)} className="absolute inset-0 overflow-visible">
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {edges.map((e, i) => (
              <path
                key={`edge-${i}`}
                d={`M ${e.fromX} ${e.fromY} L ${e.toX} ${e.toY}`}
                stroke="currentColor"
                fill="none"
                className="text-gray-300 dark:text-gray-700 hover:text-blue-400 dark:hover:text-blue-500 transition-colors duration-300"
                strokeWidth="2.5"
              />
            ))}
            {nodes.map((n) => (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`} className="group">
                <circle
                  cx="20"
                  cy="20"
                  r="20"
                  filter="url(#glow)"
                  className={`${n.isCycle ? "fill-red-100 dark:fill-red-900/40 stroke-red-500" : "fill-white dark:fill-gray-800 stroke-blue-500 dark:stroke-indigo-400"} group-hover:stroke-4 transition-all duration-300 cursor-pointer shadow-lg`}
                  strokeWidth="3"
                />
                <text
                  x="20"
                  y="20"
                  dominantBaseline="central"
                  textAnchor="middle"
                  className="text-sm font-bold fill-gray-800 dark:fill-gray-100 pointer-events-none group-hover:scale-110 transition-transform origin-center"
                >
                  {n.label}
                </text>
                {n.isCycle && (
                   <text x="20" y="52" dominantBaseline="central" textAnchor="middle" className="text-xs fill-red-500 font-bold uppercase tracking-widest drop-shadow-sm pointer-events-none">Blocked</text>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
