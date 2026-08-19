/**
 * Demo Platform - Frontend Logic
 * Handles tab switching, API calls, and export functionality.
 */

// ──────────────────────────────────────────────
// Configuration
// ──────────────────────────────────────────────
const API_BASE = 'http://localhost:8000';

// ──────────────────────────────────────────────
// Tab Switching
// ──────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Deactivate all tabs
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

        // Activate clicked tab
        btn.classList.add('active');
        const tabId = `tab-${btn.dataset.tab}`;
        document.getElementById(tabId).classList.add('active');
    });
});

// ──────────────────────────────────────────────
// Helper: Show result in a result area
// ──────────────────────────────────────────────
function showResult(elementId, html) {
    const el = document.getElementById(elementId);
    el.innerHTML = html;
}

function showError(elementId, message) {
    showResult(elementId, `<span class="error">❌ 错误: ${message}</span>`);
}

function showLoading(elementId) {
    showResult(elementId, '<span class="label">⏳ 加载中...</span>');
}

// ──────────────────────────────────────────────
// 1. Hello World
// ──────────────────────────────────────────────
document.getElementById('btn-helloworld').addEventListener('click', async () => {
    showLoading('result-helloworld');
    try {
        const resp = await fetch(`${API_BASE}/api/helloworld`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();

        showResult('result-helloworld', `
<span class="label">📡 接口响应</span>
<span class="success">✅ 调用成功</span>

<span class="label">Result:</span>  ${escapeHtml(data.result)}
<span class="label">Message:</span> ${escapeHtml(data.message)}
        `.trim());
    } catch (err) {
        showError('result-helloworld', err.message);
    }
});

// ──────────────────────────────────────────────
// 2. Hash Algorithm
// ──────────────────────────────────────────────
document.getElementById('btn-hash').addEventListener('click', async () => {
    const input = document.getElementById('hash-input').value;
    const algorithm = document.getElementById('hash-algo').value;

    if (!input.trim()) {
        showError('result-hash', '请输入要哈希的文本');
        return;
    }

    showLoading('result-hash');
    try {
        const resp = await fetch(`${API_BASE}/api/hash`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input, algorithm })
        });
        if (!resp.ok) {
            const errData = await resp.json();
            throw new Error(errData.detail || `HTTP ${resp.status}`);
        }
        const data = await resp.json();

        showResult('result-hash', `
<span class="label">📡 哈希计算结果</span>
<span class="success">✅ 计算成功</span>

<span class="label">输入文本:</span> ${escapeHtml(data.input)}
<span class="label">算法:</span>     ${escapeHtml(data.algorithm.toUpperCase())}
<span class="label">哈希值:</span>   ${escapeHtml(data.result)}
        `.trim());
    } catch (err) {
        showError('result-hash', err.message);
    }
});

// ──────────────────────────────────────────────
// 3. Bubble Sort
// ──────────────────────────────────────────────
document.getElementById('btn-bubble-sort').addEventListener('click', async () => {
    const rawInput = document.getElementById('sort-input').value;
    const arr = rawInput.split(',').map(s => parseInt(s.trim(), 10));

    if (arr.some(isNaN)) {
        showError('result-bubble-sort', '请输入有效的数字数组（逗号分隔）');
        return;
    }

    showLoading('result-bubble-sort');
    try {
        const resp = await fetch(`${API_BASE}/api/bubble-sort`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ array: arr })
        });
        if (!resp.ok) {
            const errData = await resp.json();
            throw new Error(errData.detail || `HTTP ${resp.status}`);
        }
        const data = await resp.json();

        let stepsHtml = '';
        const maxSteps = Math.min(data.steps.length, 30); // limit display
        for (let i = 0; i < maxSteps; i++) {
            stepsHtml += `<div class="step">Step ${i}: [${data.steps[i].join(', ')}]</div>`;
        }
        if (data.steps.length > 30) {
            stepsHtml += `<div class="step">... (共 ${data.steps.length} 步，仅展示前 30 步)</div>`;
        }

        showResult('result-bubble-sort', `
<span class="label">📡 冒泡排序结果</span>
<span class="success">✅ 排序完成</span>

<span class="label">原始数组:</span>   [${data.original.join(', ')}]
<span class="label">排序结果:</span>   [${data.result.join(', ')}]
<span class="label">总交换次数:</span> ${data.total_swaps}
<span class="label">总步骤数:</span>   ${data.steps.length}

<span class="label">排序过程:</span>
${stepsHtml}
        `.trim());
    } catch (err) {
        showError('result-bubble-sort', err.message);
    }
});

// ──────────────────────────────────────────────
// 4. Export
// ──────────────────────────────────────────────
document.getElementById('exportBtn').addEventListener('click', () => {
    // Determine which tab is currently active
    const activeTab = document.querySelector('.tab-btn.active');
    if (!activeTab) return;

    const tabType = activeTab.dataset.tab;
    const exportUrl = `${API_BASE}/api/export/${tabType}`;

    // Trigger download
    const link = document.createElement('a');
    link.href = exportUrl;
    link.download = `${tabType}_export.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// ──────────────────────────────────────────────
// Utility: Escape HTML
// ──────────────────────────────────────────────
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
