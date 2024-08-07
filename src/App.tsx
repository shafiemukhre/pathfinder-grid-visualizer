import ResultTable from "@components/ResultTable";
import "./App.scss";
import Grid from "@components/Grid";
import { useEffect, useState } from "react";

interface ResultData {
  algorithmName: string,
  nodesVisited: number,
  pathLength: number,
  duration: string
}

function App() {
  const [resultData, setResultData] = useState<ResultData>();
  const [allData, setAllData] = useState<ResultData[]>([]);

  useEffect(() => {
    if (resultData) {
      const newAllData = [...allData, resultData];
      setAllData(newAllData)
    }

  }, [resultData])


  
  return (
    <>
      <h1 className="title">Pathfinding Algorithms Visualizer on a Grid</h1>
      <Grid sendToParent={setResultData} />
      <ResultTable data={allData}/>
    </>
  );
}

export default App;
