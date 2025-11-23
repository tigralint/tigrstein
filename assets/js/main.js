/* * OMEGA OS SYSTEM CORE v9.9
 * Controls: Audio, UI Effects, Glitches
 */

// --- 1. АУДИО СИСТЕМА (ЗВУКИ ИНТЕРФЕЙСА) ---
// Создай в папке audio файлы: click.mp3, hover.mp3, alarm.mp3 (или используй любые короткие звуки)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// Звук при наведении (тихий писк)
function soundHover() {
    playTone(800, 'sine', 0.05);
}

// Звук при клике (механический)
function soundClick() {
    playTone(400, 'square', 0.1);
    playTone(200, 'sawtooth', 0.1);
}

// Звук ошибки/отказа
function soundDeny() {
    playTone(150, 'sawtooth', 0.3);
    playTone(100, 'sawtooth', 0.3);
}

// --- 2. ЭФФЕКТ "МАТРИЦЫ" (ГЛИТЧ ТЕКСТА) ---
// При наведении на секретные слова они будут "шифроваться"
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&";

document.addEventListener('mouseover', event => {
    if (event.target.classList.contains('redacted') || event.target.tagName === 'H1') {
        let iterations = 0;
        const originalText = event.target.dataset.value || event.target.innerText;
        if(!event.target.dataset.value) event.target.dataset.value = originalText; // Сохраняем оригинал

        const interval = setInterval(() => {
            event.target.innerText = event.target.innerText
                .split("")
                .map((letter, index) => {
                    if(index < iterations) return originalText[index];
                    return letters[Math.floor(Math.random() * 26)];
                })
                .join("");
            
            if(iterations >= originalText.length) clearInterval(interval);
            iterations += 1 / 3;
        }, 30);
    }
});

// --- 3. ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Добавляем звуки ко всем кнопкам и ссылкам
    const interactives = document.querySelectorAll('button, a, .nav-btn, .card');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', soundHover);
        el.addEventListener('click', soundClick);
    });

    // Эффект "Печатной машинки" для элементов с классом .typewriter
    const typewriters = document.querySelectorAll('.typewriter');
    typewriters.forEach(el => {
        const text = el.innerText;
        el.innerText = '';
        let i = 0;
        const typeInterval = setInterval(() => {
            el.innerText += text.charAt(i);
            i++;
            if (i >= text.length) clearInterval(typeInterval);
        }, 20); // Скорость печати
    });

    console.log("SYSTEM: OMEGA CORE LOADED.");
});

// --- 4. ПАСХАЛКА (KONAMI CODE) ---
// Если ввести на клавиатуре "TRUMP", вылезет алерт
let keySequence = [];
document.addEventListener('keydown', (e) => {
    keySequence.push(e.key.toUpperCase());
    if (keySequence.length > 5) keySequence.shift();
    
    if (keySequence.join('') === 'TRUMP') {
        alert("AGENT ORANGE ACTIVATED: SENDING DIET COKE...");
        soundClick();
    }
    if (keySequence.join('') === 'SIGMA') {
        document.body.style.filter = "invert(1)"; // Инверсия цветов сайта
        setTimeout(() => document.body.style.filter = "invert(0)", 500);
    }
});