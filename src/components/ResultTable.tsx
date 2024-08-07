export default function ResultTable({data}) {
  console.log(data)

  return (
    <table className='result-table'>
      <thead>
        <tr>
          <th>#</th>
          <th>Algorithm Name</th>
          <th className="--centered">Nodes Visited</th>
          <th className="--centered">Shortest Path Length</th>
          <th className="--centered">Time Taken (seconds)</th>
        </tr>
      </thead>
      <tbody>
        {data.map((result, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{result.algorithmName}</td>
            <td className="--centered">{result.nodesVisited}</td>
            <td className="--centered">{result.pathLength}</td>
            <td className="--centered">{result.duration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
