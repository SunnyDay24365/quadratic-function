/**
 *  * 数値を綺麗な文字列にフォーマットします（整数の場合は.0を表示しない）
  * @param {number} n 
   * @returns {string}
    */
export function formatNum(n) {
    return Number.isInteger(n) ? n.toString() : n.toFixed(1);
}

/**
 * 2次関数の一般形 (y = Ax^2 + Bx + C) のLaTeX文字列を出力します
  */
export function formatQuadratic(A, B, C) {
    let termA = "";
    if (A === 1) termA = "x^2";
    else if (A === -1) termA = "-x^2";
    else termA = `${A}x^2`;

    let termB = "";
    if (B > 0) {
        termB = B === 1 ? " + x" : ` + ${B}x`;
    } else if (B < 0) {
        termB = B === -1 ? " - x" : ` - ${Math.abs(B)}x`;
    }

    let termC = "";
    if (C > 0) {
        termC = ` + ${C}`;
    } else if (C < 0) {
        termC = ` - ${Math.abs(C)}`;
    }
    return `${termA}${termB}${termC}`;
}

/**
 * 軸が文字aで移動するパターンの一般形 (y = sx^2 - 2sax + sa^2 + q) のLaTeX文字列を出力します
  */
export function formatAxisShift(s, q) {
    let termA = "";
    if (s === 1) termA = "x^2";
    else if (s === -1) termA = "-x^2";
    else termA = `${s}x^2`;

    let coeffB = -2 * s;
    let termB = "";
    if (coeffB === 1) termB = " + ax";
    else if (coeffB === -1) termB = " - ax";
    else if (coeffB > 0) termB = ` + ${coeffB}ax`;
    else if (coeffB < 0) termB = ` - ${Math.abs(coeffB)}ax`;

    let termC = "";
    if (s === 1) termC = " + a^2";
    else if (s === -1) termC = " - a^2";
    else if (s > 0) termC = ` + ${s}a^2`;
    else if (s < 0) termC = ` - ${Math.abs(s)}a^2`;

    if (q > 0) termC += ` + ${q}`;
    else if (q < 0) termC += ` - ${Math.abs(q)}`;

    return `${termA}${termB}${termC}`;
}

/**
 * 2次式 s(a - C)^2 + D を展開した多項式文字列を生成します
  * s(a^2 - 2Ca + C^2) + D = s a^2 - 2sC a + s C^2 + D
   */
export function expandAFormula(s, C, D) {
    let coeffA2 = s;
    let coeffA = -2 * s * C;
    let constTerm = s * C * C + D;

    let termA2 = "";
    if (coeffA2 === 1) termA2 = "a^2";
    else if (coeffA2 === -1) termA2 = "-a^2";
    else termA2 = `${coeffA2}a^2`;

    let termA = "";
    if (coeffA > 0) {
        termA = coeffA === 1 ? " + a" : ` + ${coeffA}a`;
    } else if (coeffA < 0) {
        termA = coeffA === -1 ? " - a" : ` - ${Math.abs(coeffA)}a`;
    }

    let termConst = "";
    if (constTerm > 0) {
        termConst = ` + ${constTerm}`;
    } else if (constTerm < 0) {
        termConst = ` - ${Math.abs(constTerm)}`;
    }

    if (coeffA2 === 0 && coeffA === 0) return `${constTerm}`;
    return `${termA2}${termA}${termConst}`;
}

/**
 * 指定範囲内のランダムな整数を生成します
  */
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 下に凸 / 上に凸の放物線係数 (1, -1, 2, -2) をランダムに決定します
  */
export function getRandomS() {
    const isPositive = getRandomInt(0, 1) === 0;
    const size = getRandomInt(1, 2);
    return isPositive ? size : -size;
}