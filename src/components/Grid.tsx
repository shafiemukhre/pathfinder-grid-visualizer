import { useEffect, useState, useRef } from "react";
import Node from "./Node";
import { dijkstra, getNodesInShortestPathOrder } from "@algorithms/dijkstra";

interface NodeObject {
  col: number,
  row: number,
  isStart: boolean,
  isFinish: boolean,
  isVisited: boolean,
}

export default function Grid() {
  const [grid, setGrid] = useState<NodeObject[][]>([])
  const nodeRefs = useRef<{ [key: string]: HTMLTableCellElement | null }>({});

  useEffect(() => {
    setGrid(getInitialGrid())
  },[])

  function animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {

      // finale shortest path line
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 20 * i)
      }

      // in-progress animation
      // TODO: use react ref or million js
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        node.isVisited = true; // Update the state of the node
        // setGrid(prevGrid => {
        //   const newGrid = [...prevGrid];
        //   newGrid[node.row][node.col] = { ...node };
        //   return newGrid;
        // });
        const nodeRefKey = `node-${node.row}-${node.col}`;
        if (nodeRefs.current[nodeRefKey]) {
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
        if (nodeRefs.current[nodeRefKey]) {
          nodeRefs.current[nodeRefKey].className = 'node node-shortest-path'
        }
      }, 50 * i);
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
              const {row, col, isFinish, isStart, isVisited} = node;
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
  }
}