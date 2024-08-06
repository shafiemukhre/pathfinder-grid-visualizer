import { useEffect, useState, useRef } from "react";
import Node from "./Node";
import { dijkstra, getNodesInShortestPathOrderFromDijkstra } from "@algorithms/dijkstra";
import { bfs, getNodesInShortestPathOrderFromBFS } from "@algorithms/bfs";
import { greedyBFS, getNodesInShortestPathOrderFromGreedyBFS } from "@algorithms/greedy-bfs";
import { dfs, getNodesInShortestPathOrderFromDFS } from "@algorithms/dfs";
import { bidirectionalSearch } from "@algorithms/bdfs";
// import { bidirectionalSwarm, getNodesInShortestPathOrderFromBidirectionalSwarm } from "@algorithms/bidirectional-swarm";
import { astar, getNodesInShortestPathOrderFromAStar } from "@algorithms/astar";


interface NodeObject {
  col: number,
  row: number,
  isStart: boolean,
  isFinish: boolean,
  isVisited: boolean,
  isWall: boolean,
}

export default function Grid() {
  const [grid, setGrid] = useState<NodeObject[][]>([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const nodeRefs = useRef<{ [key: string]: HTMLTableCellElement | null }>({});
  const timeouts = useRef<any[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState<string | null>('0 seconds');
  const [algorithmInfo, setAlgorithmInfo] = useState({ nodesVisited: 0, pathLength: 0 });
  const [algorithm, setAlgorithm] = useState<string | null>(null);

  useEffect(() => {
    setGrid(getInitialGrid());
  }, []); // only once

  useEffect(() => {
    if (startTime && endTime) {
      const diffInMilliseconds = endTime.getTime() - startTime.getTime();
      setDuration(`${(diffInMilliseconds / 1000).toFixed(3)} seconds`);
    }
  }, [endTime]);

  function handleMouseDown(row: number, col: number) {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setMouseIsPressed(true);
    setGrid(newGrid);
  }

  function handleMouseEnter(row: number, col: number) {
    if (!mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  }

  function handleMouseUp() {
    setMouseIsPressed(false);
  }

  function animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      // finale shortest path line
      if (i === visitedNodesInOrder.length) {
        const timeout = setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 20 * i);
        timeouts.current.push(timeout);
      }

      // in-progress animation
      const timeout = setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node) {
          node.isVisited = true; // Update the state of the node
          const nodeRefKey = `node-${node.row}-${node.col}`;
          if (!node.isStart && !node.isFinish && nodeRefs.current[nodeRefKey]) {
            nodeRefs.current[nodeRefKey].className = 'node node-visited';
          }
        }
      }, 20 * i);
      timeouts.current.push(timeout);
    }
  }

  function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      const timeout = setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const nodeRefKey = `node-${node.row}-${node.col}`;
        if (!node.isStart && !node.isFinish && nodeRefs.current[nodeRefKey]) {
          nodeRefs.current[nodeRefKey].className = 'node node-shortest-path';
        }

        // If this is the last node in the shortest path, update the end time
        if (i === nodesInShortestPathOrder.length - 1) {
          setEndTime(new Date());
        }
      }, 20 * i);
      timeouts.current.push(timeout);
    }
  }

  function clearGrid() {
    const newGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isVisited: false,
        distance: Infinity,
        previousNode: null,
        className: node.isWall ? 'node node-wall' : 'node'
      }))
    );

    for (const row of newGrid) {
      for (const node of row) {
        const nodeRefKey = `node-${node.row}-${node.col}`;
        if (!node.isStart && !node.isFinish && nodeRefs.current[nodeRefKey]) {
          nodeRefs.current[nodeRefKey].className = node.className;
        }
      }
    }

    setGrid(newGrid);
  }

  function clearTimeouts() {
    timeouts.current.forEach(timeout => clearTimeout(timeout));
    timeouts.current = [];
  }

  function resetGrid() {
    clearTimeouts();
    setAlgorithmInfo({ nodesVisited: 0, pathLength: 0 });
    setDuration('0 seconds');
    const newGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isVisited: false,
        distance: Infinity,
        previousNode: null,
        isWall: false,
        className: 'node'
      }))
    );

    for (const row of newGrid) {
      for (const node of row) {
        const nodeRefKey = `node-${node.row}-${node.col}`;
        if (!node.isStart && !node.isFinish && nodeRefs.current[nodeRefKey]) {
          nodeRefs.current[nodeRefKey].className = node.className;
        }
      }
    }

    setGrid(newGrid);
  }

  function visualizeAlgorithm(selectedAlgorithm: string) {
    clearTimeouts();
    clearGrid();
    let visitedNodesInOrder: NodeObject[];
    let nodesInShortestPathOrder: NodeObject[];

    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

    setAlgorithm(selectedAlgorithm);
    setStartTime(new Date());
    setEndTime(null); // Reset endTime to ensure duration calculation runs
    setDuration('Calculating...');

    switch (selectedAlgorithm) {
      case 'dijkstra':
        visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        nodesInShortestPathOrder = getNodesInShortestPathOrderFromDijkstra(finishNode);
        break;
      case 'greedy-bfs':
        visitedNodesInOrder = greedyBFS(grid, startNode, finishNode);
        nodesInShortestPathOrder = getNodesInShortestPathOrderFromGreedyBFS(finishNode);
        break;
      case 'a-star':
        visitedNodesInOrder = astar(grid, startNode, finishNode);
        nodesInShortestPathOrder = getNodesInShortestPathOrderFromAStar(finishNode);
        break;
      // case 'bidirectional-swarm':
      //   visitedNodesInOrder = bidirectionalSwarm(grid, startNode, finishNode);
      //   nodesInShortestPathOrder = getNodesInShortestPathOrderFromBidirectionalSwarm(finishNode);
      //   break;
      case 'bidirectional-bfs':
        const result = bidirectionalSearch(grid, startNode, finishNode);
        visitedNodesInOrder = result.visitedNodesInOrder;
        nodesInShortestPathOrder = result.nodesInShortestPathOrder;
        break;
      case 'bfs':
        visitedNodesInOrder = bfs(grid, startNode, finishNode);
        nodesInShortestPathOrder = getNodesInShortestPathOrderFromBFS(finishNode);
        break;
      case 'dfs':
        visitedNodesInOrder = dfs(grid, startNode, finishNode);
        nodesInShortestPathOrder = getNodesInShortestPathOrderFromDFS(finishNode);
        break;
      default:
        console.error('Unknown algorithm:', selectedAlgorithm);
        return;
    }
    const nodesVisited = visitedNodesInOrder.length;
    const pathLength = nodesInShortestPathOrder.length;
    setAlgorithmInfo({ nodesVisited, pathLength });
    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  return (
    <>
      <div className="panel">
        <div className="buttons-wrapper">
          <button
            type="button"
            onClick={() => visualizeAlgorithm("dijkstra")}
            className={algorithm === "dijkstra" ? "--active" : ""}
          >
            Visualize Dijkstra
          </button>
          <button
            type="button"
            onClick={() => visualizeAlgorithm("a-star")}
            className={algorithm === "a-star" ? "--active" : ""}
          >
            Visualize A*
          </button>
          <button
            type="button"
            onClick={() => visualizeAlgorithm("greedy-bfs")}
            className={algorithm === "greedy-bfs" ? "--active" : ""}
          >
            Visualize Greedy BFS
          </button>
          {/* <button
            type="button"
            onClick={() => visualizeAlgorithm("bidirectional-swarm")}
            className={algorithm === "bidirectional-swarm" ? "--active" : ""}
          >
            Visualize Bidirectional Swarm
          </button> */}
          <button
            type="button"
            onClick={() => visualizeAlgorithm("bidirectional-bfs")}
            className={algorithm === "bidirectional-bfs" ? "--active" : ""}
          >
            Visualize Bidirectional Swarm
          </button>
          <button
            type="button"
            onClick={() => visualizeAlgorithm("bfs")}
            className={algorithm === "bfs" ? "--active" : ""}
          >
            Visualize BFS
          </button>
          <button
            type="button"
            onClick={() => visualizeAlgorithm("dfs")}
            className={algorithm === "dfs" ? "--active" : ""}
          >
            Visualize DFS
          </button>
          <button 
            type="button" 
            onClick={() => {
              resetGrid();
              setAlgorithm(null);
            }}
          >
            Reset
          </button>
        </div>
        <hr/>
        <div className="result-wrapper">
          <p>Nodes Visited: {algorithmInfo.nodesVisited}</p>
          <p>Shortest Path Length: {algorithmInfo.pathLength > 0 ? algorithmInfo.pathLength - 2 : 0}</p>
          <p>Time Taken: {duration}</p>
        </div>
      </div>
      <table className="grid">
        <tbody>
          {grid.map((row) => (
            <tr key={`row-${row[0].row}`}>
              {row.map((node) => {
                const { row, col, isFinish, isStart, isVisited, isWall } = node;
                const nodeRefKey = `node-${row}-${col}`;
                return (
                  <Node
                    key={`node-${row}-${col}`}
                    row={row}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isVisited={isVisited}
                    ref={(el) => (nodeRefs.current[nodeRefKey] = el)}
                    isWall={isWall}
                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                    onMouseUp={() => handleMouseUp()}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function getInitialGrid() {
  const ROWS = 21;
  const COLS = 40;

  const grid: Array<Array<NodeObject>> = [];
  for (let row = 0; row < ROWS; row++) {
    const currentRow: NodeObject[] = [];
    for (let col = 0; col < COLS; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
}

const START_NODE_ROW = 10;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 34;

function createNode(col: number, row: number) {
  return {
    row,
    col,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Number.POSITIVE_INFINITY,
    isVisited: false,
    previousNode: null,
    isWall: false,
  };
}

function getNewGridWithWallToggled(grid, row, col) {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}
