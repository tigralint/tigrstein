/* * OMEGA OS SYSTEM CORE v10.0
 * Handles: Audio, UI Effects, Global Events
 */

// --- 1. АУДИО СИСТЕМА (Синтезатор звуков) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, vol = 0.1) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// Звук наведения (высокочастотный писк)
function soundHover() {
    playTone(800, 'sine', 0.05, 0.05);
}

// Звук клика (механический/компьютерный)
function soundClick() {
    playTone(300, 'square', 0.05, 0.1);
    setTimeout(() => playTone(150, 'sawtooth', 0.05, 0.1), 50);
}

// Звук ошибки (низкий базз)
function soundDeny() {
    playTone(100, 'sawtooth', 0.3, 0.2);
    playTone(80, 'square', 0.3, 0.2);
}

// Звук печати текста
function soundType() {
    playTone(600 + Math.random() * 200, 'square', 0.03, 0.05);
}

// --- 2. ГЛОБАЛЬНЫЕ ЭФФЕКТЫ ---

// Функция для добавления "Входящего звонка" (Injects HTML)
function triggerIncomingCall() {
    // Проверка, есть ли уже звонок
    if(document.getElementById('incoming-overlay')) return;

    soundClick();
    
    // Создаем оверлей
    const overlay = document.createElement('div');
    overlay.id = 'incoming-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.9); z-index: 10000;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        animation: flashRed 1s infinite;
    `;
    
    overlay.innerHTML = `
        <style>
            @keyframes flashRed { 0% {box-shadow: inset 0 0 0 red;} 50% {box-shadow: inset 0 0 100px red;} 100% {box-shadow: inset 0 0 0 red;} }
            .call-card { border: 2px solid red; padding: 40px; background: #000; text-align: center; max-width: 400px; }
            .call-img { width: 150px; height: 150px; border-radius: 50%; border: 3px solid red; object-fit: cover; margin-bottom: 20px; animation: shake 0.5s infinite; }
            @keyframes shake { 0% {transform: translate(0,0);} 25% {transform: translate(2px,2px);} 50% {transform: translate(-2px,-2px);} 75% {transform: translate(-2px,2px);} }
        </style>
        <div class="call-card">
            <h1 style="color: red; margin: 0;">INCOMING ENCRYPTED CONNECTION</h1>
            <p style="color: #fff; letter-spacing: 2px; margin: 20px 0;">SOURCE: UNKNOWN (SECTOR 7)</p>
            <img src="../assets/img/epstein_mugshot.jpg" class="call-img" alt="Caller"> <div style="display: flex; gap: 20px; justify-content: center;">
                <button class="btn" onclick="acceptCall()" style="border-color: #00ff41; color: #00ff41;">ACCEPT</button>
                <button class="btn" onclick="rejectCall()" style="border-color: red; color: red;">DENY</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);

    // Звук рингтона (цикл)
    window.ringInterval = setInterval(() => {
        playTone(800, 'square', 0.1);
        setTimeout(() => playTone(600, 'square', 0.1), 150);
    }, 1000);
}

window.rejectCall = function() {
    clearInterval(window.ringInterval);
    const overlay = document.getElementById('incoming-overlay');
    if(overlay) overlay.remove();
    soundDeny();
};

window.acceptCall = function() {
    clearInterval(window.ringInterval);
    const overlay = document.getElementById('incoming-overlay');
    overlay.innerHTML = `
        <div style="color: var(--term-green); font-size: 20px; font-family: 'Courier New'; text-align: center;">
            CONNECTING... <br><br>
            <span style="color: red;">ERROR: SIGNAL LOST due to Solar Flare.</span>
        </div>
    `;
    setTimeout(() => {
        if(overlay) overlay.remove();
    }, 3000);
};

// --- 3. ИНИЦИАЛИЗАЦИЯ (вешаем звуки на кнопки) ---
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button, a, .nav-btn').forEach(el => {
        el.addEventListener('mouseenter', soundHover);
        el.addEventListener('click', () => {
            if(audioCtx.state === 'suspended') audioCtx.resume();
            soundClick();
        });
    });
    console.log("OMEGA CORE: AUDIO SYSTEM ONLINE.");
});