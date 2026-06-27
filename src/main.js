import { createQuestionData } from './questionGenerator.js';
import { drawGraphOnCanvas } from './graphDrawer.js';
import { renderMath, updateSliderUI, updateQuestionTextUI, updateActivePatternButton, toggleAnswerUI } from './uiController.js';

// アプリケーションの状態管理
let currentPattern = 'fixed';
let questionData = {};
let isAnswerVisible = false;
let sliderValue = 0.0;

const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

/**
 * Canvasサイズのピクセル比率最適化
  */
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth * window.devicePixelRatio;
    canvas.height = container.clientHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

/**
 * グラフィックの再描画
  */
function updateGraphView() {
    resizeCanvas();
    drawGraphOnCanvas(canvas, ctx, questionData, sliderValue);
}

/**
 * 新規問題生成タスクの実行ルーチン
  */
function generateQuestion() {
    // 1. データの生成
    questionData = createQuestionData(currentPattern);

    // 2. UIテキストや解答まとめの反映
    updateQuestionTextUI(currentPattern, questionData);

    // 3. スライダーの初期化
    sliderValue = updateSliderUI(questionData);

    // 4. レンダーと再描画
    renderMath();
    updateGraphView();
}

/**
 * ユーザーが新しいパターンを選択したときの処理
  */
function handleSelectPattern(pattern) {
    currentPattern = pattern;
    updateActivePatternButton(pattern);

    // 新パターン選択時は解答エリアを一度閉じる
    if (isAnswerVisible) {
        isAnswerVisible = false;
        toggleAnswerUI(isAnswerVisible);
    }

    generateQuestion();
}

/**
 * 解答トグルボタンのハンドラー
  */
function handleToggleAnswer() {
    isAnswerVisible = !isAnswerVisible;
    toggleAnswerUI(isAnswerVisible);
}

// 初期化とイベントバインド
window.addEventListener('DOMContentLoaded', () => {
    // DOMイベントの接続
    document.getElementById('btn-fixed').addEventListener('click', () => handleSelectPattern('fixed'));
    document.getElementById('btn-axis').addEventListener('click', () => handleSelectPattern('axis'));
    document.getElementById('btn-range').addEventListener('click', () => handleSelectPattern('range'));
    document.getElementById('btn-width').addEventListener('click', () => handleSelectPattern('width'));
    document.getElementById('btn-generate').addEventListener('click', generateQuestion);
    document.getElementById('btn-toggle-answer').addEventListener('click', handleToggleAnswer);

    // スライダー連動イベント
    const slider = document.getElementById('param-slider');
    slider.addEventListener('input', (e) => {
        sliderValue = parseFloat(e.target.value);
        document.getElementById('param-display').textContent = `${questionData.sliderConfig.name} = ${sliderValue.toFixed(1)}`;
        drawGraphOnCanvas(canvas, ctx, questionData, sliderValue);
    });

    // 初回実行
    handleSelectPattern('fixed');
    if (window.lucide) {
        lucide.createIcons();
    }
});

// リサイズ追従
window.addEventListener('resize', updateGraphView);