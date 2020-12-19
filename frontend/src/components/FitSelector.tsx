import React from "react";

const FitSelector = () => {
  return (
    <div>
      <h2>Select Fit, write custom model or select find best curve option</h2>
      <div>
        <h3>1 Select Fit</h3>
        <br/>
        <button value={1}>Linear</button>
        <button value={2}>Polynomial(Quadratic Regression)</button>
        <button value={3}>Polynomial(Quartic Regression)</button>
        <button value={4}>Nonlinear(4PL)</button>
        <button value={5}>Nonlinear(Half-Life)</button>
      </div>
      <div>
        <h3>Write Custom Model</h3>
        <input placeholder={"Write custom model here (ex. a*x**2+b*x+c)"}/>
        <br/>
      </div>
      <div>
        <h3>Find Best Curve</h3>
        <button value={6}>Find Best Curve</button>
        <br/>
      </div>
    </div>
  )
}

export default FitSelector;