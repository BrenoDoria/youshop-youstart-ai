// script.js - Versão com IA Real Integrada

let answers = { step1: null, step2: null, step3: null };

function selectOption(step, el) {
    const container = document.getElementById('opts' + step);
    container.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    answers['step' + step] = el.dataset.val;
    document.getElementById('btn' + step).disabled = false;
}

function goStep(num) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById('step' + num).classList.add('active');
    updateProgress(num);
}

function updateProgress(step) {
    const bar = document.getElementById('progress');
    bar.classList.add('visible');
    const labels = ['Escolhendo seu nicho', 'Definindo seu canal', 'Identificando seu obstáculo'];
    document.getElementById('progress-label').textContent = labels[step - 1];

    for (let i = 1; i <= 3; i++) {
        const el = document.getElementById('ps' + i);
        el.className = 'progress-step';
        if (i < step) el.classList.add('done');
        else if (i === step) el.classList.add('active');
    }
}

async function gerarPlano() {
    if (!answers.step1 || !answers.step2 || !answers.step3) {
        alert("Por favor, responda todas as 3 perguntas.");
        return;
    }

    document.getElementById('steps-card').style.display = 'none';
    document.getElementById('progress').style.display = 'none';
    document.getElementById('loading').classList.add('active');

    try {
      
        const response = await fetch("/api/gerarPlano", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nicho: answers.step1,
                canal: answers.step2,
                obstaculo: answers.step3
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const texto = data.candidates?.[0]?.content?.parts?.[0]?.text;

        /*console.log("TEXTO RECEBIDO:");
        console.log(texto);*/

        if (!texto) throw new Error("Resposta vazia");

        const jsonMatch = texto.match(/\{[\s\S]*\}/);
        const resultado = JSON.parse(jsonMatch[0]);

        mostrarResultadoIA(resultado);

    } catch (error) {
        console.error("Erro completo:", error);
        alert("Erro ao conectar com a IA (comum em ambiente local). Usando versão demonstrativa.");
        mostrarResultadoFallback();
    }
}

function mostrarResultadoIA(r) {
    document.getElementById('loading').classList.remove('active');
    document.getElementById('result').classList.add('active');

   document.getElementById('metric-row').innerHTML = `
        <div class="metric">
            <div class="metric-val">${r.tempo_estimado}</div>
            <div class="metric-label">Estimativa da IA</div>
        </div>

        <div class="metric">
            <div class="metric-val">${r.comissao}</div>
            <div class="metric-label">Comissão</div>
        </div>

        <div class="metric">
            <div class="metric-val">${r.conversao}</div>
            <div class="metric-label">Conversão média</div>
        </div>
    `;

    document.getElementById('produto-block').innerHTML = `<div class="plan-item"><div class="plan-item-num">★</div><div><strong>${r.produto}</strong></div></div>`;

    const planoHTML = r.plano
        .map((item, i) =>
            `<div class="plan-item">
            <div class="plan-item-num">${i+1}</div>
            <div>${item}</div>
            </div>`
        ).join('');
    document.getElementById('plano-block').innerHTML = planoHTML;

    document.getElementById('copy-text').textContent = r.copy;

    const iaHTML = r.ia_ajuda.map((item, i) => `<div class="plan-item"><div class="plan-item-num">${i+1}</div><div>${item}</div></div>`).join('');
    document.getElementById('ia-block').innerHTML = iaHTML;
}

function mostrarResultadoFallback() {
    document.getElementById('loading').classList.remove('active');
    document.getElementById('result').classList.add('active');
}

function copiarTexto() {
    const txt = document.getElementById('copy-text').textContent;
    navigator.clipboard.writeText(txt).then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.textContent = '✓ Copiado!';
        setTimeout(() => btn.textContent = 'Copiar', 2000);
    });
}

function reiniciar() {
    answers = { step1: null, step2: null, step3: null };
    document.getElementById('result').classList.remove('active');
    document.getElementById('steps-card').style.display = 'block';
    document.getElementById('progress').classList.remove('visible');
    document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
    document.getElementById('btn1').disabled = true;
    document.getElementById('btn2').disabled = true;
    document.getElementById('btn3').disabled = true;
    goStep(1);
}

document.addEventListener('DOMContentLoaded', () => {
    goStep(1);
});