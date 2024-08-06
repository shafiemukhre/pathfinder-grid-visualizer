import { useState, useEffect } from 'react';

interface ResultEntry {
  id: number;
  nodesVisited: number;
  shortestPathLength: number;
  timeTaken: number;
}

export default function ResultTable() {
  const [results, setResults] = useState<ResultEntry[]>([]);

  useEffect(() => {
    const handleAlgorithmComplete = (event: CustomEvent<ResultEntry>) => {
      setResults(prevResults => [...prevResults, event.detail]);
    };

    window.addEventListener('algorithmComplete' as any, handleAlgorithmComplete);

    return () => {
      window.removeEventListener('algorithmComplete' as any, handleAlgorithmComplete);
    };
  }, []);

  return (
    <table className='result-table'>
      <thead>
        <tr>
          <th>#</th>
          <th>Nodes Visited</th>
          <th>Shortest Path Length</th>
          <th>Time Taken (seconds)</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result, index) => (
          <tr key={result.id}>
            <td>{index + 1}</td>
            <td>{result.nodesVisited}</td>
            <td>{result.shortestPathLength}</td>
            <td>{result.timeTaken.toFixed(3)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
