import { getRandomInt, getRandomS, formatQuadratic, formatAxisShift, expandAFormula } from './mathUtils.js';

/**
 * 1. 固定パターンの生成
  */
function generateFixed() {
    const s = getRandomS();
    const p = getRandomInt(1, 5);
    const q = getRandomInt(-3, 3);

    const rel = getRandomInt(0, 3);
    let k, m;
    if (rel === 0) {
        k = p + getRandomInt(1, 2);
        m = k + getRandomInt(2, 3);
    } else if (rel === 1) {
        k = p - getRandomInt(1, 2);
        m = p + getRandomInt(3, 4);
    } else if (rel === 2) {
        k = p - getRandomInt(3, 4);
        m = p + getRandomInt(1, 2);
    } else {
        m = p - getRandomInt(1, 2);
        k = m - getRandomInt(2, 3);
    }

    const A = s;
    const B = -2 * s * p;
    const C = s * p * p + q;

    const latexFunc = `y = ${formatQuadratic(A, B, C)}`;
    const latexRange = `${k} \\le x \\le ${m}`;
    const center = (k + m) / 2;

    let minX, maxX;
    if (s > 0) {
        if (p < k) minX = k;
        else if (p > m) minX = m;
        else minX = p;

        if (Math.abs(k - p) > Math.abs(m - p)) maxX = k;
        else if (Math.abs(k - p) < Math.abs(m - p)) maxX = m;
        else maxX = "both";
    } else {
        if (p < k) maxX = k;
        else if (p > m) maxX = m;
        else maxX = p;

        if (Math.abs(k - p) > Math.abs(m - p)) minX = k;
        else if (Math.abs(k - p) < Math.abs(m - p)) minX = m;
        else minX = "both";
    }

    return {
        s, p, q, k, m,
        latexFunc, latexRange,
        type: 'fixed',
        center,
        minX, maxX,
        sliderConfig: { show: false }
    };
}

/**
 * 2. 軸移動パターンの生成
  */
function generateAxis() {
    const s = getRandomS();
    const k = 0;
    const m = getRandomInt(2, 4);
    const q = getRandomInt(-1, 2);

    const latexFunc = `y = ${formatAxisShift(s, q)}`;
    const latexRange = `${k} \\le x \\le ${m}`;
    const center = (k + m) / 2;

    return {
        s, p: null, q, k, m,
        latexFunc, latexRange,
        type: 'axis',
        center,
        sliderConfig: {
            show: true,
            min: k - 2,
            max: m + 2,
            default: (k + m) / 2,
            name: 'a'
        }
    };
}

/**
 * 3. 範囲移動パターンの生成
  */
function generateRange() {
    const s = getRandomS();
    const p = getRandomInt(1, 4);
    const q = getRandomInt(-2, 2);

    const A = s;
    const B = -2 * s * p;
    const C = s * p * p + q;

    const latexFunc = `y = ${formatQuadratic(A, B, C)}`;

    const subType = getRandomInt(0, 1);
    let latexRange = "";
    let k, m;
    let sliderConfig = {};

    if (subType === 0) {
        k = getRandomInt(-1, 1);
        m = null;
        latexRange = `${k} \\le x \\le a \\quad (a > ${k})`;
        sliderConfig = {
            show: true,
            min: k + 0.5,
            max: Math.max(k + 4.5, 2 * p - k + 1.5),
            default: p,
            name: 'a'
        };
    } else {
        k = null;
        m = getRandomInt(3, 5);
        latexRange = `a \\le x \\le ${m} \\quad (a < ${m})`;
        sliderConfig = {
            show: true,
            min: Math.min(m - 4.5, 2 * p - m - 1.5),
            max: m - 0.5,
            default: p,
            name: 'a'
        };
    }

    return {
        s, p, q, k, m, subType,
        type: 'range',
        latexFunc, latexRange,
        sliderConfig
    };
}

/**
 * 4. 幅移動パターンの生成
  */
function generateWidth() {
    const s = getRandomS();
    const p = getRandomInt(2, 4);
    const q = getRandomInt(-2, 2);
    const W = getRandomInt(2, 3);

    const A = s;
    const B = -2 * s * p;
    const C = s * p * p + q;

    const latexFunc = `y = ${formatQuadratic(A, B, C)}`;
    const latexRange = `a \\le x \\le a + ${W}`;

    return {
        s, p, q, W,
        type: 'width',
        latexFunc, latexRange,
        sliderConfig: {
            show: true,
            min: p - W - 2,
            max: p + 2,
            default: p - W / 2,
            name: 'a'
        }
    };
}

/**
 * パターンに基づいた問題データ作成の統合インターフェース
  */
export function createQuestionData(pattern) {
    switch (pattern) {
        case 'fixed': return generateFixed();
        case 'axis': return generateAxis();
        case 'range': return generateRange();
        case 'width': return generateWidth();
        default: return generateFixed();
    }
}