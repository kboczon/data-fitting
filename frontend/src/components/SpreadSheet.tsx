import React, {useState} from "react";
import Plot from "./Plot";
import {FunctionPlotDatum} from "function-plot/dist/types";
import FitSelector from "./FitSelector";
import {api, CalculationResponse} from "../utils/api";

const SpreadSheet = () => {
  const [axisData, setAxisData] = useState([[1, 1], [2, 1.2], [3, 3], [4,7], [5,7]]);
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
    const resp = await api.sendArguments(axisData.map(dataSet => dataSet[0]), axisData.map(dataSet => dataSet[1]));
    setResponse(resp);
    const equation = `${resp?.coefficients[0]}*x+${resp?.coefficients[1]}`;
    setPlotOpts([{
      points: axisData,
      fnType: 'points',
      graphType: 'scatter',
    },{
      fn: equation,
      graphType: 'polyline'
    }]);
  }

  return (
    <>
      <div>
        <p>x</p>
        {axisData.map((dataSet, i) => <input name="xAxis" key={i} onPaste={onDataPaste} value={dataSet[0]} readOnly={true}/>)}
        <p>y</p>
        {axisData.map((dataSet, i) => <input name="yAxis" key={i} onPaste={onDataPaste} value={dataSet[1]} readOnly={true}/>)}
      </div>
      <Plot options={{
        data: plotOpts
      }}/>
      <FitSelector/>
      <button onClick={sendRequest}>Proceed</button>
    </>
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
