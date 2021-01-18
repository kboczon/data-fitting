import sys
import json
import numpy as np
from scipy.optimize import curve_fit


def linear_fit(x, a, b):
    return a * x + b


def quadric_fit(x, a, b, c):
    return a * x ** 2 + b * x + c


def quartic_fit(x, a, b, c, d, e):
    return a * x ** 4 + b * x ** 3 + c * x ** 2 + d * x + e


def non_linear_4lp_fit(x, a, b, c, d):
    return d + ((a - d) / (1 + (x / c) ** b))


def non_linear_half_life_fit(x, a, b, c):
    return a + b / 2 ** (x / c)


fits_models = {
    "linear_fit": linear_fit,
    "quartic_fit": quartic_fit,
    "quadric_fit": quadric_fit,
    "non_linear_4lp_fit": non_linear_4lp_fit,
    "non_linear_half_life_fit": non_linear_half_life_fit
}

response_object = {
    "highest_r_squared": 0,
    "model_name": "",
}

if __name__ == "__main__":
    x_data = np.asarray(sys.argv[1].split(","), dtype=np.float64)
    y_data = np.asarray(sys.argv[2].split(","), dtype=np.float64)

    for func_model in fits_models:
        popt, pcov = curve_fit(fits_models[func_model], x_data, y_data)
        residuals = y_data - fits_models[func_model](x_data, *popt)

        ss_res = np.sum(residuals ** 2)
        ss_tot = np.sum((y_data - np.mean(y_data)) ** 2)
        r_squared = 1 - (ss_res / ss_tot)
        adj_r = 1 - ((1 - r_squared) * (len(y_data) - 1)) / (len(y_data) - len(popt) - 1)

        if response_object["highest_r_squared"] < adj_r <= 1.0:
            response_object["highest_r_squared"] = adj_r
            response_object["model_name"] = func_model

    sys.stdout.write(json.dumps(response_object))
    sys.stdout.flush()
    sys.exit(0)
