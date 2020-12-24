import React, {useState} from "react";
import Plot from "./Plot";
import {FunctionPlotDatum} from "function-plot/dist/types";
import FitSelector from "./FitSelector";
import {api, CalculationResponse} from "../utils/api";
import {dataSet1, dataSet2} from "../utils/datasets";

const SpreadSheet = () => {
  const [axisData, setAxisData] = useState([[1, 1], [2, 1.2], [3, 3], [4, 7], [5, 7]]);
  const [plotFn, setPlotFn] = useState("a*x+b");
  const [plotOpts, setPlotOpts] = useState<FunctionPlotDatum[]>([]);
  const [response, setResponse] = useState<CalculationResponse | undefined>(undefined);

  const onDataPaste = (e: any) => {
    const pastedText = e.clipboardData.getData('text/plain').split("\r\n").slice(0, -1);
    const pastedDataCount = pastedText.length - 1;
    const axisDataCopy = JSON.parse(JSON.stringify(axisData));
    const axisCoordinate = e.target.name === "xAxis" ? 0 : 1;

    for (let i = 0; i <= pastedDataCount; i++) {
      if (!axisDataCopy[i]) axisDataCopy[i] = [0, 0];
      axisDataCopy[i][axisCoordinate] = parseFloat(pastedText[i]);
    }

    setAxisData(axisDataCopy);
  }

  const sendRequest = async () => {
    const resp = await api.sendArguments(axisData.map(dataSet => dataSet[0]), axisData.map(dataSet => dataSet[1]), plotFn);
    if (!resp) return
    setResponse(resp[0]);
    const newFnPlot = plotFn.split("");
    newFnPlot.forEach((letter, index) => {
      if (resp[1][letter] !== undefined)
        newFnPlot[index] = resp[1][letter].toString();
    })
    setPlotOpts([{
      points: axisData,
      fnType: 'points',
      graphType: 'scatter',
    }, {
      fn: newFnPlot.join("").replaceAll("**", "^"),
      graphType: 'polyline'
    }]);
  }

  return (
    <div className="main__flex">
      <div className="spreadsheet__flex">
        <div>
          <button onClick={() => setAxisData(dataSet1)}>Dataset 1</button>
          <p className="spreadsheet__cell">x</p>
          {axisData.map((dataSet, i) => <input
            key={i}
            className="spreadsheet__cell"
            name="xAxis"
            onPaste={onDataPaste}
            value={dataSet[0]}
            readOnly={true}/>
          )}
        </div>
        <div>
          <button onClick={() => setAxisData(dataSet2)}>Dataset 2</button>
          <p className="spreadsheet__cell">y</p>
          {axisData.map((dataSet, i) => <input
            key={i}
            className="spreadsheet__cell"
            name="yAxis"
            onPaste={onDataPaste}
            value={dataSet[1]}
            readOnly={true}/>
          )}
        </div>
      </div>
      <div className="center__text flex__column">
        <Plot options={{
          width: 800,
          height: 400,
          data: plotOpts
        }}/>
        <div className="results__flex">
          <FitSelector setModel={setPlotFn} handleRequest={sendRequest}/>
          {response && <div>
              <h3>Results</h3>
              <p>Coefficients: {response?.coefficients.join(", ")}</p>
              <p>Standard Error of every value: {response?.standardValuesError.join(", ")}</p>
              <p>Standard Error: {response?.standardError}</p>
              <p>R: {response?.r}</p>
              <p>R^2: {response?.r2}</p>
              <p>R^2 Adj: {response?.r2Adjusted}</p>
              <p>DOF: {response?.dof}</p>
              <p>AICC: {response?.aicc}</p>
              <p>BIC: {response?.bic}</p>
          </div>
          }
        </div>
      </div>
    </div>
  )
}

export default SpreadSheet;

// {
//   fn: 'x',
//   graphType: 'polyline'
// }, {
//   points: axisData,
//   fnType: 'points',
//   graphType: 'scatter',
// }


/*<tr>*/
/*  <th>i</th>*/
/*  <th>x</th>*/
/*  <th>y</th>*/
/*</tr>*/
/*<tr>*/
/*  <td>i</td>*/
/*  <td>AA</td>*/
/*  <td>BB</td>*/
/*</tr>*/

// setPlotOpts([{
//   points: axisData,
//   fnType: 'points',
//   graphType: 'scatter',
// }])

//1 podanie wzoru do frontu (rysowanie wykresu w js)
//2 podanie wzoru do skryptu(liczenie w python)

// function data -> [{letter: a, value: 1.23234}]
//replace letter with value 