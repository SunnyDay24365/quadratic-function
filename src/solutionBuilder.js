import { expandAFormula } from './mathUtils.js';

/**
 * 軸が動くタイプの解答HTMLを生成
  */
export function buildAxisSolutionHTML(questionData) {
        const { s, q, m, center } = questionData;
        const isPositive = s > 0;

        const valZero = expandAFormula(s, 0, q);
        const valM = expandAFormula(s, m, q);
        const valCenter = s * center * center + q;

        return `
<div class="space-y-6">
	<div>
		<span class="text-emerald-400 font-bold block mb-2">■ 最小値のまとめ</span>
		<ul class="list-none pl-4 space-y-2 text-slate-200 border-l border-emerald-500/30">
			${isPositive ? `
			<li>$a < 0$ のとき、 $${valZero}$ ($x = 0$ のとき)</li>
			<li>$0 \\le a \\le ${m}$ のとき、 $${q}$ ($x = a$ のとき)</li>
			<li>$a > ${m}$ のとき、 $${valM}$ ($x = ${m}$ のとき)</li>
			` : `
			<li>$a < ${center}$ のとき、 $${valM}$ ($x = ${m}$ のとき)</li>
			<li>$a = ${center}$ のとき、 $${valCenter}$ ($x = 0, ${m}$ のとき)</li>
			<li>$a > ${center}$ のとき、 $${valZero}$ ($x = 0$ のとき)</li>
			`}
		</ul>
	</div>
	<div>
		<span class="text-rose-400 font-bold block mb-2">■ 最大値のまとめ</span>
		<ul class="list-none pl-4 space-y-2 text-slate-200 border-l border-rose-500/30">
			${isPositive ? `
			<li>$a < ${center}$ のとき、 $${valM}$ ($x = ${m}$ のとき)</li>
			<li>$a = ${center}$ のとき、 $${valCenter}$ ($x = 0, ${m}$ のとき)</li>
			<li>$a > ${center}$ のとき、 $${valZero}$ ($x = 0$ のとき)</li>
			` : `
			<li>$a < 0$ のとき、 $${valZero}$ ($x = 0$ のとき)</li>
			<li>$0 \\le a \\le ${m}$ のとき、 $${q}$ ($x = a$ のとき)</li>
			<li>$a > ${m}$ のとき、 $${valM}$ ($x = ${m}$ のとき)</li>
			`}
		</ul>
	</div>
</div>
`;
}

import { expandAFormula } from './mathUtils.js';

/**
 * 定義域の片側が動くタイプの解答HTMLを生成
  */
