// Performs A* algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
export function astar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const openList = [startNode];
  const closedList = new Set();
  
  startNode.g = 0;
  startNode.h = manhattanDistance(startNode, finishNode);
  startNode.f = startNode.h;

  while (openList.length > 0) {
    sortNodesByF(openList);
    const currentNode = openList.shift();
    
    if (currentNode === finishNode) {
      return visitedNodesInOrder;
    }

    closedList.add(currentNode);
    visitedNodesInOrder.push(currentNode);

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (closedList.has(neighbor) || neighbor.isWall) {
        continue;
      }

      const tentativeG = currentNode.g + 1;

      if (!openList.includes(neighbor)) {
        openList.push(neighbor);
      } else if (tentativeG >= neighbor.g) {
        continue;
      }

      neighbor.previousNode = currentNode;
      neighbor.g = tentativeG;
      neighbor.h = manhattanDistance(neighbor, finishNode);
      neighbor.f = neighbor.g + neighbor.h;
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

function sortNodesByF(nodes) {
  nodes.sort((a, b) => a.f - b.f);
}

function manhattanDistance(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the astar method above.
export function getNodesInShortestPathOrderFromAStar(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}