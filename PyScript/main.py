# weighting is sigma in curve_fit function
import sys
import json

sys.path.append("C:\\Users\\adria\\PycharmProjects\\pythonProject\\venv\\Lib\\site-packages")

import numpy as np
from scipy.optimize import curve_fit
from scipy.stats import pearsonr, norm


def linear_regression(x, a, b):
    return a * x + b


def fit_curve(argv1, argv2):
    x_data = np.asarray(argv1.split(","), dtype=np.float64)
    y_data = np.asarray(argv2.split(","), dtype=np.float64)

    def log_likelihood(n, residuals):
        ll = -(n * 1 / 2) * (np.log(residuals / n))

        return ll

    def aic_bic(ll, n, k):
        AIC = (2 * k) - (2 * ll)
        BIC = k * np.log(n) - (2 * ll)

        return AIC, BIC

    popt, pcov = curve_fit(linear_regression, x_data, y_data)

    # get standard error for values
    stdrVal = np.sqrt(np.diag(pcov))

    # get r (correlation of coefficient)
    r = pearsonr(x_data, y_data)

    # get r squared
    residuals = y_data - linear_regression(x_data, *popt)
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
    # ΔAIC < 2 -> substantial evidence for the model.
    # 3 > ΔAIC 7 -> less support for the model.
    # ΔAIC > 10 -> the model is unlikely.
    ll = log_likelihood(len(y_data), ss_res)
    aic, bic = aic_bic(ll, len(y_data), len(popt))

    result_dict = {
        "coefficients": tuple(popt),
        "standard_values_error": stdrVal.tolist(),
        "r": r[0],
        "r^2": r_squared,
        "r^2 adjusted": adj_r,
        "standard_error": sErr,
        "dof": len(y_data) - 2,
        "range_confidence_up": popt_up.tolist(),
        "range_confidence_dw": popt_dw.tolist(),
        "covariance_plot": pcov.tolist(),
        "aicc": aic,
        "bic": bic,
    }

    result_json = json.dumps(result_dict)

    return result_json


if __name__ == "__main__":
    fit_result = fit_curve(sys.argv[1], sys.argv[2])
    sys.stdout.write(fit_result)
    sys.stdout.flush()
    sys.exit(0)
