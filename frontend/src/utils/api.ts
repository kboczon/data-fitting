type ResultResponse = {
  fitResult: string;
  fitVariables: string;
}

export type CalculationResponse = {
  aicc: number;
  bic: number;
  coefficients: number[];
  covariancePlot: number[];
  dof: number;
  r: number;
  r2: number;
  r2Adjusted: number;
  rangeConfidenceDw: number[];
  rangeConfidenceUp: number[];
  standardError: number;
  standardValuesError: number[];
}

export type FitVariables = { [key: string]: number; }

class Api {
  private _url = "http://localhost:8000"

  public async sendArguments(xRow: number[], yRow: number[], plotFn: string): Promise<[CalculationResponse, FitVariables] | undefined> {
    try {
      const response = await fetch(`${this._url}/`, {
        method: "POST",
        body: JSON.stringify({
          xRow: xRow,
          yRow: yRow,
          equation: plotFn
        }),
      });
      if(response.status === (403 | 500)) return;
      const result = await response.json() as ResultResponse;
      result.fitResult = result.fitResult.replaceAll(/[-]?Infinity|Nan/gi, "\"Infinity or NAN\"");
      return [JSON.parse(result.fitResult) as CalculationResponse, JSON.parse(result.fitVariables) as FitVariables];
    } catch (error) {
      console.log("error: ", error);
      return;
    }
  }
}

export const api = new Api();