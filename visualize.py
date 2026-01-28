import numpy as np
from typing import Optional
import matplotlib.pyplot as plt
import matplotlib
import matplotlib.font_manager as fm
import platform
from scipy.interpolate import interp1d, CubicSpline
from akima_interpolation import akima_interpolate_npoints

AKIMA_COLOR = '#1f77b4'


def setup_japanese_font():
    system = platform.system()
    font_name = None
    
    if system == 'Darwin':
        font_name = 'Hiragino Sans'
    elif system == 'Windows':
        font_name = 'MS UI Gothic'
    else:
        font_name = 'Noto Sans CJK JP'
    
    try:
        if font_name:
            font_list = [f.name for f in fm.fontManager.ttflist]
            if font_name in font_list:
                matplotlib.rcParams['font.family'] = font_name
            else:
                sans_serif_fonts = [f for f in font_list if any(keyword in f for keyword in ['Hiragino', 'Noto Sans', 'MS UI', 'Yu Gothic', 'Meiryo'])]
                if sans_serif_fonts:
                    matplotlib.rcParams['font.family'] = sans_serif_fonts[0]
                else:
                    matplotlib.rcParams['font.family'] = 'sans-serif'
        else:
            matplotlib.rcParams['font.family'] = 'sans-serif'
        
        matplotlib.rcParams['axes.unicode_minus'] = False
        
        if isinstance(matplotlib.rcParams['font.family'], list):
            matplotlib.rcParams['font.family'] = matplotlib.rcParams['font.family'][0]
        
        matplotlib.rcParams['font.weight'] = 'normal'
    except Exception as e:
        matplotlib.rcParams['font.family'] = 'sans-serif'
        matplotlib.rcParams['axes.unicode_minus'] = False
        matplotlib.rcParams['font.weight'] = 'normal'


def compare_interpolation_methods(x_data: np.ndarray, y_data: np.ndarray, x_interp: np.ndarray) -> dict:
    results = {}
    
    akima_results = np.array([akima_interpolate_npoints(x_data, y_data, x) for x in x_interp])
    results['Akima'] = akima_results
    
    linear_interp = interp1d(x_data, y_data, kind='linear', bounds_error=False, fill_value='extrapolate')
    results['線形補間'] = linear_interp(x_interp)
    
    try:
        cubic_spline = CubicSpline(x_data, y_data, extrapolate=True)
        results['3次スプライン'] = cubic_spline(x_interp)
    except Exception as e:
        print(f"3次スプライン補間でエラー: {e}")
        results['3次スプライン'] = None
    
    return results


def visualize_comparison(x_data: np.ndarray, y_data: np.ndarray, x_interp: np.ndarray, save_path: Optional[str] = None):
    setup_japanese_font()
    
    current_font = matplotlib.rcParams['font.family']
    if isinstance(current_font, list):
        current_font = current_font[0] if current_font else 'sans-serif'
    
    title_size = 28
    label_size = 20
    legend_size = 22
    tick_size = 18
    
    font_prop_normal = fm.FontProperties(family=current_font, weight=600, size=label_size)
    font_prop_bold = fm.FontProperties(family=current_font, weight=700, size=title_size)
    font_prop_legend = fm.FontProperties(family=current_font, weight=600, size=legend_size)
    
    results = compare_interpolation_methods(x_data, y_data, x_interp)
    
    plt.figure(figsize=(12, 8))
    
    plt.plot(x_data, y_data, 'ko', markersize=10, label='元のデータ点', zorder=5)
    
    color_map = {
        'Akima': AKIMA_COLOR,
        '線形補間': '#ff7f0e',
        '3次スプライン': '#2ca02c'
    }
    
    for method, y_interp in results.items():
        if y_interp is not None:
            color = color_map.get(method, None)
            plt.plot(x_interp, y_interp, label=method, linewidth=2, color=color)
    
    plt.xlabel('x', fontproperties=font_prop_normal)
    plt.ylabel('y', fontproperties=font_prop_normal)
    plt.title('補間手法の比較', fontproperties=font_prop_bold)
    plt.legend(prop=font_prop_legend, framealpha=0.9)
    plt.tick_params(labelsize=tick_size)
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"画像を保存しました: {save_path}")
    else:
        plt.show()
    
    plt.close()


def visualize_akima_only(x_data: np.ndarray, y_data: np.ndarray, x_interp: np.ndarray, save_path: Optional[str] = None):
    setup_japanese_font()
    
    current_font = matplotlib.rcParams['font.family']
    if isinstance(current_font, list):
        current_font = current_font[0] if current_font else 'sans-serif'
    
    title_size = 28
    label_size = 20
    legend_size = 22
    tick_size = 18
    
    font_prop_normal = fm.FontProperties(family=current_font, weight=600, size=label_size)
    font_prop_bold = fm.FontProperties(family=current_font, weight=700, size=title_size)
    font_prop_legend = fm.FontProperties(family=current_font, weight=600, size=legend_size)
    
    akima_results = np.array([akima_interpolate_npoints(x_data, y_data, x) for x in x_interp])
    
    plt.figure(figsize=(12, 8))
    
    plt.plot(x_data, y_data, 'ko', markersize=10, label='元のデータ点', zorder=5)
    plt.plot(x_interp, akima_results, color=AKIMA_COLOR, label='Akima', linewidth=2.5)
    
    plt.xlabel('x', fontproperties=font_prop_normal)
    plt.ylabel('y', fontproperties=font_prop_normal)
    plt.title('Akima', fontproperties=font_prop_bold)
    plt.legend(prop=font_prop_legend, framealpha=0.9)
    plt.tick_params(labelsize=tick_size)
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"画像を保存しました: {save_path}")
    else:
        plt.show()
    
    plt.close()
