import React, {useEffect, useRef} from 'react'
import functionPlot from 'function-plot'
import {FunctionPlotAnnotation, FunctionPlotDatum, FunctionPlotOptionsAxis, FunctionPlotTip} from "function-plot/dist/types";

export interface FunctionPlotProps {
  options?: { // // options?: FunctionPlotOptions
    id?: string;
    target?: string;
    title?: string;
    width?: number;
    height?: number;
    xAxis?: FunctionPlotOptionsAxis;
    yAxis?: FunctionPlotOptionsAxis;
    xDomain?: number[];
    yDomain?: number[];
    tip?: FunctionPlotTip;
    grid?: boolean;
    disableZoom?: boolean;
    data?: FunctionPlotDatum[];
    annotations?: FunctionPlotAnnotation[];
    plugins?: any[];
  }
}

const Plot: React.FC<FunctionPlotProps> = React.memo(({options}) => {
    const rootEl = useRef(null);

    useEffect(() => {
      try {
        functionPlot(Object.assign({}, options, {target: rootEl.current}));
        // console.log(options);
      } catch (e) {
      }
    });

    return (<div ref={rootEl}/>);
  }, () => false
)

export default Plot;