let pyodide;
let dataPoints = [
    { x: 0, y: 0 },
    { x: 1, y: 0.1 },
    { x: 2, y: 2.2 },
    { x: 3, y: 1 },
    { x: 4, y: 5.1 },
    { x: 5, y: 5.2 },
    { x: 6, y: 5.3 }
];

async function initPyodide() {
    try {
        if (typeof loadPyodide === 'undefined') {
            throw new Error('Pyodideが読み込まれていません。ページを再読み込みしてください。');
        }
        
        document.getElementById('loading').textContent = 'Pyodideを初期化中...';
        pyodide = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/" });
        
        document.getElementById('loading').textContent = 'NumPyとSciPyを読み込み中...';
        await pyodide.loadPackage(['numpy', 'scipy']);
        
        document.getElementById('loading').textContent = 'Akima補間コードを読み込み中...';
        const akimaCode = await fetch('akima_interpolation.py').then(r => r.text());
        const cleanCode = akimaCode.replace(/if __name__ == "__main__":[\s\S]*/, '');
        pyodide.runPython(cleanCode);
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        
        renderDataList();
        updateChart();
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').textContent = 'エラー: ' + error.message;
        console.error(error);
    }
}

function renderDataList() {
    const list = document.getElementById('data-list');
    list.innerHTML = '';
    
    dataPoints.forEach((point, index) => {
        const item = document.createElement('div');
        item.className = 'data-item';
        item.innerHTML = `
            <div class="data-item-header">
                <div class="data-item-value">#${index + 1}</div>
            </div>
            <div class="data-item-input-group">
                <div class="data-item-input-label">x軸</div>
                <input type="number" value="${point.x}" step="0.1" 
                       onchange="updateDataPoint(${index}, 'x', this.value)">
            </div>
            <div class="data-item-input-group">
                <div class="data-item-input-label">y軸</div>
                <input type="number" value="${point.y}" step="0.1" 
                       onchange="updateDataPoint(${index}, 'y', this.value)">
            </div>
            <button onclick="removeDataPoint(${index})">削除</button>
        `;
        list.appendChild(item);
    });
}

function addDataPoint() {
    const maxX = dataPoints.length > 0 ? Math.max(...dataPoints.map(p => p.x)) : 0;
    dataPoints.push({ x: maxX + 1, y: 0 });
    renderDataList();
    updateChart();
}

function removeDataPoint(index) {
    if (dataPoints.length <= 2) {
        showInfo('少なくとも2つのデータポイントが必要です');
        return;
    }
    dataPoints.splice(index, 1);
    renderDataList();
    updateChart();
}

function updateDataPoint(index, field, value) {
    dataPoints[index][field] = parseFloat(value) || 0;
    updateChart();
}

function showInfo(message) {
    const info = document.getElementById('info');
    info.textContent = message;
    info.style.display = 'block';
    setTimeout(() => {
        info.style.display = 'none';
    }, 3000);
}

