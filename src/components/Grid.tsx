import { useEffect, useState, useRef } from "react";
import Node from "./Node";
import { dijkstra, getNodesInShortestPathOrder } from "@algorithms/dijkstra";

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

  useEffect(() => {
    setGrid(getInitialGrid())
  },[]) // only once


  function handleMouseDown(row: number, col: number) {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setMouseIsPressed(true)
    setGrid(newGrid)
  }

  function handleMouseEnter(row: number, col: number) {
    if (!mouseIsPressed) return;
    console.log('onmouseenter active')
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid)
  }

  function handleMouseUp() {
    setMouseIsPressed(false);
  }

  function animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {

      // finale shortest path line
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 20 * i)
      }

      // in-progress animation
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        node.isVisited = true; // Update the state of the node
        const nodeRefKey = `node-${node.row}-${node.col}`;
        if (!node.isStart && !node.isFinish && nodeRefs.current[nodeRefKey]) {
          nodeRefs.current[nodeRefKey].className = 'node node-visited';
        }
      }, 20 * i);
    }
  }

  function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const nodeRefKey = `node-${node.row}-${node.col}`;
        if (!node.isStart && !node.isFinish && nodeRefs.current[nodeRefKey]) {
          nodeRefs.current[nodeRefKey].className = 'node node-shortest-path'
        }
      }, 20 * i);
    }
  }


  function visualizeAlgorithm() {
    console.log('visualizaAlgorithm function is called')
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    
    // only for dijkstra for now
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    console.log("visitedNodesInOrder", visitedNodesInOrder);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  return (
    <>
    <button type="button" onClick={() => visualizeAlgorithm()}>Visualize Dijkstra</button>
    <table className="grid">
      <tbody>
        {grid.map((row) => (
          <tr key={`row-${row[0].row}`}>
            {row.map((node) => {
              const {row, col, isFinish, isStart, isVisited, isWall} = node;
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
  )
}

function getInitialGrid() {
  const ROWS = 20;
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
const FINISH_NODE_COL = 35;

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
  }
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
};
