import React, {useState} from "react";

const SpreadSheet = () => {
  const [axisData, setAxisData] = useState<[(string | number)[], (string | number)[]]>([[1], [1]]);
  const onDataPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text/plain').split("\r\n").slice(0, -1);
    setAxisData(prev => {
      return [[...text], [...prev[1]]];
    });
  }

  return (
    <>
      <div>
        <p>i</p>
        {axisData[0].map((_, i) => <p key={i}>{i + 1}</p>)}
        <p>x</p>
        {axisData[0].map((xData, i) => <input key={i} onPaste={onDataPaste} defaultValue={xData}/>)}
        <p>y</p>
        {axisData[1].map((yData, i) => <input key={i} onPaste={onDataPaste} defaultValue={yData}/>)}
      </div>
    </>
  )
}

export default SpreadSheet;

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