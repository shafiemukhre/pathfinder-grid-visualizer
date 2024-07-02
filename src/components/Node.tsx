import { forwardRef } from 'react';

interface NodeProps {
  row: number,
  col: number,
  isFinish: boolean,
  isStart: boolean,
  isVisited: boolean,
}

// TO LEARN: try to understand forwardRef more
const Node = forwardRef<HTMLTableCellElement, NodeProps>(function Node(props, ref) {
  const { row, col, isFinish, isStart, isVisited } = props;
  const extraClassName = isFinish
    ? 'node-finish'
    : isStart
    ? 'node-start'
    : isVisited
    ? 'node-visited'
    : '';

  return (
    <td
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      ref={ref}/>
  );
});

export default Node;
