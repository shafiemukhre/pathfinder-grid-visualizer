// Performs Greedy Best-First Search; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
export function greedyBFS(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const openList = [startNode];
    startNode.isVisited = true;
  
    while (openList.length) {
      sortNodesByHeuristic(openList, finishNode);
      const currentNode = openList.shift();
      if (currentNode.isWall) continue;
      visitedNodesInOrder.push(currentNode);
  
      if (currentNode === finishNode) return visitedNodesInOrder;
  
      const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of unvisitedNeighbors) {
        neighbor.isVisited = true;
        neighbor.previousNode = currentNode;
        openList.push(neighbor);
      }
    }
    return visitedNodesInOrder;
  }
  
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
  }
  
  function sortNodesByHeuristic(nodes, finishNode) {
    nodes.sort((a, b) => 
      manhattanDistance(a, finishNode) - manhattanDistance(b, finishNode)
    );
  }
  
  function manhattanDistance(nodeA, nodeB) {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
  }
  
  // Backtracks from the finishNode to find the shortest path.
  // Only works when called *after* the greedyBFS method above.
  export function getNodesInShortestPathOrderFromGreedyBFS(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }