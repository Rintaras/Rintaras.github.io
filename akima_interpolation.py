import numpy as np
from typing import Tuple


def calculate_slopes(x: np.ndarray, y: np.ndarray) -> np.ndarray:
    with np.errstate(divide='ignore', invalid='ignore'):
        slopes = (y[1:] - y[:-1]) / (x[1:] - x[:-1])
        slopes = np.where(np.isfinite(slopes), slopes, 0.0)
    return slopes


def calculate_spline_slopes(x: np.ndarray, y: np.ndarray) -> np.ndarray:
    n = len(x)
    if n < 2:
        raise ValueError("少なくとも2個のデータ点が必要です")
    
    m = calculate_slopes(x, y)
    s = np.zeros(n)
    
    if n == 2:
        s[0] = m[0]
        s[1] = m[0]
        return s
    
    s[0] = m[0]
    if n > 2:
        s[1] = (m[0] + m[1]) / 2.0
    
    for i in range(2, n - 2):
        w1 = abs(m[i+1] - m[i])
        w2 = abs(m[i-1] - m[i-2])
        denominator = w1 + w2
        
        if denominator == 0:
            s[i] = (m[i-1] + m[i]) / 2.0
        else:
            s[i] = (w1 * m[i-1] + w2 * m[i]) / denominator
    
    if n > 2:
        s[n-2] = (m[n-3] + m[n-2]) / 2.0
    s[n-1] = m[n-2]
    
    return s


def calculate_cubic_coefficients(x: np.ndarray, y: np.ndarray, s: np.ndarray, i: int) -> Tuple[float, float, float, float]:
    x_i = x[i]
    x_i1 = x[i+1]
    y_i = y[i]
    y_i1 = y[i+1]
    s_i = s[i]
    s_i1 = s[i+1]
    
    h = x_i1 - x_i
    if h == 0:
        raise ValueError("x座標が重複しています")
    
    m_i = (y_i1 - y_i) / h
    a_i = y_i
    b_i = s_i
    c_i = (3.0 * m_i - 2.0 * s_i - s_i1) / h
    d_i = (s_i + s_i1 - 2.0 * m_i) / (h * h)
    
    return a_i, b_i, c_i, d_i


def akima_interpolate_4points(x_data: np.ndarray, y_data: np.ndarray, x_interp: float) -> float:
    if len(x_data) != 4 or len(y_data) != 4:
        raise ValueError("この関数は4個のデータ点を必要とします")
    
    sorted_indices = np.argsort(x_data)
    x_sorted = x_data[sorted_indices]
    y_sorted = y_data[sorted_indices]
    
    if x_interp <= x_sorted[0]:
        if len(x_sorted) > 1:
            dx = x_sorted[1] - x_sorted[0]
            if dx == 0:
                return y_sorted[0]
            return y_sorted[0] + (y_sorted[1] - y_sorted[0]) / dx * (x_interp - x_sorted[0])
        else:
            return y_sorted[0]
    elif x_interp >= x_sorted[-1]:
        if len(x_sorted) > 1:
            dx = x_sorted[-1] - x_sorted[-2]
            if dx == 0:
                return y_sorted[-1]
            return y_sorted[-1] + (y_sorted[-1] - y_sorted[-2]) / dx * (x_interp - x_sorted[-1])
        else:
            return y_sorted[-1]
    
    s = calculate_spline_slopes(x_sorted, y_sorted)
    idx = np.searchsorted(x_sorted, x_interp) - 1
    idx = max(0, min(idx, len(x_sorted) - 2))
    
    a, b, c, d = calculate_cubic_coefficients(x_sorted, y_sorted, s, idx)
    dx = x_interp - x_sorted[idx]
    y_interp = a + b * dx + c * dx * dx + d * dx * dx * dx
    
    return y_interp


_akima_4points_cache = {}


