export function bidirectionalSearch(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const startQueue = [startNode];
  const finishQueue = [finishNode];

  const startVisited = new Map();
  const finishVisited = new Map();

  startVisited.set(startNode, null);
  finishVisited.set(finishNode, null);

  while (startQueue.length && finishQueue.length) {
    const startCurrentNode = startQueue.shift();
    const finishCurrentNode = finishQueue.shift();

    if (startCurrentNode) {
      visitedNodesInOrder.push(startCurrentNode);
      startCurrentNode.isVisited = true;

      // Check if the current node from the start side has been visited by the finish side
      if (finishVisited.has(startCurrentNode)) {
        // Meeting node found, reconstruct the path
        return {
          visitedNodesInOrder,
          nodesInShortestPathOrder: reconstructPath(startCurrentNode, finishVisited.get(startCurrentNode), startVisited, finishVisited)
        };
      }

      const startNeighbors = getUnvisitedNeighbors(startCurrentNode, grid);
      for (const neighbor of startNeighbors) {
        if (!startVisited.has(neighbor)) {
          neighbor.previousNode = startCurrentNode;
          startVisited.set(neighbor, startCurrentNode);
          startQueue.push(neighbor);
        }
      }
    }

    if (finishCurrentNode) {
      visitedNodesInOrder.push(finishCurrentNode);
      finishCurrentNode.isVisited = true;

      // Check if the current node from the finish side has been visited by the start side
      if (startVisited.has(finishCurrentNode)) {
        // Meeting node found, reconstruct the path
        return {
          visitedNodesInOrder,
          nodesInShortestPathOrder: reconstructPath(startVisited.get(finishCurrentNode), finishCurrentNode, startVisited, finishVisited)
        };
      }

      const finishNeighbors = getUnvisitedNeighbors(finishCurrentNode, grid);
      for (const neighbor of finishNeighbors) {
        if (!finishVisited.has(neighbor)) {
          neighbor.previousNode = finishCurrentNode;
          finishVisited.set(neighbor, finishCurrentNode);
          finishQueue.push(neighbor);
        }
      }
    }
  }

  return { visitedNodesInOrder, nodesInShortestPathOrder: [] }; // No path found
}

function reconstructPath(meetingNodeStart, meetingNodeFinish, startVisited, finishVisited) {
  const nodesInShortestPathOrder = [];
  let currentNode = meetingNodeStart;

  // Reconstruct the path from the start to the meeting point
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = startVisited.get(currentNode);
  }

  // Skip the meeting node since it's already included
  currentNode = finishVisited.get(meetingNodeFinish);
  nodesInShortestPathOrder.push(meetingNodeFinish)
  
  // Reconstruct the path from the meeting point to the finish
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

export function getNodesInShortestPathOrderFromBidirectional(startNode, finishNode) {
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
