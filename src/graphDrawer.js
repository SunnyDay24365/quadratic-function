import { formatNum } from './mathUtils.js';

/**
 * Canvasに2次関数の放物線や定義域、頂点マークをレンダリングします
  */
export function drawGraphOnCanvas(canvas, ctx, questionData, sliderValue) {
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;
    ctx.clearRect(0, 0, width, height);

    let s = questionData.s;
    let p, q, k, m;
    let currentA = sliderValue;

    if (questionData.type === 'fixed') {
        p = questionData.p;
        q = questionData.q;
        k = questionData.k;
        m = questionData.m;
    } else if (questionData.type === 'axis') {
        p = currentA;
        q = questionData.q;
        k = questionData.k;
        m = questionData.m;
    } else if (questionData.type === 'range') {
        p = questionData.p;
        q = questionData.q;
        if (questionData.subType === 0) {
            k = questionData.k;
            m = currentA;
        } else {
            k = currentA;
            m = questionData.m;
        }
    } else if (questionData.type === 'width') {
        p = questionData.p;
        q = questionData.q;
        k = currentA;
        m = currentA + questionData.W;
    }

    // グラフの座標系表示範囲を計算
    const viewMinX = Math.min(-2, k - 2, p - 2);
    const viewMaxX = Math.max(7, m + 2, p + 2);

    let viewMinY, viewMaxY;
    if (s > 0) {
        viewMinY = Math.min(-3, q - 2);
        viewMaxY = Math.max(12, s * Math.pow(viewMinX - p, 2) + q, s * Math.pow(viewMaxX - p, 2) + q);
    } else {
        viewMinY = Math.min(-12, s * Math.pow(viewMinX - p, 2) + q, s * Math.pow(viewMaxX - p, 2) + q);
        viewMaxY = Math.max(4, q + 2);
    }

    const padding = 40;
    const graphW = width - 2 * padding;
    const graphH = height - 2 * padding;

    function toPixelX(x) {
        return padding + ((x - viewMinX) / (viewMaxX - viewMinX)) * graphW;
    }
    function toPixelY(y) {
        return height - (padding + ((y - viewMinY) / (viewMaxY - viewMinY)) * graphH);
    }

    // 1) 座標軸と目盛りの描画
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(toPixelX(viewMinX), toPixelY(0));
    ctx.lineTo(toPixelX(viewMaxX), toPixelY(0));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toPixelX(0), toPixelY(viewMinY));
    ctx.lineTo(toPixelX(0), toPixelY(viewMaxY));
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let x = Math.ceil(viewMinX); x <= Math.floor(viewMaxX); x++) {
        if (x === 0) continue;
        ctx.fillText(x, toPixelX(x), toPixelY(0) + 5);
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = Math.ceil(viewMinY); y <= Math.floor(viewMaxY); y += 2) {
        if (y === 0) continue;
        ctx.fillText(y, toPixelX(0) - 5, toPixelY(y));
    }

    // 2) 定義域の背景塗りつぶし
    ctx.fillStyle = 'rgba(99, 102, 241, 0.08)';
    const xK = toPixelX(k);
    const xM = toPixelX(m);
    ctx.fillRect(xK, 0, xM - xK, height);

    ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(xK, 0); ctx.lineTo(xK, height);
    ctx.moveTo(xM, 0); ctx.lineTo(xM, height);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#818cf8';
    ctx.font = '12px font-semibold';
    ctx.textAlign = 'center';
    ctx.fillText('x = ' + k.toFixed(1), xK, 20);
    ctx.fillText('x = ' + m.toFixed(1), xM, 20);

    // 3) 放物線全体
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    let first = true;
    for (let px = viewMinX; px <= viewMaxX; px += 0.1) {
        const py = s * Math.pow(px - p, 2) + q;
        const screenX = toPixelX(px);
        const screenY = toPixelY(py);
        if (first) {
            ctx.moveTo(screenX, screenY);
            first = false;
        } else {
            ctx.lineTo(screenX, screenY);
        }
    }
    ctx.stroke();

    // 4) 定義域内のみの強調放物線
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    first = true;
    for (let px = k; px <= m; px += 0.05) {
        const py = s * Math.pow(px - p, 2) + q;
        const screenX = toPixelX(px);
        const screenY = toPixelY(py);
        if (first) {
            ctx.moveTo(screenX, screenY);
            first = false;
        } else {
            ctx.lineTo(screenX, screenY);
        }
    }
    ctx.stroke();

    // 5) 軸線の描画
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(toPixelX(p), 0);
    ctx.lineTo(toPixelX(p), height);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#34d399';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(` 軸 x = ${p.toFixed(1)}`, toPixelX(p), height - 25);

    // 6) 最大・最小ターゲット点マーク
    let minValX, maxValX;
    let minValX2 = null, maxValX2 = null;

    const yK = s * Math.pow(k - p, 2) + q;
    const yM = s * Math.pow(m - p, 2) + q;

    if (s > 0) {
        if (p < k) minValX = k;
        else if (p > m) minValX = m;
        else minValX = p;

        if (Math.abs(yK - yM) < 0.001) {
            maxValX = k; maxValX2 = m;
        } else if (yK > yM) {
            maxValX = k;
        } else {
            maxValX = m;
        }
    } else {
        if (p < k) maxValX = k;
        else if (p > m) maxValX = m;
        else maxValX = p;

        if (Math.abs(yK - yM) < 0.001) {
            minValX = k; minValX2 = m;
        } else if (yK < yM) {
            minValX = k;
        } else {
            minValX = m;
        }
    }

    function drawMinPoint(x, y) {
        ctx.fillStyle = '#06b6d4';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(toPixelX(x), toPixelY(y), 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Min', toPixelX(x), toPixelY(y));
    }

    function drawMaxPoint(x, y) {
        ctx.fillStyle = '#f43f5e';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(toPixelX(x), toPixelY(y), 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Max', toPixelX(x), toPixelY(y));
    }

    drawMinPoint(minValX, s * Math.pow(minValX - p, 2) + q);
    if (minValX2 !== null) {
        drawMinPoint(minValX2, s * Math.pow(minValX2 - p, 2) + q);
    }

    drawMaxPoint(maxValX, s * Math.pow(maxValX - p, 2) + q);
    if (maxValX2 !== null) {
        drawMaxPoint(maxValX2, s * Math.pow(maxValX2 - p, 2) + q);
    }
}