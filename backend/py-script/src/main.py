# weighting is sigma in curve_fit function
import sys
import json
import re
import numpy as np
from scipy.optimize import curve_fit
from scipy.stats import pearsonr, norm
# from numpy import exp


def fit_curve(argv1, argv2, fit_model):
    x_data = np.asarray(argv1.split(","), dtype=np.float64)
    y_data = np.asarray(argv2.split(","), dtype=np.float64)

    def log_likelihood(n, residuals):
        ll = -(n * 1 / 2) * (np.log(residuals / n))

        return ll

    def aic_bic(ll, n, k):
        AIC = (2 * k) - (2 * ll)
        BIC = k * np.log(n) - (2 * ll)

        return AIC, BIC

    popt, pcov = curve_fit(fit_model, x_data, y_data)

    # get standard error for values
    stdrVal = np.sqrt(np.diag(pcov))

    # get r (correlation of coefficient)
    r = pearsonr(x_data, y_data)

    # get r squared
    residuals = y_data - fit_model(x_data, *popt)
    ss_res = np.sum(residuals ** 2)  # ss means sum of squares?
    ss_tot = np.sum((y_data - np.mean(y_data)) ** 2)
    r_squared = 1 - (ss_res / ss_tot)

    # adjusted r squared
    adj_r = 1 - ((1 - r_squared) * (len(y_data) - 1)) / (len(y_data) - len(popt) - 1)

    # get fit standard error (Root mean square of residuals)
    sErr = np.sqrt(np.mean(residuals ** 2))

    # points estimates (95%)
    ci = 0.95
    pp = (1. + ci) / 2
    nstd = norm.ppf(pp)
    popt_up = popt + nstd * stdrVal
    popt_dw = popt - nstd * stdrVal

    # Burnham and Anderson
    # AIC < 2 -> substantial evidence for the model.
    # 3 > AIC 7 -> less support for the model.
    # AIC > 10 -> the model is unlikely.
    ll = log_likelihood(len(y_data), ss_res)
    aic, bic = aic_bic(ll, len(y_data), len(popt))

    result_dict = {
        "coefficients": tuple(popt),
        "standardValuesError": stdrVal.tolist(),
        "r": r[0],
        "r2": r_squared,
        "r2Adjusted": adj_r,
        "standardError": sErr,
        "dof": len(y_data) - 2,
        "rangeConfidenceUp": popt_up.tolist(),
        "rangeConfidenceDw": popt_dw.tolist(),
        "covariancePlot": pcov.tolist(),
        "aicc": aic,
        "bic": bic,
    }

    result_json = json.dumps(result_dict)

    return result_json, tuple(popt)


def parse_equation(equation):
    return list(filter(None, re.split("[^a-wz]", equation)))


def create_function(equation, args_arr):
    func_args = ",".join(list(dict.fromkeys(args_arr)))
    new_func = f'def created_func(x,{func_args}):\n  return {equation}'
    the_code = compile(new_func, 'test', 'exec')
    exec(the_code, globals())
    return created_func


if __name__ == "__main__":
    parsed_vars = parse_equation(sys.argv[3])
    fit_model = create_function(sys.argv[3], parsed_vars)
    fit_result_json, coeffs_list = fit_curve(sys.argv[1], sys.argv[2], fit_model)

    func_vars_dict = dict(zip(parsed_vars, coeffs_list))
    func_vars_json = json.dumps(func_vars_dict)

    sys.stdout.write(fit_result_json)
    sys.stdout.write("Vars:")
    sys.stdout.write(func_vars_json)
    sys.stdout.flush()
    sys.exit(0)