export function buildRangeSolutionHTML(questionData) {
        const { s, p, q, k, m, subType } = questionData;
        const isPositive = s > 0;

        function evalFormulaAt(valOfA) {
                return s * Math.pow(valOfA - p, 2) + q;
        }

        if (subType === 0) {
                const borderK = k;
                const boundaryMaxVal = 2 * p - borderK;
                const yFixedK = s * Math.pow(borderK - p, 2) + q;
                const valA = expandAFormula(s, p, q);
                const valAtMaxVal = evalFormulaAt(boundaryMaxVal);

                return `
<div class="space-y-6">
	<div>
		<span class="text-emerald-400 font-bold block mb-2">■ 最小値のまとめ</span>
		<ul class="list-none pl-4 space-y-2 text-slate-200 border-l border-emerald-500/30">
			${isPositive ? `
			<li>・$${borderK} < a < ${p}$ のとき、 $${valA}$ ($x = a$ のとき)</li>
			<li>・$a \\ge ${p}$ のとき、 $${q}$ ($x = ${p}$ のとき)</li>
			` : `
			<li>・$${borderK} < a < ${boundaryMaxVal}$ のとき、 $${yFixedK}$ ($x = ${borderK}$ のとき)</li>
			<li>・$a = ${boundaryMaxVal}$ のとき、 $${valAtMaxVal}$ ($x = ${borderK}, ${boundaryMaxVal}$ のとき)</li>
			<li>・$a > ${boundaryMaxVal}$ のとき、 $${valA}$ ($x = a$ のとき)</li>
			`}
		</ul>
	</div>
	<div>
		<span class="text-rose-400 font-bold block mb-2">■ 最大値のまとめ</span>
		<ul class="list-none pl-4 space-y-2 text-slate-200 border-l border-rose-500/30">
			${isPositive ? `
			<li>・$${borderK} < a < ${boundaryMaxVal}$ のとき、 $${yFixedK}$ ($x = ${borderK}$ のとき)</li>
			<li>・$a = ${boundaryMaxVal}$ のとき、 $${valAtMaxVal}$ ($x = ${borderK}, ${boundaryMaxVal}$ のとき)</li>
			<li>・$a > ${boundaryMaxVal}$ のとき、 $${valA}$ ($x = a$ のとき)</li>
			` : `
			<li>・$${borderK} < a < ${p}$ のとき、 $${valA}$ ($x = a$ のとき)</li>
			<li>・$a \\ge ${p}$ のとき、 $${q}$ ($x = ${p}$ のとき)</li>
			`}
		</ul>
	</div>
</div>
`;
        } else {
                const borderM = m;
                const boundaryMaxVal = 2 * p - borderM;
                const yFixedM = s * Math.pow(borderM - p, 2) + q;
                const valA = expandAFormula(s, p, q);
                const valAtMaxVal = evalFormulaAt(boundaryMaxVal);

                return `
<div class="space-y-6">
	<div>
		<span class="text-emerald-400 font-bold block mb-2">■ 最小値のまとめ</span>
		<ul class="list-none pl-4 space-y-2 text-slate-200 border-l border-emerald-500/30">
			${isPositive ? `
			<li>・$a \\le ${p}$ のとき、 $${q}$ ($x = ${p}$ のとき)</li>
			<li>・$${p} < a < ${borderM}$ のとき、 $${valA}$ ($x = a$ のとき)</li>
			` : `
			<li>・$a < ${boundaryMaxVal}$ のとき、 $${valA}$ ($x = a$ のとき)</li>
			<li>・$a = ${boundaryMaxVal}$ のとき、 $${valAtMaxVal}$ ($x = ${boundaryMaxVal}, ${borderM}$ のとき)</li>
			<li>・$${boundaryMaxVal} < a < ${borderM}$ のとき、 $${yFixedM}$ ($x = ${borderM}$ のとき)</li>
			`}
		</ul>
	</div>
	<div>
		<span class="text-rose-400 font-bold block mb-2">■ 最大値のまとめ</span>
		<ul class="list-none pl-4 space-y-2 text-slate-200 border-l border-rose-500/30">
			${isPositive ? `
			<li>・$a < ${boundaryMaxVal}$ のとき、 $${valA}$ ($x = a$ のとき)</li>
			<li>・$a = ${boundaryMaxVal}$ のとき、 $${valAtMaxVal}$ ($x = ${boundaryMaxVal}, ${borderM}$ のとき)</li>
			<li>・$${boundaryMaxVal} < a < ${borderM}$ のとき、 $${yFixedM}$ ($x = ${borderM}$ のとき)</li>
			` : `
			<li>・$a \\le ${p}$ のとき、 $${q}$ ($x = ${p}$ のとき)</li>
			<li>・$${p} < a < ${borderM}$ のとき、 $${valA}$ ($x = a$ のとき)</li>
			`}
		</ul>
	</div>
</div>
`;
        }
}
/**
 *  * 固定タイプの解答HTMLを生成
  */
export function buildFixedSolutionHTML(questionData) {
        const { s, p, q, k, m } = questionData;

        const yK = s * Math.pow(k - p, 2) + q;
        const yM = s * Math.pow(m - p, 2) + q;

        const minResultStr = questionData.minX === 'both'
                ? `$${yK}$ ($x = ${k}, ${m}$ のとき)`
                : `$${s * Math.pow(questionData.minX - p, 2) + q}$ ($x = ${questionData.minX}$ のとき)`;

        const maxResultStr = questionData.maxX === 'both'
                ? `$${yK}$ ($x = ${k}, ${m}$ のとき)`
                : `$${s * Math.pow(questionData.maxX - p, 2) + q}$ ($x = ${questionData.maxX}$ のとき)`;

        return `
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
	<div class="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
		<span class="text-emerald-400 font-bold block mb-1">■ 最小値</span>
		<div class="text-slate-100 text-lg">${minResultStr}</div>
	</div>
	<div class="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
		<span class="text-rose-400 font-bold block mb-1">■ 最大値</span>
		<div class="text-slate-100 text-lg">${maxResultStr}</div>
	</div>
</div>
        `;
}

