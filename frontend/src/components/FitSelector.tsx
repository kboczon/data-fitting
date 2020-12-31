import React, {useState} from "react";
import Tooltip from "./Tooltip";

type Props = {
  setModel: React.Dispatch<React.SetStateAction<string>>;
  handleRequest: () => Promise<void>;
}

const FitSelector: React.FC<Props> = ({setModel, handleRequest}) => {
  const [customModel, setCustomModel] = useState("");
  const changeCustomModel = () => {
    setModel(customModel);
  }

  return (
    <div>
      <div>
        <h3>Select Fit</h3>
        <Tooltip content="a*x+b">
          <button className="fit__model__btn" onClick={(e: any) => setModel(e.target.value)} value={"a*x+b"}>1. Linear</button>
        </Tooltip>
        <Tooltip content="a*x**2+b*x+c">
          <button className="fit__model__btn" onClick={(e: any) => setModel(e.target.value)} value={"a*x**2+b*x+c"}>2.
            Polynomial(Quadratic Regression)
          </button>
        </Tooltip>
        <Tooltip content="a*x**4+b*x**3+c*x**2+d*x+e">
          <button className="fit__model__btn" onClick={(e: any) => setModel(e.target.value)} value={"a*x**4+b*x**3+c*x**2+d*x+e"}>3.
            Polynomial(Quartic Regression)
          </button>
        </Tooltip>
        <Tooltip content="d+((a-d)/(1+(x/c)**b))">
          <button className="fit__model__btn" onClick={(e: any) => setModel(e.target.value)} value={"d+((a-d)/(1+(x/c)**b))"}>4. Nonlinear(4PL)
          </button>
        </Tooltip>
        <Tooltip content="a+b/2**(x/c)">
          <button className="fit__model__btn" onClick={(e: any) => setModel(e.target.value)} value={"a+b/2**(x/c)"}>5.
            Nonlinear(Half-Life)
          </button>
        </Tooltip>
      </div>
      <div>
        <div className="flex__text">
          <h3 className="remove__margins">Or set custom model</h3>
          <Tooltip direction={"top"}
                   content={"1. For power use pow()/** not ^\n2. Available math functions: \n - exp, \n - log, \n - sin, \n - sinh, \n - cos, \n - cosh, \n - tan, \n - tanh, \n - abs, \n - avg, \n - degrees, \n - log10, \n - mod, \n - pi, \n - pow, \n product, \n - radians, \n - sqrt\n3. Press set model"}>
            <p className="question__mark__style">?</p>
          </Tooltip>
        </div>
        <input className="input__model"
               placeholder={"Write custom model here (ex. a*x**2+b*x+c)"}
               value={customModel}
               onChange={(e) => setCustomModel(e.target.value)}
        />
        <button onClick={changeCustomModel}>Set Model</button>
        <br/>
        <button className="proceed__btn" onClick={handleRequest}>Calculate</button>
        <br/>
      </div>
    </div>
  )
}

export default FitSelector;
