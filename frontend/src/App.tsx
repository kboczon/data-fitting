import React from 'react';
import SpreadSheet from "./components/SpreadSheet";
import FitSelector from "./components/FitSelector";
import Plot from "./components/Plot";
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Curve Fit</h1>
      <SpreadSheet/>
      <FitSelector/>
      <Plot options={{
        data: [{
          fn: 'x^2',
        }, {
          points: [
            [2, 2],
            [4, 4],
            [-2, 2],
            [-1, 2],
            [3, 3]
          ],
          fnType: 'points',
          graphType: 'scatter',
        }]
      }}/>
    </div>
  );
}

export default App;
