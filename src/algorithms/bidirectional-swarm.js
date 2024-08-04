export function bidirectionalSwarm(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const startOpenSet = [startNode];
  const finishOpenSet = [finishNode];

  const startVisited = new Map();
  const finishVisited = new Map();

  startNode.g = 0;
  startNode.f = heuristic(startNode, finishNode);
  finishNode.g = 0;
  finishNode.f = heuristic(finishNode, startNode);

  startVisited.set(startNode, null);
  finishVisited.set(finishNode, null);

  while (startOpenSet.length > 0 && finishOpenSet.length > 0) {
    const startCurrentNode = getLowestFScoreNode(startOpenSet);
    const finishCurrentNode = getLowestFScoreNode(finishOpenSet);

    if (startCurrentNode) {
      visitedNodesInOrder.push(startCurrentNode);
      startCurrentNode.isVisited = true;

      if (finishVisited.has(startCurrentNode)) {
        return {
          visitedNodesInOrder,
          nodesInShortestPathOrder: reconstructPath(startCurrentNode, finishVisited.get(startCurrentNode), startVisited, finishVisited)
        };
      }

      startOpenSet.splice(startOpenSet.indexOf(startCurrentNode), 1);
      const startNeighbors = getUnvisitedNeighbors(startCurrentNode, grid);
      for (const neighbor of startNeighbors) {
        const tentativeG = startCurrentNode.g + 1;
        if (!startVisited.has(neighbor) || tentativeG < neighbor.g) {
          neighbor.previousNode = startCurrentNode;
          neighbor.g = tentativeG;
          neighbor.f = neighbor.g + heuristic(neighbor, finishNode);
          startVisited.set(neighbor, startCurrentNode);
          if (!startOpenSet.includes(neighbor)) {
            startOpenSet.push(neighbor);
          }
        }
      }
    }

    if (finishCurrentNode) {
      visitedNodesInOrder.push(finishCurrentNode);
      finishCurrentNode.isVisited = true;

      if (startVisited.has(finishCurrentNode)) {
        return {
          visitedNodesInOrder,
          nodesInShortestPathOrder: reconstructPath(startVisited.get(finishCurrentNode), finishCurrentNode, startVisited, finishVisited)
        };
      }

      finishOpenSet.splice(finishOpenSet.indexOf(finishCurrentNode), 1);
      const finishNeighbors = getUnvisitedNeighbors(finishCurrentNode, grid);
      for (const neighbor of finishNeighbors) {
        const tentativeG = finishCurrentNode.g + 1;
        if (!finishVisited.has(neighbor) || tentativeG < neighbor.g) {
          neighbor.previousNode = finishCurrentNode;
          neighbor.g = tentativeG;
          neighbor.f = neighbor.g + heuristic(neighbor, startNode);
          finishVisited.set(neighbor, finishCurrentNode);
          if (!finishOpenSet.includes(neighbor)) {
            finishOpenSet.push(neighbor);
          }
        }
      }
    }
  }

  return { visitedNodesInOrder, nodesInShortestPathOrder: [] }; // No path found
}

function reconstructPath(meetingNodeStart, meetingNodeFinish, startVisited, finishVisited) {
  const nodesInShortestPathOrder = [];
  let currentNode = meetingNodeStart;

  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = startVisited.get(currentNode);
  }

  currentNode = finishVisited.get(meetingNodeFinish);
  nodesInShortestPathOrder.push(meetingNodeFinish);
  
  while (currentNode !== null) {
    nodesInShortestPathOrder.push(currentNode);
    currentNode = finishVisited.get(currentNode);
  }

  return nodesInShortestPathOrder;
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
}

function heuristic(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

function getLowestFScoreNode(openSet) {
  return openSet.reduce((minNode, node) => (node.f < minNode.f ? node : minNode), openSet[0]);
}

export function getNodesInShortestPathOrderFromBidirectionalSwarm(startNode, finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;

  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  currentNode = startNode.previousNode;

  while (currentNode !== null) {
    nodesInShortestPathOrder.push(currentNode);
    currentNode = currentNode.previousNode;
  }

  return nodesInShortestPathOrder;
}
