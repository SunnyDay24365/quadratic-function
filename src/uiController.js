import { buildSolutionHTML } from './solutionBuilder.js';

/**
 * 数式のKaTeXレンダリングを反映します
  */
export function renderMath() {
    if (window.renderMathInElement) {
        renderMathInElement(document.body, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '\\(', right: '\\)', display: false },
                { left: '$', right: '$', display: false }
            ],
            throwOnError: false
        });
    }
}

/**
 * スライダーUIの初期範囲や表示テキストを設定・同期します
  */
export function updateSliderUI(questionData) {
    const ctrl = document.getElementById('parameter-control');
    if (questionData.sliderConfig.show) {
        ctrl.classList.remove('hidden');
        document.getElementById('param-name').textContent = questionData.sliderConfig.name;

        const slider = document.getElementById('param-slider');
        slider.min = questionData.sliderConfig.min;
        slider.max = questionData.sliderConfig.max;
        slider.step = 0.1;
        slider.value = questionData.sliderConfig.default;

        document.getElementById('slider-min').textContent = parseFloat(slider.min).toFixed(1);
        document.getElementById('slider-max').textContent = parseFloat(slider.max).toFixed(1);
        document.getElementById('param-display').textContent = `${questionData.sliderConfig.name} = ${parseFloat(slider.value).toFixed(1)}`;
        return parseFloat(slider.value);
    } else {
        ctrl.classList.add('hidden');
        return 0.0;
    }
}

/**
 * 画面上のテキストや解答エリアを問題データに合わせて更新します
  */
export function updateQuestionTextUI(currentPattern, questionData) {
    const qEl = document.getElementById('question-text');
    qEl.innerHTML = `2次関数 <span class="text-indigo-600 font-semibold">\\(${questionData.latexFunc}\\)</span> の、定義域 <span class="text-indigo-600 font-semibold">\\(${questionData.latexRange}\\)</span> における最大値と最小値を求めよ。`;

    const badge = document.getElementById('pattern-badge');
    const titles = {
        fixed: 'パターン1: 固定',
        axis: 'パターン2: 軸移動',
        range: 'パターン3: 範囲移動',
        width: 'パターン4: 幅移動'
    };
    badge.textContent = titles[currentPattern];

    // 解答まとめHTMLをビルドして注入
    document.getElementById('summary-solution').innerHTML = buildSolutionHTML(questionData);
}

/**
 * パターンボタンの見た目（アクティブ状態）を切り替えます
  */
export function updateActivePatternButton(pattern) {
    document.querySelectorAll('.pattern-btn').forEach(btn => {
        btn.classList.remove('border-indigo-600', 'bg-indigo-50/50', 'ring-2', 'ring-indigo-500/20');
        btn.classList.add('border-slate-200');
    });

    const activeBtn = document.getElementById(`btn-${pattern}`);
    if (activeBtn) {
        activeBtn.classList.remove('border-slate-200');
        activeBtn.classList.add('border-indigo-600', 'bg-indigo-50/50', 'ring-2', 'ring-indigo-500/20');
    }
}

/**
 * 解答表示・非表示のトグル表示状態を切り替えます
  */
export function toggleAnswerUI(isAnswerVisible) {
    const section = document.getElementById('answer-section');
    const btnText = document.getElementById('answer-btn-text');
    const icon = document.getElementById('answer-icon');

    if (isAnswerVisible) {
        section.classList.remove('hidden');
        btnText.textContent = '解答を隠す';
        icon.setAttribute('data-lucide', 'eye-off');
    } else {
        section.classList.add('hidden');
        btnText.textContent = '解答を表示';
        icon.setAttribute('data-lucide', 'eye');
    }
    if (window.lucide) {
        lucide.createIcons();
    }
}