def akima_interpolate_4points_with_cache(x_data: np.ndarray, y_data: np.ndarray, x_interp: float) -> float:
    data_key = (tuple(x_data), tuple(y_data))
    
    if data_key not in _akima_4points_cache:
        sorted_indices = np.argsort(x_data)
        x_sorted = x_data[sorted_indices]
        y_sorted = y_data[sorted_indices]
        s = calculate_spline_slopes(x_sorted, y_sorted)
        
        _akima_4points_cache[data_key] = {
            'x_sorted': x_sorted,
            'y_sorted': y_sorted,
            's': s
        }
    
    cache = _akima_4points_cache[data_key]
    x_sorted = cache['x_sorted']
    y_sorted = cache['y_sorted']
    s = cache['s']
    
    if x_interp <= x_sorted[0]:
        if len(x_sorted) > 1:
            dx = x_sorted[1] - x_sorted[0]
            if dx == 0:
                return y_sorted[0]
            return y_sorted[0] + (y_sorted[1] - y_sorted[0]) / dx * (x_interp - x_sorted[0])
        else:
            return y_sorted[0]
    elif x_interp >= x_sorted[-1]:
        if len(x_sorted) > 1:
            dx = x_sorted[-1] - x_sorted[-2]
            if dx == 0:
                return y_sorted[-1]
            return y_sorted[-1] + (y_sorted[-1] - y_sorted[-2]) / dx * (x_interp - x_sorted[-1])
        else:
            return y_sorted[-1]
    
    idx = np.searchsorted(x_sorted, x_interp) - 1
    idx = max(0, min(idx, len(x_sorted) - 2))
    
    a, b, c, d = calculate_cubic_coefficients(x_sorted, y_sorted, s, idx)
    dx = x_interp - x_sorted[idx]
    y_interp = a + b * dx + c * dx * dx + d * dx * dx * dx
    
    return y_interp


def akima_interpolate_npoints(x_data: np.ndarray, y_data: np.ndarray, x_interp: float) -> float:
    if len(x_data) != len(y_data):
        raise ValueError("x_dataとy_dataの長さが一致しません")
    
    if len(x_data) < 2:
        raise ValueError("少なくとも2個のデータ点が必要です")
    
    sorted_indices = np.argsort(x_data)
    x_sorted = x_data[sorted_indices]
    y_sorted = y_data[sorted_indices]
    
    if x_interp <= x_sorted[0]:
        if len(x_sorted) > 1:
            dx = x_sorted[1] - x_sorted[0]
            if dx == 0:
                return y_sorted[0]
            return y_sorted[0] + (y_sorted[1] - y_sorted[0]) / dx * (x_interp - x_sorted[0])
        else:
            return y_sorted[0]
    elif x_interp >= x_sorted[-1]:
        if len(x_sorted) > 1:
            dx = x_sorted[-1] - x_sorted[-2]
            if dx == 0:
                return y_sorted[-1]
            return y_sorted[-1] + (y_sorted[-1] - y_sorted[-2]) / dx * (x_interp - x_sorted[-1])
        else:
            return y_sorted[-1]
    
    s = calculate_spline_slopes(x_sorted, y_sorted)
    idx = np.searchsorted(x_sorted, x_interp) - 1
    idx = max(0, min(idx, len(x_sorted) - 2))
    
    a, b, c, d = calculate_cubic_coefficients(x_sorted, y_sorted, s, idx)
    dx = x_interp - x_sorted[idx]
    y_interp = a + b * dx + c * dx * dx + d * dx * dx * dx
    
    return y_interp


if __name__ == "__main__":
    from visualize import visualize_comparison, visualize_akima_only, compare_interpolation_methods
    
    print("=== サンプル1: 簡単な4点補間 ===")
    x_4 = np.array([0, 1, 2, 3])
    y_4 = np.array([0, 1, 4, 9])
    x_test = 1.5
    
    result_4 = akima_interpolate_4points(x_4, y_4, x_test)
    print(f"4点補間: x={x_test} のとき y={result_4:.4f}")
    
    result_4_cache = akima_interpolate_4points_with_cache(x_4, y_4, x_test)
    print(f"4点補間（キャッシュ使用）: x={x_test} のとき y={result_4_cache:.4f}")
    
    print("\n=== サンプル2: N点補間 ===")
    x_n = np.array([0, 1, 2, 3, 4, 5])
    y_n = np.array([0, 1, 4, 9, 16, 25])
    x_test_n = 2.5
    
    result_n = akima_interpolate_npoints(x_n, y_n, x_test_n)
    print(f"N点補間: x={x_test_n} のとき y={result_n:.4f}")
    
    print("\n=== サンプル3: 急峻な変化を含むデータ ===")
    
    x_data = np.array([0, 1, 2, 3, 4, 5, 6])
    y_data = np.array([0, 0.1, 2.2, 1, 5.1, 5.2, 5.3])
    
    x_interp = np.linspace(x_data.min(), x_data.max(), 100)
    
    results = compare_interpolation_methods(x_data, y_data, x_interp)
    print("\n補間手法の比較結果（x=2.5での値）:")
    for method, y_interp in results.items():
        if y_interp is not None:
            idx = np.argmin(np.abs(x_interp - 2.5))
            print(f"{method}: y={y_interp[idx]:.4f}")
    
    print("\n可視化を生成中...")
    visualize_comparison(x_data, y_data, x_interp, save_path='interpolation_comparison.png')
    visualize_akima_only(x_data, y_data, x_interp, save_path='akima_interpolation_only.png')