function updateChart() {
    if (!pyodide || dataPoints.length < 2) {
        return;
    }
    
    try {
        const xData = dataPoints.map(p => p.x);
        const yData = dataPoints.map(p => p.y);
        
        const xMin = Math.min(...xData);
        const xMax = Math.max(...xData);
        const interpPoints = parseInt(document.getElementById('interp-points').value) || 100;
        
        const xInterp = [];
        for (let i = 0; i <= interpPoints; i++) {
            xInterp.push(xMin + (xMax - xMin) * i / interpPoints);
        }
        
        const showLinear = document.getElementById('show-linear').checked;
        const showCubic = document.getElementById('show-cubic').checked;
        
        const interpCode = `
import numpy as np
import json
from scipy.interpolate import interp1d, CubicSpline

x_data = np.array(${JSON.stringify(xData)}, dtype=np.float64)
y_data = np.array(${JSON.stringify(yData)}, dtype=np.float64)
x_interp = np.array(${JSON.stringify(xInterp)}, dtype=np.float64)

result_dict = {
    'x_interp': x_interp.tolist(),
    'akima': [],
    'linear': [],
    'cubic': []
}

# Akima補間
for x in x_interp:
    try:
        y = akima_interpolate_npoints(x_data, y_data, float(x))
        result_dict['akima'].append(float(y))
    except Exception as e:
        result_dict['akima'].append(None)

# 線形補間
if ${showLinear ? 'True' : 'False'}:
    try:
        linear_interp = interp1d(x_data, y_data, kind='linear', bounds_error=False, fill_value='extrapolate')
        result_dict['linear'] = linear_interp(x_interp).tolist()
    except Exception as e:
        result_dict['linear'] = [None] * len(x_interp)

# 3次スプライン補間
if ${showCubic ? 'True' : 'False'}:
    try:
        cubic_spline = CubicSpline(x_data, y_data, extrapolate=True)
        result_dict['cubic'] = cubic_spline(x_interp).tolist()
    except Exception as e:
        result_dict['cubic'] = [None] * len(x_interp)
`;
        
        pyodide.runPython(interpCode);
        const result = JSON.parse(pyodide.runPython('json.dumps(result_dict)'));
        
        const showPoints = document.getElementById('show-points').checked;
        const showGrid = document.getElementById('show-grid').checked;
        
        const traces = [];
        
        if (showPoints) {
            traces.push({
                x: xData,
                y: yData,
                mode: 'markers',
                name: 'データポイント',
                marker: {
                    size: 12,
                    color: '#0f172a',
                    line: { width: 2, color: '#fff' }
                },
                type: 'scatter'
            });
        }
        
        traces.push({
            x: result.x_interp,
            y: result.akima,
            mode: 'lines',
            name: 'Akima',
            line: {
                color: '#667eea',
                width: 3,
                shape: 'spline',
                smoothing: 1.3
            },
            type: 'scatter'
        });
        
        if (showLinear && result.linear.length > 0) {
            traces.push({
                x: result.x_interp,
                y: result.linear,
                mode: 'lines',
                name: 'リニア（Linear）',
                line: {
                    color: '#f59e0b',
                    width: 2.5,
                    dash: 'dash'
                },
                type: 'scatter'
            });
        }
        
        if (showCubic && result.cubic.length > 0) {
            traces.push({
                x: result.x_interp,
                y: result.cubic,
                mode: 'lines',
                name: 'Cubic スプライン（Cubic Spline）',
                line: {
                    color: '#10b981',
                    width: 2.5,
                    dash: 'dot'
                },
                type: 'scatter'
            });
        }
        
        // モバイル判定
        const isMobile = window.innerWidth <= 768;
        const isSmallMobile = window.innerWidth <= 480;
        
        // モバイル向けのレイアウト設定
        const layout = {
            title: {
                text: '',
                font: { size: 0 }
            },
            xaxis: {
                title: { 
                    text: 'x軸', 
                    font: { 
                        size: isSmallMobile ? 12 : isMobile ? 13 : 15, 
                        family: 'Inter, sans-serif', 
                        weight: 600 
                    },
                    standoff: isMobile ? 12 : 24
                },
                showgrid: showGrid,
                gridcolor: '#e2e8f0',
                gridwidth: 1,
                zeroline: false,
                linecolor: '#0f172a',
                linewidth: isMobile ? 1.5 : 2,
                tickfont: { 
                    size: isSmallMobile ? 10 : isMobile ? 11 : 12, 
                    color: '#64748b', 
                    family: 'Inter, sans-serif' 
                },
                titlefont: { color: '#475569' }
            },
            yaxis: {
                title: { 
                    text: 'y軸', 
                    font: { 
                        size: isSmallMobile ? 12 : isMobile ? 13 : 15, 
                        family: 'Inter, sans-serif', 
                        weight: 600 
                    },
                    standoff: isMobile ? 12 : 24
                },
                showgrid: showGrid,
                gridcolor: '#e2e8f0',
                gridwidth: 1,
                zeroline: false,
                linecolor: '#0f172a',
                linewidth: isMobile ? 1.5 : 2,
                tickfont: { 
                    size: isSmallMobile ? 10 : isMobile ? 11 : 12, 
                    color: '#64748b', 
                    family: 'Inter, sans-serif' 
                },
                titlefont: { color: '#475569' }
            },
            legend: {
                font: { 
                    size: isSmallMobile ? 11 : isMobile ? 12 : 13, 
                    family: 'Inter, sans-serif', 
                    weight: 500 
                },
                x: isMobile ? 0.01 : 0.02,
                y: isMobile ? 0.99 : 0.98,
                bgcolor: 'rgba(255,255,255,0.98)',
                bordercolor: '#e2e8f0',
                borderwidth: 1,
                borderradius: 8,
                xanchor: 'left',
                yanchor: 'top'
            },
            hovermode: 'closest',
            margin: isSmallMobile 
                ? { l: 50, r: 20, t: 30, b: 60 }
                : isMobile 
                    ? { l: 60, r: 30, t: 40, b: 70 }
                    : { l: 90, r: 50, t: 50, b: 90 },
            plot_bgcolor: '#ffffff',
            paper_bgcolor: '#ffffff',
            autosize: true
        };
        
        const config = {
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['lasso2d', 'select2d'],
            toImageButtonOptions: {
                format: 'png',
                filename: 'akima-spline',
                height: isMobile ? 400 : 600,
                width: isMobile ? window.innerWidth - 40 : 1200,
                scale: 2
            }
        };
        
        Plotly.newPlot('chart', traces, layout, config);
        
        document.getElementById('error').style.display = 'none';
    } catch (error) {
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').textContent = 'エラー: ' + error.message;
    }
}

function waitForPyodide() {
    return new Promise((resolve, reject) => {
        if (typeof loadPyodide !== 'undefined') {
            resolve();
            return;
        }
        
        let attempts = 0;
        const maxAttempts = 100;
        
        const checkInterval = setInterval(() => {
            attempts++;
            if (typeof loadPyodide !== 'undefined') {
                clearInterval(checkInterval);
                resolve();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                reject(new Error('Pyodideの読み込みに失敗しました。ネットワーク接続を確認してください。'));
            }
        }, 100);
    });
}

// ウィンドウリサイズ時の再描画処理
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (pyodide && dataPoints.length >= 2) {
            const chart = document.getElementById('chart');
            if (chart && chart.data) {
                Plotly.Plots.resize(chart);
            }
        }
    }, 250);
});

window.addEventListener('DOMContentLoaded', async () => {
    try {
        await waitForPyodide();
        await initPyodide();
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').textContent = 'エラー: ' + error.message;
        console.error(error);
    }
});

