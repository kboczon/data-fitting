type ResultResponse = {
  response: string;
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

class Api {
  private _url = "http://localhost:8000"

  public async sendArguments(xRow: number[], yRow: number[]) {
    try {
      const response = await fetch(`${this._url}/`, {
        method: "POST",
        body: JSON.stringify({
          xRow: xRow,
          yRow: yRow,
          equation: "1"
        }),
      });
      const result = await response.json() as ResultResponse;
      result.response = result.response.replaceAll(/[-]?Infinity/g, "\"Infinity\"");
      return JSON.parse(result.response) as CalculationResponse;
    } catch (error) {
      console.log("error: ", error);
      return;
    }
  }
}

export const api = new Api();