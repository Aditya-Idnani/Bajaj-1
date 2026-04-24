const parseInput = (data) => {
    const validEdges = [];
    const seenEdges = new Set();
    const regex = /^[A-Z]->[A-Z]$/;

    for (const item of data) {
        if (typeof item === 'string') {
            const trimmed = item.trim();
            if (regex.test(trimmed)) {
                if (!seenEdges.has(trimmed)) {
                    seenEdges.add(trimmed);
                    validEdges.push(trimmed);
                }
            }
        }
    }
    return validEdges;
};

const buildTreeData = (data) => {
    const edges = parseInput(data);
    
    const parentMap = new Map();
    const childrenMap = new Map();
    const allNodes = new Set();
    
    for (const edge of edges) {
        const [u, v] = edge.split('->');
        allNodes.add(u);
        allNodes.add(v);
        
        if (!childrenMap.has(u)) childrenMap.set(u, []);
        if (!childrenMap.has(v)) childrenMap.set(v, []);
        
        if (!parentMap.has(v)) {
            parentMap.set(v, u);
            childrenMap.get(u).push(v);
        }
    }
    
    const unvisited = new Set(allNodes);
    const groups = [];
    
    const adjUndirected = new Map();
    for (const node of allNodes) {
        adjUndirected.set(node, []);
    }
    for (const [v, u] of parentMap.entries()) {
        adjUndirected.get(u).push(v);
        adjUndirected.get(v).push(u);
    }
    
    for (const node of allNodes) {
        if (unvisited.has(node)) {
            const groupNodes = new Set();
            const queue = [node];
            unvisited.delete(node);
            groupNodes.add(node);
            
            while (queue.length > 0) {
                const curr = queue.shift();
                for (const neighbor of adjUndirected.get(curr)) {
                    if (unvisited.has(neighbor)) {
                        unvisited.delete(neighbor);
                        groupNodes.add(neighbor);
                        queue.push(neighbor);
                    }
                }
            }
            groups.push(Array.from(groupNodes));
        }
    }
    
    let total_trees = 0;
    let total_cycles = 0;
    let largest_tree_root = null;
    let maxPathLength = 0;
    
    const results = [];
    
    for (const group of groups) {
        let root = null;
        const possibleRoots = [];
        for (const node of group) {
            if (!parentMap.has(node)) {
                possibleRoots.push(node);
            }
        }
        
        if (possibleRoots.length > 0) {
            possibleRoots.sort();
            root = possibleRoots[0];
        } else {
            group.sort();
            root = group[0];
        }
        
        const color = new Map();
        for (const node of group) color.set(node, 'WHITE');
        let hasCycle = false;
        
        const checkCycle = (curr) => {
            color.set(curr, 'GRAY');
            const children = childrenMap.get(curr) || [];
            for (const child of children) {
                if (color.get(child) === 'GRAY') {
                    hasCycle = true;
                } else if (color.get(child) === 'WHITE') {
                    checkCycle(child);
                }
            }
            color.set(curr, 'BLACK');
        };
        
        for (const node of group) {
            if (color.get(node) === 'WHITE') {
                checkCycle(node);
            }
        }
        
        if (hasCycle) {
            total_cycles += 1;
            results.push({
                root: root,
                tree: {},
                has_cycle: true
            });
        } else {
            total_trees += 1;
            
            const buildObj = (n) => {
                const obj = {};
                const children = childrenMap.get(n) || [];
                for (const child of children) {
                    obj[child] = buildObj(child);
                }
                return obj;
            };
            
            const treeObj = {};
            treeObj[root] = buildObj(root);
            
            let maxDepth = 0;
            const getDepth = (n, depth) => {
                maxDepth = Math.max(maxDepth, depth);
                const children = childrenMap.get(n) || [];
                for (const child of children) {
                    getDepth(child, depth + 1);
                }
            };
            getDepth(root, 1);
            
            results.push({
                root: root,
                tree: treeObj,
                has_cycle: false,
                depth: maxDepth
            });
            
            if (maxDepth > maxPathLength) {
                maxPathLength = maxDepth;
                largest_tree_root = root;
            } else if (maxDepth === maxPathLength) {
                if (largest_tree_root === null || root < largest_tree_root) {
                    largest_tree_root = root;
                }
            }
        }
    }
    
    return {
        trees: results,
        total_trees,
        total_cycles,
        largest_tree_root
    };
};

module.exports = { buildTreeData };