import { expandAFormula, formatNum } from './mathUtils.js';

/**
 * 定義域の幅が一定で動くタイプの解答HTMLを生成
  */
export function buildWidthSolutionHTML(questionData) {
        const { s, p, q, W } = questionData;
        const isPositive = s > 0;

        const boundaryMin1 = p - W;
        const boundaryMin2 = p;
        const boundaryMax = p - W / 2;

        const valLeft = expandAFormula(s, p, q);
        const valRight = expandAFormula(s, p - W, q);
        const valAtBoundary = s * Math.pow(boundaryMax - p, 2) + q;

        return `
<div class="space-y-6">
	<div>
		<span class="text-emerald-400 font-bold block mb-2">■ 最小値のまとめ</span>
		<ul class="list-none pl-4 space-y-2 text-slate-200 border-l border-emerald-500/30">
			${isPositive ? `
			<li>・$a < ${boundaryMin1}$ のとき、 $${valRight}$ ($x = a+${W}$ のとき)</li>
			<li>・$${boundaryMin1} \\le a \\le ${boundaryMin2}$ のとき、 $${q}$ ($x = ${p}$ のとき)</li>
			<li>・$a > ${boundaryMin2}$ のとき、 $${valLeft}$ ($x = a$ のとき)</li>
			` : `
			<li>・$a < ${boundaryMax}$ のとき、 $${valLeft}$ ($x = a$ のとき)</li>
			<li>・$a = ${boundaryMax}$ のとき、 $${valAtBoundary}$ ($x = ${formatNum(boundaryMax)}, ${formatNum(boundaryMax + W)}$ のとき)</li>
			<li>・$a > ${boundaryMax}$ のとき、 $${valRight}$ ($x = a+${W}$ のとき)</li>
			`}
		</ul>
	</div>
	<div>
		<span class="text-rose-400 font-bold block mb-2">■ 最大値のまとめ</span>
		<ul class="list-none pl-4 space-y-2 text-slate-200 border-l border-rose-500/30">
			${isPositive ? `
			<li>・$a < ${boundaryMax}$ のとき、 $${valLeft}$ ($x = a$ のとき)</li>
			<li>・$a = ${boundaryMax}$ のとき、 $${valAtBoundary}$ ($x = ${formatNum(boundaryMax)}, ${formatNum(boundaryMax + W)}$ のとき)</li>
			<li>・$a > ${boundaryMax}$ のとき、 $${valRight}$ ($x = a+${W}$ のとき)</li>
			` : `
			<li>・$a < ${boundaryMin1}$ のとき、 $${valRight}$ ($x = a+${W}$ のとき)</li>
			<li>・$${boundaryMin1} \\le a \\le ${boundaryMin2}$ のとき、 $${q}$ ($x = ${p}$ のとき)</li>
			<li>・$a > ${boundaryMin2}$ のとき、 $${valLeft}$ ($x = a$ のとき)</li>
			`}
		</ul>
	</div>
</div>
`;
}

import { buildFixedSolutionHTML } from './fixedSolution.js';
import { buildAxisSolutionHTML } from './axisSolution.js';
import { buildRangeSolutionHTML } from './rangeSolution.js';
import { buildWidthSolutionHTML } from './widthSolution.js';

/**
 * 渡された問題データに基づき、適切な解答HTML生成関数を呼び出します。
  */
export function buildSolutionHTML(questionData) {
        const { type } = questionData;

        switch (type) {
                case 'fixed':
                        return buildFixedSolutionHTML(questionData);
                case 'axis':
                        return buildAxisSolutionHTML(questionData);
                case 'range':
                        return buildRangeSolutionHTML(questionData);
                case 'width':
                        return buildWidthSolutionHTML(questionData);
                default:
                        return '';
        }
}